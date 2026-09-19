import { id, addonType } from "../../config.caw.js";
import AddonTypeMap from "../../template/addonTypeMap.js";
import { createShared, TextCore } from "./textCore.js";
import { FONT_EXTS } from "./fontManager.js";
import { getGlyphEngine } from "./glyphEngine.js";
import { graphemeEnds } from "./bbcode.js";
import { parseOpenType } from "../vendor/glyph.js";

function stemOf(name) {
  const slash = Math.max(name.lastIndexOf("/"), name.lastIndexOf("\\"));
  const base = slash === -1 ? name : name.substring(slash + 1);
  const dot = base.lastIndexOf(".");
  return (dot === -1 ? base : base.substring(0, dot)).toLowerCase();
}

// Engine, font manager and atlas are shared by every instance of one runtime.
const sharedByRuntime = new WeakMap();
function getShared(runtime) {
  let s = sharedByRuntime.get(runtime);
  if (s) return s;
  let fileIndex = null;
  const loadProjectFile = async (name) => runtime.assets.fetchArrayBuffer(await runtime.assets.getProjectFileUrl(name));
  const adapter = {
    createEngine: () => getGlyphEngine(loadProjectFile),
    parseFont: parseOpenType,
    findFile(stems) {
      if (!fileIndex) {
        fileIndex = new Map();
        for (const entry of runtime.assets.projectFileList) {
          const lower = entry.name.toLowerCase();
          if (!FONT_EXTS.some((ext) => lower.endsWith(ext))) continue;
          const stem = stemOf(entry.name);
          if (!fileIndex.has(stem)) fileIndex.set(stem, entry.name);
        }
      }
      for (let i = 0; i < stems.length; i++) {
        const name = fileIndex.get(stems[i]);
        if (name) return { name, index: i };
      }
      return null;
    },
    loadFile: loadProjectFile,
    onChange: () => runtime.sdk.updateRender(),
  };
  s = createShared(adapter);
  sharedByRuntime.set(runtime, s);
  runtime.sdk.addLoadPromise(s.ready);
  return s;
}

