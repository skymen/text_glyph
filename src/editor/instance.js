// Editor preview draws with Construct's own text renderer. Glyph shaping only
// runs at runtime, so the preview is an approximation: BBCode tags are
// stripped and the base font/style is used for the whole text.
const H_ALIGN = ["left", "center", "right"];
const V_ALIGN = ["top", "center", "bottom"];
const WRAP = ["word", "character"];
const TAG_RE = /\[(\/?)([^\[\n]*?)\]/g;

function stripTags(text) {
  return text.replace(TAG_RE, "").replace(/\\\[/g, "[").replace(/\\\\/g, "\\");
}

export default function (instanceClass) {
  return class extends instanceClass {
    constructor(sdkType, inst) {
      super(sdkType, inst);
      this._text = null;
      this._layoutView = null;
      this._ensureFontLoaded();
    }

    Release() {
      if (this._text) {
        this._text.Release();
        this._text = null;
      }
    }

    OnCreate() {}

    OnPlacedInLayout() {}

    OnPropertyChanged(id, value) {
      if (id === "font") this._ensureFontLoaded();
      if (this._layoutView) this._layoutView.Refresh();
    }

    // EnsureFontLoaded is typed as returning a Promise but returns undefined
    // when the font is already available.
    _ensureFontLoaded() {
      const font = this._inst.GetPropertyValue("font");
      if (!font) return;
      Promise.resolve(this._inst.GetProject().EnsureFontLoaded(font)).then(() => {
        if (this._layoutView) this._layoutView.Refresh();
      });
    }

    Draw(iRenderer, iDrawParams) {
      const layoutView = iDrawParams.GetLayoutView();
      this._layoutView = layoutView;
      if (!this._text) {
        this._text = iRenderer.CreateRendererText();
        this._text.SetTextureUpdateCallback(() => layoutView.Refresh());
      }
      const t = this._text;
      const inst = this._inst;
      const source = String(inst.GetPropertyValue("text"));
      t.SetText(inst.GetPropertyValue("bbcode") ? stripTags(source) : source);
      t.SetFontName(inst.GetPropertyValue("font") || "Arial");
      t.SetFontSize(inst.GetPropertyValue("size"));
      t.SetLineHeight(inst.GetPropertyValue("lineHeight"));
      t.SetBold(!!inst.GetPropertyValue("bold"));
      t.SetItalic(!!inst.GetPropertyValue("italic"));
      const c = inst.GetPropertyValue("color");
      if (Array.isArray(c)) t.SetColorRgb(c[0], c[1], c[2]);
      else if (c && typeof c.getR === "function") t.SetColorRgb(c.getR(), c.getG(), c.getB());
      t.SetHorizontalAlignment(H_ALIGN[inst.GetPropertyValue("hAlign")] || "left");
      t.SetVerticalAlignment(V_ALIGN[inst.GetPropertyValue("vAlign")] || "top");
      t.SetWordWrapMode(WRAP[inst.GetPropertyValue("wrap")] || "word");
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
