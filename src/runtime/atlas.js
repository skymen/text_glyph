const PAGE_SIZE = 1024;
const PAD = 2;
const MAX_PAGES = 8;

// Rasterization size buckets, so a slowly zooming layer does not create a new
// strike every frame.
export function bucketPpem(ppem) {
  ppem = Math.max(1, ppem);
  if (ppem <= 24) return Math.round(ppem);
  if (ppem <= 96) return Math.round(ppem / 4) * 4;
  if (ppem <= 256) return Math.round(ppem / 16) * 16;
  return Math.min(1024, Math.round(ppem / 64) * 64);
}

class Page {
  constructor() {
    this.canvas = new OffscreenCanvas(PAGE_SIZE, PAGE_SIZE);
    this.ctx = this.canvas.getContext("2d");
    this.shelves = [];
    this.nextY = 0;
    this.texture = null;
    this.dirty = true;
  }

  alloc(w, h) {
    for (const s of this.shelves) {
      if (h <= s.h && h >= s.h * 0.7 && s.x + w <= PAGE_SIZE) {
        const r = { x: s.x, y: s.y };
        s.x += w;
        return r;
      }
    }
    if (this.nextY + h > PAGE_SIZE) return null;
    const s = { y: this.nextY, h, x: w };
    this.shelves.push(s);
    this.nextY += h;
    return { x: 0, y: s.y };
  }
}

// Shared cache of rasterized glyphs. One entry per
// (face, glyph id, ppem bucket, fake bold, stroke width).
export class GlyphAtlas {
  constructor() {
    this.pages = [];
    this.cache = new Map();
    this.pendingReset = false;
    this.white = null;
    this._releaseWith = null;
  }

  // Pages are canvases, created on first use so the atlas can exist without a DOM.
  _ensure() {
    if (!this.pages.length) this._init();
  }

  _init() {
    this.pages = [];
    this.cache.clear();
    const page = this._newPage();
    page.ctx.fillStyle = "#fff";
    page.ctx.fillRect(0, 0, 4, 4);
    page.shelves.push({ y: 0, h: 8, x: 8 });
    page.nextY = 8;
    this.white = { page, u0: 1 / PAGE_SIZE, v0: 1 / PAGE_SIZE, u1: 3 / PAGE_SIZE, v1: 3 / PAGE_SIZE };
  }

  _newPage() {
    const page = new Page();
    this.pages.push(page);
    return page;
  }

  // Call once per frame before requesting entries. A reset only happens here so
  // entries handed out during a frame stay valid for that frame.
  beginFrame(renderer) {
    this._ensure();
    if (!this.pendingReset) return;
    this.pendingReset = false;
    this.releaseTextures(renderer);
    this._init();
  }

  releaseTextures(renderer) {
    for (const page of this.pages) {
      if (page.texture) {
        renderer.deleteTexture(page.texture);
        page.texture = null;
      }
      page.dirty = true;
    }
  }

  // Marks every page for re-upload (renderer context restored).
  invalidateTextures() {
    for (const page of this.pages) {
      page.texture = null;
      page.dirty = true;
    }
  }

  // face: FontManager record. strokePx: outward outline width in raster px, 0 for a fill.
  // Keyed by face, then by a number packing glyph id, ppem, fake bold and
  // stroke width, so a lookup allocates nothing.
  get(face, glyphId, ppem, fakeBold, strokePx) {
    this._ensure();
    let perFace = this.cache.get(face.key);
    if (!perFace) {
      perFace = new Map();
      this.cache.set(face.key, perFace);
    }
    const key =
      glyphId + ppem * 65536 + (fakeBold ? 268435456 : 0) + Math.min(4095, strokePx * 2) * 536870912;
    const cached = perFace.get(key);
    if (cached !== undefined) return cached;
    const entry = this._raster(face, glyphId, ppem, fakeBold, strokePx);
    perFace.set(key, entry);
    return entry;
  }

  _raster(face, glyphId, ppem, fakeBold, strokePx) {
    const glyph = face.otf.glyphs.get(glyphId);
    if (!glyph) return null;
    const path = glyph.getPath(0, 0, ppem);
    if (!path.commands.length) return null;
    const bb = path.getBoundingBox();
    if (!(bb.x2 > bb.x1) || !(bb.y2 > bb.y1)) return null;
    const boldPx = fakeBold ? Math.max(0.5, ppem / 32) : 0;
    const extra = strokePx + boldPx + PAD;
    const x0 = Math.floor(bb.x1 - extra);
    const y0 = Math.floor(bb.y1 - extra);
    const w = Math.ceil(bb.x2 + extra) - x0;
    const h = Math.ceil(bb.y2 + extra) - y0;
    if (w > PAGE_SIZE || h > PAGE_SIZE) return null;

    let page = this.pages[this.pages.length - 1];
    let pos = page.alloc(w, h);
    if (!pos) {
      if (this.pages.length >= MAX_PAGES) this.pendingReset = true;
      page = this._newPage();
      pos = page.alloc(w, h);
    }
    const ctx = page.ctx;
    ctx.save();
    ctx.translate(pos.x - x0, pos.y - y0);
    const p2d = new Path2D(path.toPathData(3));
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    ctx.lineJoin = "round";
    if (strokePx > 0) {
      ctx.lineWidth = strokePx * 2 + boldPx * 2;
      ctx.stroke(p2d);
    } else {
      ctx.fill(p2d);
      if (boldPx > 0) {
        ctx.lineWidth = boldPx * 2;
        ctx.stroke(p2d);
      }
    }
    ctx.restore();
    page.dirty = true;
    return {
      page,
      u0: pos.x / PAGE_SIZE,
      v0: pos.y / PAGE_SIZE,
      u1: (pos.x + w) / PAGE_SIZE,
      v1: (pos.y + h) / PAGE_SIZE,
      ox: x0, // raster px from the pen origin to the quad's left edge
      oy: y0, // raster px from the baseline to the quad's top edge (negative above)
      w,
      h,
    };
  }

  // Uploads dirty pages. Call before drawing.
  flush(renderer) {
    for (const page of this.pages) {
      if (!page.texture) {
        page.texture = renderer.createDynamicTexture(PAGE_SIZE, PAGE_SIZE, {
          mipMap: false,
          defaultSampling: "bilinear",
        });
        page.dirty = true;
      }
      if (page.dirty) {
        renderer.updateTexture(page.canvas, page.texture, { premultiplyAlpha: true });
        page.dirty = false;
      }
    }
  }
}