export default function (parentClass) {
  return class extends parentClass {
    constructor() {
      super();
      this._shared = getShared(this.runtime);
      const core = (this._core = new TextCore(this._shared));
      const p = this._getInitProperties();
      if (p) {
        // Property order from config.caw.js. The "fontInfo" info property has
        // no value and is not part of this list.
        core.text = String(p[0] ?? "");
        core.bbcode = !!p[1];
        core.family = String(p[2] || "Arial");
        core.ptSize = Number(p[3]) || 12;
        core.lineHeightOffset = Number(p[4]) || 0;
        core.bold = !!p[5];
        core.italic = !!p[6];
        if (Array.isArray(p[7])) core.color = [p[7][0], p[7][1], p[7][2]];
        core.alignX = Number(p[8]) || 0;
        core.alignY = Number(p[9]) || 0;
        core.justify = p[10] | 0;
        core.wrap = p[11] | 0;
        core.overflow = !!p[12];
        core.ellipsis = !!p[13];
        core.maxLines = Math.max(0, p[14] | 0);
        core.direction = p[15] | 0;
        this.originX = Number(p[16]) || 0;
        this.originY = Number(p[17]) || 0;
        this._iconSid = typeof p[18] === "number" ? p[18] : 0;
        core.letterSpacing = Number(p[19]) || 0;
        core.wordSpacing = Number(p[20]) || 0;
        core.paragraphSpacing = Number(p[21]) || 0;
        core.columns = Math.max(1, p[22] | 0);
        core.columnGap = Math.max(0, Number(p[23]) || 0);
        core.justifyMin = Math.min(1, Math.max(0.01, Number(p[24]) || 1));
        core.justifyMax = Math.max(0, Number(p[25]) || 0);
        core.justifyLetter = Math.max(0, Number(p[26]) || 0);
      }
      this._iconClass = null;
      this._iconCache = new Map();
      core.iconResolver = (name, frame) => this._tgResolveIcon(name, frame);
      this._exclusions = [];
      this._twStart = -1;
      this._twEnd = -1;
      this._twEnds = null;
      this._twReveal = Infinity;
      this._frame = { ox: 0, oy: 0, ex: 1, ey: 0, fx: 0, fy: 1, z: 0, ppu: 1, tint: null, opacity: 1, twReveal: Infinity, pixelRounding: false };
      this._shared.fonts.getFace(core.family, core.bold, core.italic);
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
      this._tgClearExclusions();
      this._core.dispose();
      super._release();
    }

    // Same script surface as ITextInstance, so behaviors written for the
    // built-in Text object (Animate Text) work on this one too.
    get text() {
      return this._core.text;
    }

    set text(value) {
      this._tgCancelTypewriter();
      this._tgSetText(value);
    }

    get fontColor() {
      const c = this._core.color;
      return [c[0], c[1], c[2]];
    }

    get sizePt() {
      return this._core.ptSize;
    }

    get textWidth() {
      return this._tgTextWidth();
    }

    get textHeight() {
      return this._tgTextHeight();
    }

    // ---- state setters used by ACEs ----

    _tgChanged(changed) {
      if (changed) this.runtime.sdk.updateRender();
    }

    _tgSetText(text) {
      this._tgChanged(this._core.setText(text));
    }

    _tgSetBBCode(enabled) {
      this._tgChanged(this._core.setBBCode(enabled));
    }

    _tgSetFont(family, bold, italic) {
      this._tgChanged(this._core.setFont(family, bold, italic));
    }

    _tgSetSize(pt) {
      this._tgChanged(this._core.setSize(pt));
    }

    _tgSetColor(rgb) {
      this._tgChanged(this._core.setColor(rgb));
    }

    _tgSetLineHeight(v) {
      this._tgChanged(this._core.setLineHeight(v));
    }

    _tgSetAlignment(x, y) {
      this._tgChanged(this._core.setAlignment(x, y));
    }

    _tgSetJustify(i) {
      this._tgChanged(this._core.setJustify(i));
    }

    _tgSetWrap(i) {
      this._tgChanged(this._core.setWrap(i));
    }

    _tgSetDirection(i) {
      this._tgChanged(this._core.setDirection(i));
    }

    _tgSetOverflow(v) {
      this._tgChanged(this._core.setOverflow(v));
    }

    _tgSetMaxLines(n) {
      this._tgChanged(this._core.setMaxLines(n));
    }

    _tgSetLetterSpacing(v) {
      this._tgChanged(this._core.setLetterSpacing(v));
    }

    _tgSetWordSpacing(v) {
      this._tgChanged(this._core.setWordSpacing(v));
    }

    _tgSetParagraphSpacing(v) {
      this._tgChanged(this._core.setParagraphSpacing(v));
    }

    _tgSetColumns(count, gap) {
      this._tgChanged(this._core.setColumns(count, gap));
    }

    _tgSetJustifyTuning(min, max, letter) {
      this._tgChanged(this._core.setJustifyTuning(min, max, letter));
    }

    // ---- icons ----

    _tgSetIconSet(objectClass) {
      this._iconClass = objectClass;
      this._iconCache.clear();
      this._tgChanged(this._core._dirty(false));
    }

    _tgIconClass() {
      if (this._iconClass) return this._iconClass;
      if (this._iconSid > 0) this._iconClass = this.runtime.sdk.getObjectClassBySid(this._iconSid);
      return this._iconClass;
    }

    // Frames come from a Sprite instance, the only public way to reach a
    // Sprite's animations, so the icon set needs an instance in the layout.
    // The built-in Text finds icons by frame tag across every animation; the
    // public SDK cannot list animations, so here the name is the animation
    // and the frame is an index or a tag inside it.
    _tgResolveIcon(name, frame) {
      const key = name + "\u0001" + frame;
      const cached = this._iconCache.get(key);
      if (cached) return cached;
      const oc = this._tgIconClass();
      if (!oc) return null;
      const inst = oc.getFirstInstance();
      if (!inst) return null;
      if (!inst.getAnimation) throw new Error("[Text Glyph] the icon set must be a Sprite");
      const anim = inst.getAnimation(name);
      if (!anim) return null;
      const frames = anim.getFrames();
      const index = frame === "" ? 0 : Number(frame);
      const f = Number.isFinite(index) ? frames[Math.min(Math.max(0, index | 0), frames.length - 1)] : frames.find((fr) => fr.tag === frame) || frames[0];
      const r = f.getTexRect();
      const icon = {
        width: f.width,
        height: f.height,
        texture: (renderer) => f.getTexture(renderer),
        uv: [r.x, r.y, r.x + r.width, r.y + r.height],
      };
      this._iconCache.set(key, icon);
      return icon;
    }

    // ---- flow exclusions ----

    _tgAddExclusion(objectClass, side, margin) {
      for (const inst of objectClass.getPickedInstances()) {
        if (this._exclusions.some((e) => e.inst === inst)) continue;
        const entry = { inst, side: side | 0, margin: Number(margin) || 0, key: "u" + inst.uid, onDestroy: null };
        entry.onDestroy = () => this._tgRemoveExclusionEntry(entry);
        inst.addEventListener("destroy", entry.onDestroy);
        this._exclusions.push(entry);
      }
      this.runtime.sdk.updateRender();
    }

    _tgRemoveExclusion(objectClass) {
      for (const inst of objectClass.getPickedInstances()) {
        const entry = this._exclusions.find((e) => e.inst === inst);
        if (entry) this._tgRemoveExclusionEntry(entry);
      }
      this.runtime.sdk.updateRender();
    }

    _tgRemoveExclusionEntry(entry) {
      const i = this._exclusions.indexOf(entry);
      if (i === -1) return;
      entry.inst.removeEventListener("destroy", entry.onDestroy);
      this._exclusions.splice(i, 1);
    }

    _tgClearExclusions() {
      while (this._exclusions.length) this._tgRemoveExclusionEntry(this._exclusions[0]);
    }

    // World polygon of an instance: a Sprite's collision polygon in layout
    // coordinates (getPolyPoint, the same as the PolyX/PolyY expressions),
    // or the bounding quad of anything else.
    _tgWorldPolygon(inst) {
      if (inst.getPolyPointCount) {
        const n = inst.getPolyPointCount();
        if (n >= 3) {
          const out = [];
          for (let i = 0; i < n; i++) out.push(inst.getPolyPoint(i));
          return out;
        }
      }
      const q = inst.getBoundingQuad();
      return [[q.p1.x, q.p1.y], [q.p2.x, q.p2.y], [q.p3.x, q.p3.y], [q.p4.x, q.p4.y]];
    }

    _tgSyncExclusions() {
      if (!this._exclusions.length && !this._core.exclusions.length) return;
      const a = this._tgLocalAxes();
      const list = [];
      for (const e of this._exclusions) {
        const vertices = this._tgWorldPolygon(e.inst).map(([x, y]) => {
          const dx = x - a.ox, dy = y - a.oy;
          return [dx * a.ex + dy * a.ey, dx * a.fx + dy * a.fy];
        });
        list.push({ key: e.key, vertices, side: e.side, margin: e.margin });
      }
      this._core.setExclusions(list);
    }

    _tgSetEllipsis(v) {
      this._tgChanged(this._core.setEllipsis(v));
    }

    _tgSetOrigin(x, y) {
      this.originX = Number(x) || 0;
      this.originY = Number(y) || 0;
    }

    _tgSetOriginX(x) {
      this.originX = Number(x) || 0;
    }

    _tgSetOriginY(y) {
      this.originY = Number(y) || 0;
    }

    _tgSetHAlign(x) {
      this._tgSetAlignment(x, this._core.alignY);
    }

    _tgSetVAlign(y) {
      this._tgSetAlignment(this._core.alignX, y);
    }

    _tgPlainText() {
      return this._core.plainText();
    }

    // ---- layout ----

    _tgEnsureLayout() {
      this._tgSyncExclusions();
      return this._core.ensureLayout(this.width, this.height);
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
      return this._tgEnsureLayout() ? this._core.textWidth() : 0;
    }

    _tgTextHeight() {
      return this._tgEnsureLayout() ? this._core.textHeight() : 0;
    }

    _tgLineCount() {
      return this._tgEnsureLayout() ? this._core.lineCount() : 0;
    }

    // ---- drawing ----

    _draw(renderer) {
      if (!this._tgEnsureLayout()) return;
      const w = Math.max(1, Math.abs(this.width)), h = Math.max(1, Math.abs(this.height));
      const q = this.getBoundingQuad(true);
      const f = this._frame;
      f.ox = q.p1.x;
      f.oy = q.p1.y;
      f.ex = (q.p2.x - q.p1.x) / w;
      f.ey = (q.p2.y - q.p1.y) / w;
      f.fx = (q.p4.x - q.p1.x) / h;
      f.fy = (q.p4.y - q.p1.y) / h;
      f.z = renderer.getCurrentZ();
      f.ppu = this._tgPixelsPerUnit();
      f.tint = this.colorRgb;
      f.opacity = this.opacity;
      f.twReveal = this._twReveal;
      f.pixelRounding = this.runtime.isPixelRoundingEnabled;
      this._core.draw(renderer, f);
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

    _tgLocalAxes() {
      const w = Math.max(1, Math.abs(this.width)), h = Math.max(1, Math.abs(this.height));
      const q = this.getBoundingQuad(true);
      return {
        ox: q.p1.x, oy: q.p1.y,
        ex: (q.p2.x - q.p1.x) / w, ey: (q.p2.y - q.p1.y) / w,
        fx: (q.p4.x - q.p1.x) / h, fy: (q.p4.y - q.p1.y) / h,
      };
    }

    _tgTagAt(x, y) {
      if (!this._tgEnsureLayout()) return "";
      const a = this._tgLocalAxes();
      const dx = x - a.ox, dy = y - a.oy;
      return this._core.tagAt(dx * a.ex + dy * a.ey, dx * a.fx + dy * a.fy);
    }

    _tgTagCount(tag) {
      return this._tgEnsureLayout() ? this._core.tagFrags(tag).length : 0;
    }

    // Returns { x, y, width, height } in layout coordinates, or null.
    _tgTagRect(tag, index) {
      if (!this._tgEnsureLayout()) return null;
      const b = this._core.tagBounds(tag, index);
      if (!b) return null;
      const a = this._tgLocalAxes();
      return {
        x: a.ox + b[0] * a.ex + b[1] * a.fx,
        y: a.oy + b[0] * a.ey + b[1] * a.fy,
        width: b[2] - b[0],
        height: b[3] - b[1],
      };
    }

    // ---- savegames and debugger ----

    _saveToJson() {
      const c = this._core;
      const o = {
        t: c.text,
        bbc: c.bbcode,
        fn: c.family,
        ps: c.ptSize,
        lho: c.lineHeightOffset,
        b: c.bold,
        i: c.italic,
        c: c.color,
        ax: c.alignX,
        ay: c.alignY,
        j: c.justify,
        wr: c.wrap,
        ov: c.overflow,
        el: c.ellipsis,
        ml: c.maxLines,
        dir: c.direction,
        ls: c.letterSpacing,
        ws: c.wordSpacing,
        ps: c.paragraphSpacing,
        col: c.columns,
        cg: c.columnGap,
        jn: c.justifyMin,
        jx: c.justifyMax,
        jl: c.justifyLetter,
      };
      if (this._twEnd !== -1) o.tw = { st: this._twStart, en: this._twEnd, r: this._twReveal };
      return o;
    }

    _loadFromJson(o) {
      this._tgCancelTypewriter();
      const c = this._core;
      c.text = o.t;
      c.bbcode = !!o.bbc;
      c.family = o.fn;
      c.ptSize = o.ps;
      c.lineHeightOffset = o.lho;
      c.bold = !!o.b;
      c.italic = !!o.i;
      c.color = o.c;
      c.alignX = o.ax;
      c.alignY = o.ay;
      c.justify = o.j;
      c.wrap = o.wr;
      c.overflow = !!o.ov;
      c.ellipsis = !!o.el;
      c.maxLines = o.ml | 0;
      c.direction = o.dir;
      c.letterSpacing = o.ls || 0;
      c.wordSpacing = o.ws || 0;
      c.paragraphSpacing = o.ps || 0;
      c.columns = Math.max(1, o.col | 0);
      c.columnGap = o.cg || 0;
      c.justifyMin = o.jn ?? 1;
      c.justifyMax = o.jx || 0;
      c.justifyLetter = o.jl || 0;
      this._shared.fonts.getFace(c.family, c.bold, c.italic);
      c._dirty(true);
      this.runtime.sdk.updateRender();
      if (o.tw) {
        this._twEnds = graphemeEnds(this._tgPlainText());
        this._twStart = o.tw.st;
        this._twEnd = o.tw.en;
        this._twReveal = o.tw.r;
        this._setTicking(true);
      }
    }

    _getDebuggerProperties() {
      const c = this._core;
      return [
        {
          title: "Text Glyph",
          properties: [
            { name: "Text", value: c.text, onedit: (v) => this._tgSetText(v) },
            { name: "Font", value: c.family, onedit: (v) => this._tgSetFont(v, c.bold, c.italic) },
            { name: "Size", value: c.ptSize, onedit: (v) => this._tgSetSize(v) },
            { name: "Align X", value: c.alignX, onedit: (v) => this._tgSetAlignment(v, c.alignY) },
            { name: "Align Y", value: c.alignY, onedit: (v) => this._tgSetAlignment(c.alignX, v) },
            { name: "Glyphs", value: c.insp ? c.insp.glyphCount : 0 },
            { name: "Lines", value: c.insp ? c.insp.lineCount : 0 },
          ],
        },
      ];
    }
  };
}
