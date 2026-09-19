// Layout and drawing shared by the runtime and the editor. Nothing in here
// touches Construct APIs directly: the host passes a gfx adapter and a frame
// description into draw(), and resolves icons and flow exclusions.
import { FontManager } from "./fontManager.js";
import { GlyphAtlas, bucketPpem } from "./atlas.js";
import { parseBBCode, graphemeEnds, stripTags } from "./bbcode.js";
import { simpleLayout } from "./simpleLayout.js";

export const PT_TO_PX = 4 / 3;
export const WRAP = ["word", "character", "none"];
export const DIRECTION = ["ltr", "rtl", "auto"];
export const WRAP_SIDES = ["both", "inline-start", "inline-end", "largest"];
const FAKE_ITALIC_SHEAR = 0.2;
const CHUNK_QUADS = 2048;
const UNBOUNDED = 1e6;
const SCRATCH_OUT = new Float64Array(8);
const SCRATCH_PTS = new Float64Array(8);
const CHUNK_INDICES = (() => {
  const idx = new Uint16Array(CHUNK_QUADS * 6);
  for (let q = 0; q < CHUNK_QUADS; q++) {
    const v = q * 4, o = q * 6;
    idx[o] = v; idx[o + 1] = v + 1; idx[o + 2] = v + 2;
    idx[o + 3] = v; idx[o + 4] = v + 2; idx[o + 5] = v + 3;
  }
  return idx;
})();
// Draw passes, back to front.
const PASS_BG = 0, PASS_SHADOW = 1, PASS_OUTLINE = 2, PASS_FILL = 3, PASS_DECO = 4, PASS_COUNT = 5;

// Engine, font manager and atlas for one host (a runtime, or the editor).
// adapter: { createEngine() -> Promise<engine> or null for JS layout,
//   findFile(stems), loadFile(name), parseFont(buffer), onChange() }
export function createShared(adapter) {
  const s = { engine: null, fonts: null, atlas: new GlyphAtlas(), ready: null };
  const enginePromise = adapter.createEngine ? adapter.createEngine() : null;
  s.fonts = new FontManager({ ...adapter, getEngine: () => enginePromise });
  s.ready = enginePromise
    ? enginePromise.then(
        (engine) => {
          s.engine = engine;
          adapter.onChange();
        },
        (e) => console.error("[Text Glyph] engine failed to start", e)
      )
    : Promise.resolve();
  s.simple = !enginePromise;
  return s;
}

class QuadBatch {
  constructor() {
    this.count = 0;
    this.pos = new Float32Array(12 * 256);
    this.uv = new Float32Array(8 * 256);
    this.col = new Float32Array(16 * 256);
  }

  push(x0, y0, x1, y1, x2, y2, x3, y3, z, u0, v0, u1, v1, r, g, b, a) {
    if ((this.count + 1) * 12 > this.pos.length) {
      const n = this.count * 2;
      const pos = new Float32Array(12 * n); pos.set(this.pos); this.pos = pos;
      const uv = new Float32Array(8 * n); uv.set(this.uv); this.uv = uv;
      const col = new Float32Array(16 * n); col.set(this.col); this.col = col;
    }
    const p = this.pos, t = this.uv, c = this.col;
    let o = this.count * 12;
    p[o] = x0; p[o + 1] = y0; p[o + 2] = z;
    p[o + 3] = x1; p[o + 4] = y1; p[o + 5] = z;
    p[o + 6] = x2; p[o + 7] = y2; p[o + 8] = z;
    p[o + 9] = x3; p[o + 10] = y3; p[o + 11] = z;
    o = this.count * 8;
    t[o] = u0; t[o + 1] = v0; t[o + 2] = u1; t[o + 3] = v0;
    t[o + 4] = u1; t[o + 5] = v1; t[o + 6] = u0; t[o + 7] = v1;
    o = this.count * 16;
    const pr = r * a, pg = g * a, pb = b * a;
    for (let k = 0; k < 4; k++) {
      c[o] = pr; c[o + 1] = pg; c[o + 2] = pb; c[o + 3] = a;
      o += 4;
    }
    this.count++;
  }

  draw(gfx) {
    for (let start = 0; start < this.count; start += CHUNK_QUADS) {
      const n = Math.min(CHUNK_QUADS, this.count - start);
      gfx.drawMesh(
        this.pos.subarray(start * 12, (start + n) * 12),
        this.uv.subarray(start * 8, (start + n) * 8),
        CHUNK_INDICES.subarray(0, n * 6),
        this.col.subarray(start * 16, (start + n) * 16)
      );
    }
  }
}

