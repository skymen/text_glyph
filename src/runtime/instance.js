import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";
import { getGlyphEngine } from "./glyphEngine.js";
import { FontManager } from "./fontManager.js";
import { GlyphAtlas, bucketPpem } from "./atlas.js";
import { parseBBCode, graphemeEnds, stripTags } from "./bbcode.js";

const PT_TO_PX = 4 / 3;
const WRAP = ["word", "character"];
const DIRECTION = ["ltr", "rtl", "auto"];
const FAKE_ITALIC_SHEAR = 0.2;
const CHUNK_QUADS = 2048;
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

// Engine, font manager and atlas are shared by every instance of one runtime.
const sharedByRuntime = new WeakMap();
function getShared(runtime) {
  let s = sharedByRuntime.get(runtime);
  if (s) return s;
  s = { engine: null, fonts: new FontManager(runtime), atlas: new GlyphAtlas() };
  sharedByRuntime.set(runtime, s);
  const ready = getGlyphEngine(runtime).then(
    (engine) => {
      s.engine = engine;
      runtime.sdk.updateRender();
    },
    (e) => console.error("[Text Glyph] engine failed to start", e)
  );
  runtime.sdk.addLoadPromise(ready);
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

  draw(renderer) {
    for (let start = 0; start < this.count; start += CHUNK_QUADS) {
      const n = Math.min(CHUNK_QUADS, this.count - start);
      renderer.drawMesh(
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
function snapSpansToClusters(plain, spans, metas) {
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
  for (let i = 1; i < spans.length; i++) {
    if (!boundaries.has(spans[i].start)) {
      const b = snap(spans[i].start);
      spans[i].start = b;
      spans[i - 1].end = b;
    }
  }
  for (let i = spans.length - 1; i >= 0; i--) {
    if (spans[i].start >= spans[i].end) {
      spans.splice(i, 1);
      metas.splice(i, 1);
    }
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

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      this._text = "Text";
      this._bbcode = true;
      this._family = "Arial";
      this._ptSize = 12;
      this._lineHeightOffset = 0;
      this._bold = false;
      this._italic = false;
      this._color = [0, 0, 0];
      this._hAlign = 0;
      this._vAlign = 0;
      this._wrap = 0;
      this._direction = 0;
      const p = this._getInitProperties();
      if (p) {
        this._text = String(p[0] ?? "");
        this._bbcode = !!p[1];
        this._family = String(p[2] || "Arial");
        this._ptSize = Number(p[3]) || 12;
        this._lineHeightOffset = Number(p[4]) || 0;
        this._bold = !!p[5];
        this._italic = !!p[6];
        if (Array.isArray(p[7])) this._color = [p[7][0], p[7][1], p[7][2]];
        this._hAlign = p[8] | 0;
        this._vAlign = p[9] | 0;
        this._wrap = p[10] | 0;
        this._direction = p[11] | 0;
      }
      this._shared = getShared(this.runtime);
      this._tf = {};
      this._controller = null;
      this._insp = null;
      this._metas = null;
      this._spans = null;
      this._glyphFrag = null;
      this._glyphLine = null;
      this._parsed = null;
      this._parseDirty = true;
      this._layoutDirty = true;
      this._fontVersionSeen = -1;
      this._layoutW = -1;
      this._layoutH = -1;
      this._offsetY = 0;
      this._batches = null;
      this._twStart = -1;
      this._twEnd = -1;
      this._twEnds = null;
      this._twReveal = Infinity;
      this._shared.fonts.getFace(this._family, this._bold, this._italic);
    }

    _trigger(method) {
      this.dispatch(method);
      super._trigger(self.C3[AddonTypeMap[addonType]][id].Cnds[method]);
    }

    on(tag, callback, options) {
      if (!this.events[tag]) this.events[tag] = [];
      this.events[tag].push({ callback, options });
    }

    off(tag, callback) {
      if (this.events[tag])
        this.events[tag] = this.events[tag].filter((e) => e.callback !== callback);
    }

    dispatch(tag) {
      if (!this.events[tag]) return;
      this.events[tag].forEach((event) => {
        if (event.options && event.options.params) {
          const fn = self.C3[AddonTypeMap[addonType]][id].Cnds[tag];
          if (fn && !fn.call(this, ...event.options.params)) return;
        }
        event.callback();
        if (event.options && event.options.once) this.off(tag, event.callback);
      });
    }

    _release() {
      this._tgCancelTypewriter();
      if (this._controller) {
        this._controller.dispose();
        this._controller = null;
      }
      this._insp = null;
      super._release();
    }

    // Same script surface as ITextInstance, so behaviors written for the
    // built-in Text object (Animate Text) work on this one too.
    get text() {
      return this._text;
    }

    set text(value) {
      this._tgCancelTypewriter();
      this._tgSetText(value);
    }

    get fontColor() {
      return [this._color[0], this._color[1], this._color[2]];
    }

    get sizePt() {
      return this._ptSize;
    }

    get textWidth() {
      return this._tgTextWidth();
    }

    get textHeight() {
      return this._tgTextHeight();
    }

    // ---- state setters used by ACEs ----

    _tgMarkDirty(reparse) {
      this._layoutDirty = true;
      if (reparse) this._parseDirty = true;
      this.runtime.sdk.updateRender();
    }

    _tgSetText(text) {
      text = String(text);
      if (this._text === text) return;
      this._text = text;
      this._tgMarkDirty(true);
    }

    _tgSetBBCode(enabled) {
      enabled = !!enabled;
      if (this._bbcode === enabled) return;
      this._bbcode = enabled;
      this._tgMarkDirty(true);
    }

    _tgSetFont(family, bold, italic) {
      family = String(family || this._family);
      bold = !!bold;
      italic = !!italic;
      if (this._family === family && this._bold === bold && this._italic === italic) return;
      this._family = family;
      this._bold = bold;
      this._italic = italic;
      this._shared.fonts.getFace(family, bold, italic);
      this._tgMarkDirty(false);
    }

    _tgSetSize(pt) {
      pt = Math.max(0.1, Number(pt) || 0.1);
      if (this._ptSize === pt) return;
      this._ptSize = pt;
      this._tgMarkDirty(false);
    }

    _tgSetColor(rgb) {
      this._color = [rgb[0], rgb[1], rgb[2]];
      this.runtime.sdk.updateRender();
    }

    _tgSetLineHeight(v) {
      v = Number(v) || 0;
      if (this._lineHeightOffset === v) return;
      this._lineHeightOffset = v;
      this._tgMarkDirty(false);
    }

    _tgSetHAlign(i) {
      i |= 0;
      if (this._hAlign === i) return;
      this._hAlign = i;
      this._tgMarkDirty(false);
    }

    _tgSetVAlign(i) {
      i |= 0;
      if (this._vAlign === i) return;
      this._vAlign = i;
      this._tgMarkDirty(false);
    }

    _tgSetWrap(i) {
      i |= 0;
      if (this._wrap === i) return;
      this._wrap = i;
      this._tgMarkDirty(false);
    }

    _tgSetDirection(i) {
      i |= 0;
      if (this._direction === i) return;
      this._direction = i;
      this._tgMarkDirty(false);
    }

    _tgPlainText() {
      return this._bbcode ? stripTags(this._text) : this._text;
    }

    // ---- layout ----

    _tgEnsureLayout() {
      const s = this._shared;
      if (!s.engine) return false;
      const fonts = s.fonts;
      if (this._fontVersionSeen !== fonts.version) {
        this._fontVersionSeen = fonts.version;
        this._layoutDirty = true;
      }
      const w = Math.max(1, Math.abs(this.width));
      const h = Math.max(1, Math.abs(this.height));
      if (w !== this._layoutW || h !== this._layoutH) {
        this._layoutW = w;
        this._layoutH = h;
        this._layoutDirty = true;
      }
      if (!this._layoutDirty) return !!this._insp;

      if (this._parseDirty) {
        this._parsed = parseBBCode(this._text, this._bbcode);
        this._parseDirty = false;
      }
      const base = fonts.getFace(this._family, this._bold, this._italic);
      if (!base) return false;
      const parsed = this._parsed;
      if (!parsed.plain.length) {
        this._insp = null;
        this._layoutDirty = false;
        return false;
      }

      const basePx = this._ptSize * PT_TO_PX;
      const spans = [];
      const metas = [];
      for (const f of parsed.frags) {
        const st = f.style;
        const bold = this._bold || st.bold;
        const italic = this._italic || st.italic;
        let face = base;
        if (st.font || bold !== this._bold || italic !== this._italic)
          face = fonts.getFace(st.font || this._family, bold, italic) || base;
        const sizePx = st.sizePt > 0 ? st.sizePt * PT_TO_PX : basePx;
        const span = { start: f.start, end: f.end };
        if (face !== base) span.font = face.font;
        if (sizePx !== basePx) span.style = { fontSize: sizePx };
        spans.push(span);
        metas.push({ st, face });
      }
      snapSpansToClusters(parsed.plain, spans, metas);

      const fm = base.font.metrics;
      const natural = (fm.ascender - fm.descender + fm.lineGap) / fm.unitsPerEm;
      const lineHeight = Math.max(0.1, natural + this._lineHeightOffset / basePx);
      const direction = DIRECTION[this._direction];
      let align = "center";
      if (this._hAlign !== 1)
        align = (this._hAlign === 0) === (direction !== "rtl") ? "start" : "end";
      const state = {
        font: base.font,
        text: { text: parsed.plain, spans },
        transform: this._tf,
        style: { fontSize: basePx, lineHeight, direction },
        layout: { wrap: WRAP[this._wrap], align, overflow: "visible" },
        constraints: { width: { mode: "exact", size: w } },
      };
      try {
        if (this._controller) this._controller.update(state);
        else this._controller = s.engine.createText(state);
        this._insp = this._controller.inspect();
      } catch (e) {
        console.error("[Text Glyph] layout failed", e);
        this._insp = null;
        this._layoutDirty = false;
        return false;
      }
      const insp = this._insp;
      const n = insp.glyphCount;
      const gf = new Int32Array(n);
      const gl = new Int32Array(n);
      for (let i = 0; i < n; i++) gf[i] = fragIndexFor(spans, insp.clusters[i]);
      for (let l = 0; l < insp.lineCount; l++) {
        const start = insp.lineGlyphStarts[l], count = insp.lineGlyphCounts[l];
        for (let k = start; k < start + count; k++) gl[k] = l;
      }
      this._spans = spans;
      this._metas = metas;
      this._glyphFrag = gf;
      this._glyphLine = gl;
      const ch = insp.contentHeight;
      this._offsetY = this._vAlign === 1 ? (h - ch) / 2 : this._vAlign === 2 ? h - ch : 0;
      this._layoutDirty = false;
      return true;
    }

    // Device pixels per layout unit at this instance's layer, so glyphs are
    // rasterized at the size they are displayed at.
    _tgPixelsPerUnit() {
      const layer = this.layer;
      const a = layer.layerToDrawSurface(0, 0);
      const b = layer.layerToDrawSurface(1, 0);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return d > 0 && isFinite(d) ? d : 1;
    }

    _tgTextWidth() {
      return this._tgEnsureLayout() ? this._insp.contentWidth : 0;
    }

    _tgTextHeight() {
      return this._tgEnsureLayout() ? this._insp.contentHeight : 0;
    }

    _tgLineCount() {
      return this._tgEnsureLayout() ? this._insp.lineCount : 0;
    }

    // ---- drawing ----

    _draw(renderer) {
      if (!this._tgEnsureLayout()) return;
      const atlas = this._shared.atlas;
      atlas.beginFrame(renderer);
      const insp = this._insp, metas = this._metas, gf = this._glyphFrag, gl = this._glyphLine;
      const lines = insp.lines;
      const w = this._layoutW, h = this._layoutH;
      const q = this.getBoundingQuad(true);
      let ox = q.p1.x, oy = q.p1.y;
      if (this.runtime.isPixelRoundingEnabled) {
        ox = Math.round(ox);
        oy = Math.round(oy);
      }
      const ex = (q.p2.x - q.p1.x) / w, ey = (q.p2.y - q.p1.y) / w;
      const fx = (q.p4.x - q.p1.x) / h, fy = (q.p4.y - q.p1.y) / h;
      const z = renderer.getCurrentZ();
      const ppu = this._tgPixelsPerUnit();
      const ic = this.colorRgb, io = this.opacity;
      const baseColor = this._color;
      const offY = this._offsetY;
      const twReveal = this._twReveal;
      const white = atlas.white;

      const passes = (this._batches ||= [new Map(), new Map(), new Map(), new Map()]);
      for (const m of passes) for (const b of m.values()) b.count = 0;
      const batch = (pass, page) => {
        let b = passes[pass].get(page);
        if (!b) {
          b = new QuadBatch();
          passes[pass].set(page, b);
        }
        return b;
      };
      const rect = (pass, lx, ty, rw, rh, r, g, b, a) => {
        const rx = lx + rw, by = ty + rh;
        batch(pass, white.page).push(
          ox + lx * ex + ty * fx, oy + lx * ey + ty * fy,
          ox + rx * ex + ty * fx, oy + rx * ey + ty * fy,
          ox + rx * ex + by * fx, oy + rx * ey + by * fy,
          ox + lx * ex + by * fx, oy + lx * ey + by * fy,
          z, white.u0, white.v0, white.u1, white.v1, r, g, b, a
        );
      };

      for (let i = 0; i < insp.glyphCount; i++) {
        const meta = metas[gf[i]];
        const st = meta.st;
        if (st.hide) continue;
        if (insp.clusters[i] >= twReveal) continue;
        const size = insp.glyphFontSizes[i];
        const adv = insp.glyphAdvances[i];
        const dx = st.offsetX.percent ? (st.offsetX.value / 100) * size : st.offsetX.value;
        const dy = st.offsetY.percent ? (st.offsetY.value / 100) * size : st.offsetY.value;
        const gx = insp.x[i] + dx;
        const gy = insp.y[i] + offY + dy;
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
          rect(0, gx, gy - line.ascent, adv, line.lineHeight, bg[0] * ic[0], bg[1] * ic[1], bg[2] * ic[2], alpha * bg[3]);
        }

        const face = meta.face;
        const gid = insp.glyphIds[i];
        const ppem = bucketPpem(size * ppu);
        const rs = ppem / size;
        const cx = gx + adv / 2, cy = gy - size * 0.35;
        const sx = st.scaleX, sy = st.scaleY;
        const rotate = st.angle !== 0 || sx !== 1 || sy !== 1;
        const ang = (st.angle * Math.PI) / 180;
        const cs = Math.cos(ang), sn = Math.sin(ang);
        const shear = face.fakeItalic ? FAKE_ITALIC_SHEAR : 0;
        const emit = (entry, pass, cr, cg, cb, ca) => {
          const lx = gx + entry.ox / rs, ty = gy + entry.oy / rs;
          const rx = lx + entry.w / rs, by = ty + entry.h / rs;
          const out = SCRATCH_OUT, pts = SCRATCH_PTS;
          pts[0] = lx; pts[1] = ty; pts[2] = rx; pts[3] = ty;
          pts[4] = rx; pts[5] = by; pts[6] = lx; pts[7] = by;
          for (let k = 0; k < 4; k++) {
            let px = pts[k * 2], py = pts[k * 2 + 1];
            px += shear * (gy - py);
            if (rotate) {
              const vx = (px - cx) * sx, vy = (py - cy) * sy;
              px = cx + vx * cs - vy * sn;
              py = cy + vx * sn + vy * cs;
            }
            out[k * 2] = ox + px * ex + py * fx;
            out[k * 2 + 1] = oy + px * ey + py * fy;
          }
          batch(pass, entry.page).push(
            out[0], out[1], out[2], out[3], out[4], out[5], out[6], out[7],
            z, entry.u0, entry.v0, entry.u1, entry.v1, cr, cg, cb, ca
          );
        };

        // Outline width follows the built-in Text object: size/64 per unit of thickness.
        const strokePx = Math.max(0.5, Math.round(((size * st.lineThickness) / 64) * rs * 2) / 2);
        if (st.outline && !st.stroke) {
          const e = atlas.get(face, gid, ppem, face.fakeBold, strokePx);
          if (e) {
            const oc = st.outline;
            emit(e, 1, oc[0] * ic[0], oc[1] * ic[1], oc[2] * ic[2], alpha * oc[3]);
          }
        }
        const e = atlas.get(face, gid, ppem, face.fakeBold, st.stroke ? strokePx : 0);
        if (e) emit(e, 2, r, g, b, a);

        if (st.underline || st.strike) {
          const fm = face.font.metrics;
          const k = size / fm.unitsPerEm;
          if (st.underline) {
            const th = Math.max(0.5, fm.underlineThickness * k * st.lineThickness);
            rect(3, gx, gy - fm.underlinePosition * k - th / 2, adv, th, r, g, b, a);
          }
          if (st.strike) {
            const th = Math.max(0.5, fm.strikeoutSize * k * st.lineThickness);
            rect(3, gx, gy - fm.strikeoutPosition * k - th / 2, adv, th, r, g, b, a);
          }
        }
      }

      atlas.flush(renderer);
      renderer.setTextureFillMode();
      for (const pass of passes) {
        for (const [page, b] of pass) {
          if (!b.count) continue;
          renderer.setTexture(page.texture);
          b.draw(renderer);
        }
      }
    }

    _onRendererContextLost() {
      this._shared.atlas.invalidateTextures();
    }

    _onRendererContextRestored() {
      this.runtime.sdk.updateRender();
    }

    // ---- typewriter ----

    _tgStartTypewriter(text, duration) {
      this._tgCancelTypewriter();
      this._tgSetText(text);
      const ends = graphemeEnds(this._tgPlainText());
      duration = Number(duration) || 0;
      if (!ends.length || duration <= 0) {
        this.runtime.sdk.updateRender();
        return;
      }
      this._twEnds = ends;
      this._twStart = this.runtime.gameTime;
      this._twEnd = this._twStart + duration;
      this._twReveal = 0;
      this._setTicking(true);
      this.runtime.sdk.updateRender();
    }

    _tgIsTypewriting() {
      return this._twEnd !== -1;
    }

    _tick() {
      if (this._twEnd === -1) return;
      const p = Math.min(1, Math.max(0, (this.runtime.gameTime - this._twStart) / (this._twEnd - this._twStart)));
      const ends = this._twEnds;
      const n = Math.floor(p * ends.length);
      const reveal = n > 0 ? ends[n - 1] : 0;
      if (reveal !== this._twReveal) {
        this._twReveal = reveal;
        this.runtime.sdk.updateRender();
      }
      if (p >= 1) this._tgFinishTypewriter();
    }

    _tgFinishTypewriter() {
      if (this._twEnd === -1) return;
      this._tgCancelTypewriter();
      this.runtime.sdk.updateRender();
      this._trigger("OnTypewriterTextFinished");
    }

    _tgCancelTypewriter() {
      this._twStart = -1;
      this._twEnd = -1;
      this._twEnds = null;
      this._twReveal = Infinity;
      this._setTicking(false);
    }

    // ---- tags ----

    _tgLocalFromWorld(x, y) {
      const q = this.getBoundingQuad(true);
      const w = this._layoutW, h = this._layoutH;
      const ex = (q.p2.x - q.p1.x) / w, ey = (q.p2.y - q.p1.y) / w;
      const fx = (q.p4.x - q.p1.x) / h, fy = (q.p4.y - q.p1.y) / h;
      const dx = x - q.p1.x, dy = y - q.p1.y;
      return [dx * ex + dy * ey, dx * fx + dy * fy];
    }

    _tgGlyphBox(i) {
      const insp = this._insp;
      const line = insp.lines[this._glyphLine[i]];
      return [insp.x[i], insp.y[i] + this._offsetY - line.ascent, insp.glyphAdvances[i], line.lineHeight];
    }

    _tgTagAt(x, y) {
      if (!this._tgEnsureLayout()) return "";
      const [lx, ly] = this._tgLocalFromWorld(x, y);
      const insp = this._insp;
      for (let i = 0; i < insp.glyphCount; i++) {
        const [gx, top, adv, lh] = this._tgGlyphBox(i);
        if (lx >= gx && lx < gx + adv && ly >= top && ly < top + lh)
          return this._metas[this._glyphFrag[i]].st.tag;
      }
      return "";
    }

    _tgTagFrags(tag) {
      if (!this._tgEnsureLayout()) return [];
      tag = String(tag).toLowerCase();
      const out = [];
      this._metas.forEach((m, i) => {
        if (m.st.tag && m.st.tag.toLowerCase() === tag) out.push(i);
      });
      return out;
    }

    _tgTagCount(tag) {
      return this._tgTagFrags(tag).length;
    }

    // Returns { x, y, width, height } in layout coordinates, or null.
    _tgTagRect(tag, index) {
      const frags = this._tgTagFrags(tag);
      index = Math.floor(index);
      if (index < 0 || index >= frags.length) return null;
      const frag = frags[index];
      const insp = this._insp;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (let i = 0; i < insp.glyphCount; i++) {
        if (this._glyphFrag[i] !== frag) continue;
        const [gx, top, adv, lh] = this._tgGlyphBox(i);
        x0 = Math.min(x0, gx); y0 = Math.min(y0, top);
        x1 = Math.max(x1, gx + adv); y1 = Math.max(y1, top + lh);
      }
      if (x0 === Infinity) return null;
      const q = this.getBoundingQuad(true);
      const w = this._layoutW, h = this._layoutH;
      const ex = (q.p2.x - q.p1.x) / w, ey = (q.p2.y - q.p1.y) / w;
      const fx = (q.p4.x - q.p1.x) / h, fy = (q.p4.y - q.p1.y) / h;
      return {
        x: q.p1.x + x0 * ex + y0 * fx,
        y: q.p1.y + x0 * ey + y0 * fy,
        width: x1 - x0,
        height: y1 - y0,
      };
    }

    // ---- savegames and debugger ----

    _saveToJson() {
      const o = {
        t: this._text,
        bbc: this._bbcode,
        fn: this._family,
        ps: this._ptSize,
        lho: this._lineHeightOffset,
        b: this._bold,
        i: this._italic,
        c: this._color,
        ha: this._hAlign,
        va: this._vAlign,
        wr: this._wrap,
        dir: this._direction,
      };
      if (this._twEnd !== -1) o.tw = { st: this._twStart, en: this._twEnd, r: this._twReveal };
      return o;
    }

    _loadFromJson(o) {
      this._tgCancelTypewriter();
      this._text = o.t;
      this._bbcode = !!o.bbc;
      this._family = o.fn;
      this._ptSize = o.ps;
      this._lineHeightOffset = o.lho;
      this._bold = !!o.b;
      this._italic = !!o.i;
      this._color = o.c;
      this._hAlign = o.ha;
      this._vAlign = o.va;
      this._wrap = o.wr;
      this._direction = o.dir;
      this._shared.fonts.getFace(this._family, this._bold, this._italic);
      this._tgMarkDirty(true);
      if (o.tw) {
        this._twEnds = graphemeEnds(this._tgPlainText());
        this._twStart = o.tw.st;
        this._twEnd = o.tw.en;
        this._twReveal = o.tw.r;
        this._setTicking(true);
      }
    }

    _getDebuggerProperties() {
      return [
        {
          title: "Text Glyph",
          properties: [
            { name: "Text", value: this._text, onedit: (v) => this._tgSetText(v) },
            { name: "Font", value: this._family, onedit: (v) => this._tgSetFont(v, this._bold, this._italic) },
            { name: "Size", value: this._ptSize, onedit: (v) => this._tgSetSize(v) },
            { name: "Glyphs", value: this._insp ? this._insp.glyphCount : 0 },
            { name: "Lines", value: this._insp ? this._insp.lineCount : 0 },
          ],
        },
      ];
    }
  };
}
