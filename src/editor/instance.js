// The editor draws with the same engine as the runtime, so BBCode styling
// shows in the layout view. When the font has no .ttf/.otf project file the
// preview falls back to Construct's own text renderer with the tags stripped.
import { TextCore } from "../runtime/textCore.js";
import {
  getEditorShared,
  gfxFor,
  addListener,
  removeListener,
} from "./shared.js";

const SDK = self.SDK;
const WRAP = ["word", "character", "none"];
const TAG_RE = /\[(\/?)([^\[\n]*?)\]/g;
const DEFAULT_SIZE = [200, 30, 0];

function stripTags(text) {
  return text.replace(TAG_RE, "").replace(/\\\[/g, "[").replace(/\\\\/g, "\\");
}

function colorOf(c) {
  if (Array.isArray(c)) return [c[0], c[1], c[2]];
  return [c.getR(), c.getG(), c.getB()];
}

export default function (instanceClass) {
  return class extends instanceClass {
    constructor(sdkType, inst) {
      super(sdkType, inst);
      this._text = null;
      this._layoutView = null;
      this._shared = getEditorShared(inst.GetProject());
      this._core = new TextCore(this._shared);
      this._frame = {
        ox: 0,
        oy: 0,
        ex: 1,
        ey: 0,
        fx: 0,
        fy: 1,
        z: 0,
        ppu: 1,
        tint: [1, 1, 1],
        opacity: 1,
        twReveal: Infinity,
        pixelRounding: false,
      };
      this._refresh = () => {
        if (this._layoutView) this._layoutView.Refresh();
      };
      this._iconCache = new Map();
      this._iconSetSeen = undefined;
      this._core.iconResolver = (name, frame) => this._resolveIcon(name, frame);
      addListener(this._refresh);
      this._syncAll();
      this._ensureFontLoaded();
    }

    Release() {
      removeListener(this._refresh);
      this._core.dispose();
      if (this._text) {
        this._text.Release();
        this._text = null;
      }
    }

    OnCreate() {
      this._inst.SetOrigin(this._prop("originX"), this._prop("originY"));
    }

    IsOriginalSizeKnown() {
      return true;
    }

    GetOriginalSize() {
      return DEFAULT_SIZE;
    }

    HasDoubleTapHandler() {
      return true;
    }

    OnDoubleTap() {
      const inst = this._inst;
      SDK.UI.Util.ShowLongTextPropertyDialog(
        String(inst.GetPropertyValue("text")),
        self.lang(".properties.text.name"),
      ).then((text) => {
        if (text === null) return;
        inst.GetProject().UndoPointChangeObjectInstancesProperty(inst, "text");
        inst.SetPropertyValue("text", text);
        this.OnPropertyChanged("text", text);
      });
    }

    _prop(id) {
      return this._inst.GetPropertyValue(id);
    }

    // The icon set property holds the Sprite's SID. Textures load on demand
    // and the view refreshes once they are ready.
    _resolveIcon(name, frame) {
      const key = name + "\u0001" + frame;
      const cached = this._iconCache.get(key);
      if (cached) return cached;
      let v = this._prop("iconSet");
      const type = typeof v === "number" ? this._inst.GetProject().GetObjectClassBySID(v) : v;
      if (!type || typeof type.GetAnimations !== "function") return null;
      const anim = type.GetAnimations().find((a) => a.GetName() === name);
      if (!anim) return null;
      const frames = anim.GetFrames();
      const f = frames[Math.min(frame, frames.length - 1)];
      const r = f.GetTexRect();
      const icon = {
        width: f.GetWidth(),
        height: f.GetHeight(),
        texture: () => {
          const tex = f.GetCachedWebGLTexture();
          if (!tex) f.LoadWebGLTexture().then(this._refresh);
          return tex;
        },
        uv: [r.getLeft(), r.getTop(), r.getRight(), r.getBottom()],
      };
      this._iconCache.set(key, icon);
      return icon;
    }

    _syncAll() {
      const c = this._core;
      c.setText(this._prop("text"));
      c.setBBCode(this._prop("bbcode"));
      c.setFont(
        this._prop("font") || "Arial",
        this._prop("bold"),
        this._prop("italic"),
      );
      c.setSize(this._prop("size"));
      c.setLineHeight(this._prop("lineHeight"));
      c.setColor(colorOf(this._prop("color")));
      c.setAlignment(this._prop("alignX"), this._prop("alignY"));
      c.setJustify(this._prop("justify"));
      c.setWrap(this._prop("wrap"));
      c.setOverflow(this._prop("overflow"));
      c.setEllipsis(this._prop("ellipsis"));
      c.setMaxLines(this._prop("maxLines"));
      c.setDirection(this._prop("direction"));
      c.setLetterSpacing(this._prop("letterSpacing"));
      c.setWordSpacing(this._prop("wordSpacing"));
      c.setParagraphSpacing(this._prop("paragraphSpacing"));
      c.setColumns(this._prop("columns"), this._prop("columnGap"));
      c.setJustifyTuning(this._prop("justifyMinWordSpace"), this._prop("justifyMaxWordSpace"), this._prop("justifyLetterSpace"));
      if (this._iconSetSeen !== this._prop("iconSet")) {
        this._iconSetSeen = this._prop("iconSet");
        this._iconCache.clear();
      }
    }

    OnPropertyChanged(id, value) {
      if (id === "originX" || id === "originY") {
        this._inst.SetOrigin(this._prop("originX"), this._prop("originY"));
      } else {
        this._syncAll();
        if (id === "font") this._ensureFontLoaded();
      }
      this._refresh();
    }

    // EnsureFontLoaded is typed as returning a Promise but returns undefined
    // when the font is already available. Only the fallback renderer needs it.
    _ensureFontLoaded() {
      const font = this._prop("font");
      if (!font) return;
      Promise.resolve(this._inst.GetProject().EnsureFontLoaded(font)).then(
        this._refresh,
      );
    }

    Draw(iRenderer, iDrawParams) {
      const layoutView = iDrawParams.GetLayoutView();
      this._layoutView = layoutView;
      const inst = this._inst;
      const core = this._core;
      const w = Math.max(1, Math.abs(inst.GetWidth())),
        h = Math.max(1, Math.abs(inst.GetHeight()));
      if (core.fontStatus() === "missing") {
        this._drawFallback(iRenderer, layoutView);
        return;
      }
      if (!core.ensureLayout(w, h)) return;
      const q = inst.GetQuad();
      const f = this._frame;
      f.ox = q.getTlx();
      f.oy = q.getTly();
      f.ex = (q.getTrx() - f.ox) / w;
      f.ey = (q.getTry() - f.oy) / w;
      f.fx = (q.getBlx() - f.ox) / h;
      f.fy = (q.getBly() - f.oy) / h;
      f.z = iRenderer.GetCurrentZ();
      const a = layoutView.LayoutToClientDevice(0, 0),
        b = layoutView.LayoutToClientDevice(1, 0);
      const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      f.ppu = d > 0 && isFinite(d) ? d : 1;
      const tint = inst.GetColor();
      f.tint[0] = tint.getR();
      f.tint[1] = tint.getG();
      f.tint[2] = tint.getB();
      f.opacity = inst.GetOpacity();
      inst.ApplyBlendMode(iRenderer);
      iRenderer.SetColorRgba(1, 1, 1, 1);
      core.draw(gfxFor(iRenderer), f);
    }

    _drawFallback(iRenderer, layoutView) {
      if (!this._text) {
        this._text = iRenderer.CreateRendererText();
        this._text.SetTextureUpdateCallback(this._refresh);
      }
      const t = this._text;
      const inst = this._inst;
      const source = String(this._prop("text"));
      t.SetText(this._prop("bbcode") ? stripTags(source) : source);
      t.SetFontName(this._prop("font") || "Arial");
      t.SetFontSize(this._prop("size"));
      t.SetLineHeight(this._prop("lineHeight"));
      t.SetBold(!!this._prop("bold"));
      t.SetItalic(!!this._prop("italic"));
      const c = colorOf(this._prop("color"));
      t.SetColorRgb(c[0], c[1], c[2]);
      const ax = this._prop("alignX"),
        ay = this._prop("alignY");
      t.SetHorizontalAlignment(
        ax < 0.25 ? "left" : ax > 0.75 ? "right" : "center",
      );
      t.SetVerticalAlignment(
        ay < 0.25 ? "top" : ay > 0.75 ? "bottom" : "center",
      );
      t.SetWordWrapMode(
        WRAP[this._prop("wrap")] === "character" ? "character" : "word",
      );
      t.SetSize(inst.GetWidth(), inst.GetHeight(), layoutView.GetZoomFactor());
      const texture = t.GetTexture();
      if (!texture) return;
      inst.ApplyBlendMode(iRenderer);
      iRenderer.SetTexture(texture);
      iRenderer.SetColor(inst.GetColor());
      iRenderer.Quad3(inst.GetQuad(), t.GetTexRect());
    }
  };
}