// Style spans may not split a grapheme cluster. Move offending boundaries back
// to the previous cluster boundary and drop spans that become empty.
function snapSpansToClusters(plain, spans) {
  const boundaries = new Set(graphemeEnds(plain));
  boundaries.add(0);
  const ends = Array.from(boundaries).sort((a, b) => a - b);
  const snap = (offset) => {
    let lo = 0, hi = ends.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (ends[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    return ends[lo];
  };
  for (let i = 0; i < spans.length; i++) {
    if (!boundaries.has(spans[i].start)) {
      const b = snap(spans[i].start);
      spans[i].start = b;
      if (i > 0 && spans[i - 1].end > b) spans[i - 1].end = b;
    }
    if (!boundaries.has(spans[i].end)) spans[i].end = snap(spans[i].end);
  }
  for (let i = spans.length - 1; i >= 0; i--) {
    if (spans[i].start >= spans[i].end) spans.splice(i, 1);
  }
}

function fragIndexFor(spans, offset) {
  let lo = 0, hi = spans.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (spans[mid].start <= offset) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// The first strong character of each paragraph decides its direction, the
// same rule the engine applies for "auto" (Unicode bidi P2 and P3).
const FIRST_STRONG = /[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}]|\p{L}/u;
const RTL_CHAR = /[\p{Script=Hebrew}\p{Script=Arabic}\p{Script=Syriac}\p{Script=Thaana}\p{Script=Nko}]/u;
export function isRtlText(plain) {
  const m = FIRST_STRONG.exec(plain);
  return !!m && RTL_CHAR.test(m[0]);
}

// Paragraph start offsets and whether each is right to left.
export function paragraphDirections(plain, direction) {
  const starts = [0], rtl = [];
  for (let i = 0; i < plain.length; i++) if (plain.charCodeAt(i) === 10) starts.push(i + 1);
  for (let k = 0; k < starts.length; k++) {
    const end = k + 1 < starts.length ? starts[k + 1] - 1 : plain.length;
    rtl.push(direction === 1 || (direction === 2 && isRtlText(plain.substring(starts[k], end))));
  }
  return { starts, rtl };
}

function paragraphIndexAt(paras, offset) {
  let lo = 0, hi = paras.starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (paras.starts[mid] <= offset) lo = mid; else hi = mid - 1;
  }
  return lo;
}

function spaceAdvance(face, sizePx) {
  if (face.spaceUnits === undefined) {
    const g = face.otf.charToGlyph(" ");
    face.spaceUnits = g ? g.advanceWidth || 0 : 0;
  }
  return (face.spaceUnits * sizePx) / face.otf.unitsPerEm;
}

function offsetPx(o, size) {
  return o.percent ? (o.value / 100) * size : o.value;
}

// Per-frame draw context shared by the emit helpers, so the glyph loop does
// not allocate closures.
function batchFor(fc, pass, page) {
  let b = fc.passes[pass].get(page);
  if (!b) {
    b = new QuadBatch();
    fc.passes[pass].set(page, b);
  }
  return b;
}

function emitRect(fc, pass, lx, ty, rw, rh, r, g, b, a) {
  const rx = lx + rw, by = ty + rh, w = fc.white;
  batchFor(fc, pass, w.page).push(
    fc.ox + lx * fc.ex + ty * fc.fx, fc.oy + lx * fc.ey + ty * fc.fy,
    fc.ox + rx * fc.ex + ty * fc.fx, fc.oy + rx * fc.ey + ty * fc.fy,
    fc.ox + rx * fc.ex + by * fc.fx, fc.oy + rx * fc.ey + by * fc.fy,
    fc.ox + lx * fc.ex + by * fc.fx, fc.oy + lx * fc.ey + by * fc.fy,
    fc.z, w.u0, w.v0, w.u1, w.v1, r, g, b, a
  );
}

function emitTextured(fc, pass, holder, lx, ty, rw, rh, u0, v0, u1, v1, r, g, b, a) {
  const rx = lx + rw, by = ty + rh;
  batchFor(fc, pass, holder).push(
    fc.ox + lx * fc.ex + ty * fc.fx, fc.oy + lx * fc.ey + ty * fc.fy,
    fc.ox + rx * fc.ex + ty * fc.fx, fc.oy + rx * fc.ey + ty * fc.fy,
    fc.ox + rx * fc.ex + by * fc.fx, fc.oy + rx * fc.ey + by * fc.fy,
    fc.ox + lx * fc.ex + by * fc.fx, fc.oy + lx * fc.ey + by * fc.fy,
    fc.z, u0, v0, u1, v1, r, g, b, a
  );
}

// A decoration line from x to x + w, centered on y. Patterns use the
// absolute x so they continue across glyph boundaries.
function emitDecoration(fc, x, y, w, th, style, r, g, b, a) {
  if (w <= 0) return;
  switch (style) {
    case 1: // double
      emitRect(fc, PASS_DECO, x, y - th * 1.25, w, th, r, g, b, a);
      emitRect(fc, PASS_DECO, x, y + th * 0.25, w, th, r, g, b, a);
      return;
    case 2: // dotted
    case 3: { // dashed
      const dash = style === 2 ? th : th * 3, period = style === 2 ? th * 2 : th * 5;
      let sx = Math.floor(x / period) * period;
      for (; sx < x + w; sx += period) {
        const a0 = Math.max(x, sx), a1 = Math.min(x + w, sx + dash);
        if (a1 > a0) emitRect(fc, PASS_DECO, a0, y - th / 2, a1 - a0, th, r, g, b, a);
      }
      return;
    }
    case 4: { // wavy
      const amp = th, step = Math.max(0.5, th / 2), period = th * 6;
      let sx = Math.floor(x / step) * step;
      for (; sx < x + w; sx += step) {
        const a0 = Math.max(x, sx), a1 = Math.min(x + w, sx + step);
        if (a1 <= a0) continue;
        const yy = y + amp * Math.sin(((a0 + step / 2) / period) * Math.PI * 2);
        emitRect(fc, PASS_DECO, a0, yy - th / 2, a1 - a0, th, r, g, b, a);
      }
      return;
    }
    default:
      emitRect(fc, PASS_DECO, x, y - th / 2, w, th, r, g, b, a);
  }
}

// Uses the current glyph's transform fields on fc (gx, gy, rs, cx, cy, cs, sn, sx, sy, shear, rotate).
function emitGlyph(fc, entry, pass, cr, cg, cb, ca, dx, dy) {
  const lx = fc.gx + entry.ox / fc.rs + dx, ty = fc.gy + entry.oy / fc.rs + dy;
  const rx = lx + entry.w / fc.rs, by = ty + entry.h / fc.rs;
  const out = SCRATCH_OUT, pts = SCRATCH_PTS;
  pts[0] = lx; pts[1] = ty; pts[2] = rx; pts[3] = ty;
  pts[4] = rx; pts[5] = by; pts[6] = lx; pts[7] = by;
  for (let k = 0; k < 4; k++) {
    let px = pts[k * 2], py = pts[k * 2 + 1];
    px += fc.shear * (fc.gy - py);
    if (fc.rotate) {
      const vx = (px - fc.cx) * fc.sx, vy = (py - fc.cy) * fc.sy;
      px = fc.cx + vx * fc.cs - vy * fc.sn;
      py = fc.cy + vx * fc.sn + vy * fc.cs;
    }
    out[k * 2] = fc.ox + px * fc.ex + py * fc.fx;
    out[k * 2 + 1] = fc.oy + px * fc.ey + py * fc.fy;
  }
  batchFor(fc, pass, entry.page).push(
    out[0], out[1], out[2], out[3], out[4], out[5], out[6], out[7],
    fc.z, entry.u0, entry.v0, entry.u1, entry.v1, cr, cg, cb, ca
  );
}

export class TextCore {
  constructor(shared) {
    this.shared = shared;
    this.text = "Text";
    this.bbcode = true;
    this.family = "Arial";
    this.ptSize = 12;
    this.lineHeightOffset = 0;
    this.bold = false;
    this.italic = false;
    this.color = [0, 0, 0];
    this.alignX = 0;
    this.alignY = 0;
    this.justify = 0; // 0 off, 1 all but the last line, 2 every line
    this.wrap = 0;
    this.overflow = true; // draw lines past the bottom of the box
    this.ellipsis = false; // cut the text to the box and end it with an ellipsis
    this.maxLines = 0; // 0 is unlimited
    this.direction = 2;
    this.letterSpacing = 0;
    this.wordSpacing = 0;
    this.paragraphSpacing = 0;
    this.columns = 1;
    this.columnGap = 0;
    this.justifyMin = 1; // word space may shrink to this multiple
    this.justifyMax = 0; // and grow to this multiple before letters spread, 0 is unlimited
    this.justifyLetter = 0; // max extra px between letters when justifying
    // (name, frame) -> { width, height, texture(gfx), uv: [u0, v0, u1, v1] } or null
    this.iconResolver = null;
    // [{ key, vertices: [[x, y], ...] in local units, side, margin }]
    this.exclusions = [];

    this._tf = {};
    this._controller = null;
    this._insp = null;
    this._metas = null;
    this._glyphFrag = null;
    this._glyphLine = null;
    this._lineShift = null;
    this._lineYShift = null;
    this._lineLimit = 0; // lines from the top that are drawn
    this._glyphFragDirty = false;
    this._fragsSeen = null;
    this._layoutKey = "";
    this._parsed = null;
    this._parseDirty = true;
    this._layoutDirty = true;
    this._fontVersionSeen = -1;
    this._layoutW = -1;
    this._layoutH = -1;
    this._offsetY = 0;
    this._contentHeight = 0;
    this._fc = null;
    this._paras = null;
    this._parasFor = null;
    this._parasDir = -1;
    this._exclusionKey = "";
    this._iconHolders = new Map();
  }

  dispose() {
    if (this._controller) {
      this._controller.dispose();
      this._controller = null;
    }
    this._insp = null;
  }

  // ---- state. Each setter returns whether anything changed. ----

  _dirty(reparse) {
    this._layoutDirty = true;
    if (reparse) this._parseDirty = true;
    return true;
  }

  _setNumber(field, v, min, max) {
    v = Number(v) || 0;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    if (this[field] === v) return false;
    this[field] = v;
    return this._dirty(false);
  }

  setText(text) {
    text = String(text);
    if (this.text === text) return false;
    this.text = text;
    return this._dirty(true);
  }

  setBBCode(enabled) {
    enabled = !!enabled;
    if (this.bbcode === enabled) return false;
    this.bbcode = enabled;
    return this._dirty(true);
  }

  setFont(family, bold, italic) {
    family = String(family || this.family);
    bold = !!bold;
    italic = !!italic;
    if (this.family === family && this.bold === bold && this.italic === italic) return false;
    this.family = family;
    this.bold = bold;
    this.italic = italic;
    this.shared.fonts.getFace(family, bold, italic);
    return this._dirty(false);
  }

  setSize(pt) {
    return this._setNumber("ptSize", Number(pt) || 0.1, 0.1);
  }

  setColor(rgb) {
    this.color = [rgb[0], rgb[1], rgb[2]];
    return true;
  }

  setLineHeight(v) {
    return this._setNumber("lineHeightOffset", v);
  }

  setAlignment(x, y) {
    x = Number(x) || 0;
    y = Number(y) || 0;
    if (this.alignX === x && this.alignY === y) return false;
    this.alignX = x;
    this.alignY = y;
    return this._dirty(false);
  }

  setJustify(i) {
    return this._setNumber("justify", i | 0, 0, 2);
  }

  setWrap(i) {
    return this._setNumber("wrap", i | 0, 0, 2);
  }

  setOverflow(v) {
    v = !!v;
    if (this.overflow === v) return false;
    this.overflow = v;
    return this._dirty(false);
  }

  setEllipsis(v) {
    v = !!v;
    if (this.ellipsis === v) return false;
    this.ellipsis = v;
    return this._dirty(false);
  }

  setMaxLines(n) {
    return this._setNumber("maxLines", n | 0, 0);
  }

  setDirection(i) {
    return this._setNumber("direction", i | 0, 0, 2);
  }

  setLetterSpacing(v) {
    return this._setNumber("letterSpacing", v);
  }

  setWordSpacing(v) {
    return this._setNumber("wordSpacing", v);
  }

  setParagraphSpacing(v) {
    return this._setNumber("paragraphSpacing", v);
  }

  setColumns(count, gap) {
    const a = this._setNumber("columns", count | 0, 1);
    const b = this._setNumber("columnGap", gap, 0);
    return a || b;
  }

  setJustifyTuning(min, max, letter) {
    const a = this._setNumber("justifyMin", min, 0.01, 1);
    const b = this._setNumber("justifyMax", max, 0);
    const c = this._setNumber("justifyLetter", letter, 0);
    return a || b || c;
  }

  // Exclusions are rebuilt by the host whenever it draws. Only a change in
  // their shapes marks the layout dirty.
  setExclusions(list) {
    let key = "";
    for (const e of list) {
      key += e.key + ":" + e.side + ":" + e.margin + ":";
      for (const v of e.vertices) key += (Math.round(v[0] * 2) / 2) + "," + (Math.round(v[1] * 2) / 2) + ";";
      key += "|";
    }
    this.exclusions = list;
    if (key === this._exclusionKey) return false;
    this._exclusionKey = key;
    return this._dirty(false);
  }

  plainText() {
    return this.bbcode ? stripTags(this.text) : this.text;
  }

  fontStatus() {
    return this.shared.fonts.status(this.family, this.bold, this.italic);
  }

  get insp() {
    return this._insp;
  }

  // ---- layout ----

  // Returns true when there is a layout to draw for a w by h box.
  ensureLayout(w, h) {
    const s = this.shared;
    if (!s.engine && !s.simple) return false;
    const fonts = s.fonts;
    if (this._fontVersionSeen !== fonts.version) {
      this._fontVersionSeen = fonts.version;
      this._layoutDirty = true;
    }
    w = Math.max(1, Math.abs(w));
    h = Math.max(1, Math.abs(h));
    if (w !== this._layoutW || h !== this._layoutH) {
      this._layoutW = w;
      this._layoutH = h;
      this._layoutDirty = true;
    }
    if (!this._layoutDirty) return !!this._insp;

    if (this._parseDirty) {
      this._parsed = parseBBCode(this.text, this.bbcode);
      this._parseDirty = false;
    }
    const base = fonts.getFace(this.family, this.bold, this.italic);
    if (!base) return false;
    const parsed = this._parsed;
    if (!parsed.plain.length) {
      this._insp = null;
      this._layoutKey = "";
      this._layoutDirty = false;
      return false;
    }

    // Per-fragment metadata is ours. Glyph only needs the spans that change
    // shaping: face, font size, spacing and inline placeholders. Adjacent
    // equal spans merge.
    const basePx = this.ptSize * PT_TO_PX;
    const frags = parsed.frags;
    const spans = [];
    let key = "";
    for (let k = 0; k < frags.length; k++) {
      const f = frags[k];
      const st = f.style;
      const bold = this.bold || st.bold;
      const italic = this.italic || st.italic;
      let face = base;
      if (st.font || bold !== this.bold || italic !== this.italic)
        face = fonts.getFace(st.font || this.family, bold, italic) || base;
      const sizePx = st.sizePt > 0 ? st.sizePt * PT_TO_PX : basePx;
      f.face = face;
      f.sizePx = sizePx;
      const ls = this.letterSpacing + st.letterSpacing;
      let ws = this.wordSpacing + st.wordSpacing;
      let inlineWidth = -1;
      f.icon = null;
      if (st.inline) {
        if (st.inline.kind === "space") inlineWidth = Math.max(0, offsetPx(st.inline.width, sizePx));
        else {
          // Like the built-in Text: the icon is as tall as the font's line
          // box (ascender to descender) and keeps its aspect ratio.
          const icon = this.iconResolver ? this.iconResolver(st.inline.name, st.inline.frame) : null;
          f.icon = icon;
          const m = face.metrics;
          const k = (sizePx * st.inline.scale) / m.unitsPerEm;
          const ih = (m.ascender - m.descender) * k;
          inlineWidth = icon && icon.height > 0 ? (ih * icon.width) / icon.height : ih;
          f.iconH = ih;
          f.iconTop = m.ascender * k;
        }
        f.inlineW = inlineWidth;
        ws = inlineWidth - spaceAdvance(face, sizePx);
      }
      if (face === base && sizePx === basePx && ls === this.letterSpacing && ws === this.wordSpacing && inlineWidth < 0) continue;
      const last = spans[spans.length - 1];
      if (last && last.end === f.start && last.face === face && last.sizePx === sizePx && last.ls === ls && last.ws === ws && last.inlineWidth < 0 && inlineWidth < 0) {
        last.end = f.end;
        continue;
      }
      spans.push({ start: f.start, end: f.end, face, sizePx, ls, ws, inlineWidth });
    }
    for (const sp of spans) key += sp.start + ":" + sp.end + ":" + sp.face.key + ":" + sp.sizePx + ":" + sp.ls + ":" + sp.ws + ":" + sp.inlineWidth + ",";
    const fm = base.metrics;
    const natural = (fm.ascender - fm.descender + fm.lineGap) / fm.unitsPerEm;
    const lineHeight = Math.max(0.1, natural + this.lineHeightOffset / basePx);
    const direction = DIRECTION[this.direction];
    // Lines are laid out from the start edge and shifted per line below, so
    // any 0..1 alignment works and justified paragraphs keep their last line.
    // When the engine places lines itself (columns, exclusions) it also aligns
    // them, to the nearest of start, center and end.
    const engineAligns = !s.simple && (this.columns > 1 || this.exclusions.length > 0);
    let align = this.justify ? "justify" : "start";
    if (engineAligns && !this.justify) align = this.alignX < 0.25 ? "start" : this.alignX > 0.75 ? "end" : "center";
    const lastLine = this.justify === 2 ? "justify" : "auto";
    const overflow = this.ellipsis ? "ellipsis" : "visible";
    const bounded = this.ellipsis || this.columns > 1 || this.exclusions.length > 0;
    key = [
      parsed.plain, w, bounded ? h : 0, basePx, lineHeight, direction, align, lastLine, this.wrap, overflow,
      this.maxLines, this.letterSpacing, this.wordSpacing, this.columns, this.columnGap,
      this.justifyMin, this.justifyMax, this.justifyLetter, this._exclusionKey, base.key, key,
    ].join("\u0001");
    this._metas = frags;
    if (this._parasFor !== parsed || this._parasDir !== this.direction) {
      this._paras = paragraphDirections(parsed.plain, this.direction);
      this._parasFor = parsed;
      this._parasDir = this.direction;
    }
    const paras = this._paras;

    if (key !== this._layoutKey || !this._insp) {
      try {
        if (s.simple) {
          const sfrags = frags.map((f) => ({
            start: f.start, end: f.end, face: f.face, sizePx: f.sizePx,
            letterSpacing: this.letterSpacing + f.style.letterSpacing,
            wordSpacing: this.wordSpacing + f.style.wordSpacing,
            inlineWidth: f.style.inline ? f.inlineW : -1,
          }));
          this._insp = simpleLayout(parsed.plain, sfrags, {
            width: w,
            height: h,
            wrap: this.wrap,
            overflow,
            lineHeight,
            justify: this.justify,
            justifyMin: this.justifyMin,
            justifyMax: this.justifyMax,
            justifyLetter: this.justifyLetter,
            maxLines: this.maxLines,
            columns: this.columns,
            columnGap: this.columnGap,
            paragraphRtl: (off) => paras.rtl[paragraphIndexAt(paras, off)],
          });
        } else {
          const glyphSpans = spans.map((sp) => {
            const span = { start: sp.start, end: sp.end };
            if (sp.face !== base) span.font = sp.face.font;
            const style = {};
            if (sp.sizePx !== basePx) style.fontSize = sp.sizePx;
            if (sp.ls !== this.letterSpacing) style.letterSpacing = sp.ls;
            if (sp.ws !== this.wordSpacing) style.wordSpacing = sp.ws;
            if (Object.keys(style).length) span.style = style;
            return span;
          });
          snapSpansToClusters(parsed.plain, glyphSpans);
          const layout = { wrap: WRAP[this.wrap], align, lastLine, overflow };
          if (this.maxLines > 0) layout.maxLines = this.maxLines;
          if (this.columns > 1) layout.columns = { count: this.columns, gap: this.columnGap };
          if (this.justify && (this.justifyMin < 1 || this.justifyMax > 0 || this.justifyLetter > 0))
            layout.justify = {
              minWordSpaceRatio: this.justifyMin,
              maxWordSpaceRatio: this.justifyMax > 0 ? Math.max(1, this.justifyMax) : 1000,
              letterSpaceExpansion: this.justifyLetter,
            };
          const style = { fontSize: basePx, lineHeight, direction };
          if (this.letterSpacing) style.letterSpacing = this.letterSpacing;
          if (this.wordSpacing) style.wordSpacing = this.wordSpacing;
          const state = {
            font: base.font,
            text: { text: parsed.plain, spans: glyphSpans },
            transform: this._tf,
            style,
            layout,
            constraints: bounded
              ? { width: { mode: "exact", size: w }, height: { mode: "exact", size: h } }
              : { width: { mode: "exact", size: w } },
          };
          if (this.exclusions.length) {
            const H = this.overflow && !this.ellipsis ? UNBOUNDED : h;
            state.flow = {
              regions: [{
                key: "box",
                shape: { kind: "rectangle", bounds: [0, 0, w, H] },
                exclusions: this.exclusions.map((e) => ({
                  key: e.key,
                  shape: { kind: "polygon", vertices: e.vertices },
                  wrapSide: WRAP_SIDES[e.side] || "both",
                  marginInline: e.margin,
                  marginBlock: e.margin,
                })),
              }],
            };
          }
          if (this._controller) this._controller.update(state);
          else this._controller = s.engine.createText(state);
          this._insp = this._controller.inspect();
        }
      } catch (e) {
        console.error("[Text Glyph] layout failed", e);
        this._insp = null;
        this._layoutKey = "";
        this._layoutDirty = false;
        return false;
      }
      this._layoutKey = key;
      const insp = this._insp;
      const n = insp.glyphCount;
      if (!this._glyphLine || this._glyphLine.length !== n) {
        this._glyphLine = new Int32Array(n);
        this._glyphFrag = new Int32Array(n);
      }
      const gl = this._glyphLine;
      for (let l = 0; l < insp.lineCount; l++) {
        const start = insp.lineGlyphStarts[l], count = insp.lineGlyphCounts[l];
        for (let k = start; k < start + count; k++) gl[k] = l;
      }
      this._glyphFragDirty = true;
    }

    // Fragment boundaries can move without the layout changing (tags only),
    // so the glyph to fragment map is refreshed on every reparse.
    if (this._glyphFragDirty || this._fragsSeen !== parsed) {
      const insp = this._insp, gf = this._glyphFrag;
      for (let i = 0; i < insp.glyphCount; i++) gf[i] = fragIndexFor(frags, insp.clusters[i]);
      this._glyphFragDirty = false;
      this._fragsSeen = parsed;
    }

    // Each line sits at its paragraph's start edge: x = 0 for LTR, the right
    // edge for RTL. Trailing whitespace is not part of a line's advance.
    // Paragraph spacing pushes every paragraph after the first down.
    const insp = this._insp;
    if (!this._lineShift || this._lineShift.length !== insp.lineCount) {
      this._lineShift = new Float32Array(insp.lineCount);
      this._lineYShift = new Float32Array(insp.lineCount);
    }
    const ls = this._lineShift, ys = this._lineYShift;
    const avail = insp.lineAvail;
    const spacing = this.columns > 1 ? 0 : this.paragraphSpacing;
    let maxY = 0;
    for (let l = 0; l < insp.lineCount; l++) {
      const textStart = insp.lineTextStarts[l];
      const pi = paragraphIndexAt(paras, textStart);
      const from = paras.rtl[pi] ? 1 : 0;
      ls[l] = engineAligns ? 0 : ((avail ? avail[l] : w) - insp.lineAdvances[l]) * (this.alignX - from);
      ys[l] = pi * spacing;
      const line = insp.lines[l];
      maxY = Math.max(maxY, line.baseline - line.ascent + line.lineHeight + ys[l]);
    }
    this._contentHeight = insp.lineCount ? maxY : insp.contentHeight;
    this._offsetY = (h - this._contentHeight) * this.alignY;
    // With overflow off, whole lines that end below the box are not drawn.
    let limit = insp.lineCount;
    if (!this.overflow) {
      limit = 0;
      while (limit < insp.lineCount) {
        const line = insp.lines[limit];
        if (line.baseline - line.ascent + line.lineHeight + ys[limit] + this._offsetY > h + 0.01) break;
        limit++;
      }
    }
    this._lineLimit = limit;
    this._layoutDirty = false;
    return true;
  }

  textWidth() {
    return this._insp ? this._insp.contentWidth : 0;
  }

  textHeight() {
    return this._insp ? this._contentHeight : 0;
  }

  lineCount() {
    return this._insp ? this._insp.lineCount : 0;
  }

  // ---- drawing ----

  // gfx: drawMesh, setTexture, setTextureFillMode, createDynamicTexture,
  //   updateTexture, deleteTexture (runtime IRenderer names).
  // frame: ox, oy (top left corner), ex, ey (unit x axis), fx, fy (unit y
  //   axis), z, ppu (device pixels per unit), tint [r,g,b], opacity,
  //   twReveal (plain text offset up to which glyphs show), pixelRounding.
  draw(gfx, frame) {
    if (!this._insp) return;
    const atlas = this.shared.atlas;
    atlas.beginFrame(gfx);
    const insp = this._insp, metas = this._metas, gf = this._glyphFrag, gl = this._glyphLine, ls = this._lineShift, ys = this._lineYShift;
    const lines = insp.lines, lineLimit = this._lineLimit;
    const w = this._layoutW;
    const fc = this._fc || (this._fc = { passes: Array.from({ length: PASS_COUNT }, () => new Map()) });
    fc.ox = frame.pixelRounding ? Math.round(frame.ox) : frame.ox;
    fc.oy = frame.pixelRounding ? Math.round(frame.oy) : frame.oy;
    fc.ex = frame.ex;
    fc.ey = frame.ey;
    fc.fx = frame.fx;
    fc.fy = frame.fy;
    fc.z = frame.z;
    fc.white = atlas.white;
    for (const m of fc.passes) for (const b of m.values()) b.count = 0;
    const ppu = frame.ppu;
    const ic = frame.tint, io = frame.opacity;
    const baseColor = this.color;
    const offY = this._offsetY;
    const twReveal = frame.twReveal;
    const clipX = !this.overflow;

    for (let i = 0; i < insp.glyphCount; i++) {
      const meta = metas[gf[i]];
      const st = meta.style;
      if (st.hide) continue;
      if (gl[i] >= lineLimit) break;
      if (insp.clusters[i] >= twReveal) continue;
      const size = insp.glyphFontSizes[i];
      const adv = st.inline ? meta.inlineW : insp.glyphAdvances[i];
      const gx = insp.x[i] + ls[gl[i]] + offsetPx(st.offsetX, size);
      const gy = insp.y[i] + offY + ys[gl[i]] + offsetPx(st.offsetY, size);
      if (clipX && (gx + adv > w + 0.01 || gx < -0.01)) continue;
      const alpha = st.opacity * io;
      if (alpha <= 0) continue;
      const c = st.color;
      const r = (c ? c[0] : baseColor[0]) * ic[0];
      const g = (c ? c[1] : baseColor[1]) * ic[1];
      const b = (c ? c[2] : baseColor[2]) * ic[2];
      const a = alpha * (c ? c[3] : 1);
      const line = lines[gl[i]];

      if (st.background) {
        const bg = st.background;
        emitRect(fc, PASS_BG, gx, gy - line.ascent, adv, line.lineHeight, bg[0] * ic[0], bg[1] * ic[1], bg[2] * ic[2], alpha * bg[3]);
      }

      const face = meta.face;
      if (st.inline) {
        const icon = meta.icon;
        if (icon) {
          const tex = icon.texture(gfx);
          if (tex) {
            let holder = this._iconHolders.get(tex);
            if (!holder) {
              holder = { texture: tex };
              this._iconHolders.set(tex, holder);
            }
            emitTextured(fc, PASS_FILL, holder, gx, gy - meta.iconTop, adv, meta.iconH, icon.uv[0], icon.uv[1], icon.uv[2], icon.uv[3], ic[0], ic[1], ic[2], alpha);
          }
        }
        continue;
      }

      const gid = insp.glyphIds[i];
      const ppem = bucketPpem(size * ppu);
      const rs = ppem / size;
      fc.gx = gx;
      fc.gy = gy;
      fc.rs = rs;
      fc.cx = gx + adv / 2;
      fc.cy = gy - size * 0.35;
      fc.sx = st.scaleX;
      fc.sy = st.scaleY;
      fc.rotate = st.angle !== 0 || st.scaleX !== 1 || st.scaleY !== 1;
      if (fc.rotate) {
        const ang = (st.angle * Math.PI) / 180;
        fc.cs = Math.cos(ang);
        fc.sn = Math.sin(ang);
      }
      fc.shear = face.fakeItalic ? FAKE_ITALIC_SHEAR : 0;

      // Outline width follows the built-in Text object: size/64 per unit of thickness.
      const strokePx = Math.max(0.5, Math.round(((size * st.lineThickness) / 64) * rs * 2) / 2);
      const fill = atlas.get(face, gid, ppem, face.fakeBold, st.stroke ? strokePx : 0);
      if (st.shadow && fill) {
        const sc = st.shadow.color;
        emitGlyph(fc, fill, PASS_SHADOW, sc[0] * ic[0], sc[1] * ic[1], sc[2] * ic[2], alpha * sc[3], offsetPx(st.shadow.dx, size), offsetPx(st.shadow.dy, size));
      }
      if (st.outline && !st.stroke) {
        const e = atlas.get(face, gid, ppem, face.fakeBold, strokePx);
        if (e) {
          const oc = st.outline;
          emitGlyph(fc, e, PASS_OUTLINE, oc[0] * ic[0], oc[1] * ic[1], oc[2] * ic[2], alpha * oc[3], 0, 0);
        }
      }
      if (fill) emitGlyph(fc, fill, PASS_FILL, r, g, b, a, 0, 0);

      if (st.underline || st.strike || st.overline) {
        const fm = face.metrics;
        const k = size / fm.unitsPerEm;
        const dc = st.decorationColor;
        const dr = dc ? dc[0] * ic[0] : r, dg = dc ? dc[1] * ic[1] : g, db = dc ? dc[2] * ic[2] : b;
        const da = dc ? alpha * dc[3] : a;
        const thick = st.decorationThickness > 0 ? st.decorationThickness : st.lineThickness;
        const shift = offsetPx(st.decorationOffset, size);
        const style = st.decorationStyle;
        if (st.underline) {
          const th = Math.max(0.5, fm.underlineThickness * k * thick);
          emitDecoration(fc, gx, gy - fm.underlinePosition * k + shift, adv, th, style, dr, dg, db, da);
        }
        if (st.strike) {
          const th = Math.max(0.5, fm.strikeoutSize * k * thick);
          emitDecoration(fc, gx, gy - fm.strikeoutPosition * k + shift, adv, th, style, dr, dg, db, da);
        }
        if (st.overline) {
          const th = Math.max(0.5, fm.underlineThickness * k * thick);
          emitDecoration(fc, gx, gy - (fm.ascender * k) + shift, adv, th, style, dr, dg, db, da);
        }
      }
    }

    atlas.flush(gfx);
    gfx.setTextureFillMode();
    for (const pass of fc.passes) {
      for (const [page, b] of pass) {
        if (!b.count) continue;
        gfx.setTexture(page.texture);
        b.draw(gfx);
      }
    }
  }

  // ---- tags, in local layout coordinates ----

  glyphBox(i) {
    const insp = this._insp;
    const l = this._glyphLine[i];
    const line = insp.lines[l];
    const meta = this._metas[this._glyphFrag[i]];
    const adv = meta.style.inline ? meta.inlineW : insp.glyphAdvances[i];
    return [insp.x[i] + this._lineShift[l], insp.y[i] + this._offsetY + this._lineYShift[l] - line.ascent, adv, line.lineHeight];
  }

  tagAt(lx, ly) {
    if (!this._insp) return "";
    const insp = this._insp;
    for (let i = 0; i < insp.glyphCount; i++) {
      if (this._glyphLine[i] >= this._lineLimit) break;
      const [gx, top, adv, lh] = this.glyphBox(i);
      if (lx >= gx && lx < gx + adv && ly >= top && ly < top + lh)
        return this._metas[this._glyphFrag[i]].style.tag;
    }
    return "";
  }

  tagFrags(tag) {
    if (!this._insp) return [];
    tag = String(tag).toLowerCase();
    const out = [];
    this._metas.forEach((m, i) => {
      if (m.style.tag && m.style.tag.toLowerCase() === tag) out.push(i);
    });
    return out;
  }

  // Bounds of the nth span with that tag: [x0, y0, x1, y1] or null.
  tagBounds(tag, index) {
    const frags = this.tagFrags(tag);
    index = Math.floor(index);
    if (index < 0 || index >= frags.length) return null;
    const frag = frags[index];
    const insp = this._insp;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < insp.glyphCount; i++) {
      if (this._glyphLine[i] >= this._lineLimit) break;
      if (this._glyphFrag[i] !== frag) continue;
      const [gx, top, adv, lh] = this.glyphBox(i);
      x0 = Math.min(x0, gx); y0 = Math.min(y0, top);
      x1 = Math.max(x1, gx + adv); y1 = Math.max(y1, top + lh);
    }
    return x0 === Infinity ? null : [x0, y0, x1, y1];
  }
}
