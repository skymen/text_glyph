export const FONT_EXTS = [".ttf", ".otf"];

// File name stems tried for a family/style, most specific first. The last
// REGULAR_STEMS entries are the regular face.
export const REGULAR_STEMS = 5;
export function variantStems(family, bold, italic) {
  const f = family.toLowerCase().trim();
  const stems = [];
  if (bold && italic)
    stems.push(
      `${f} bold italic`, `${f}-bolditalic`, `${f}bolditalic`, `${f}-bold-italic`,
      `${f}_bolditalic`, `${f} bolditalic`, `${f}-bi`, `${f}z`
    );
  else if (bold) stems.push(`${f} bold`, `${f}-bold`, `${f}bold`, `${f}_bold`, `${f}-b`, `${f}bd`);
  else if (italic) stems.push(`${f} italic`, `${f}-italic`, `${f}italic`, `${f}_italic`, `${f}-i`, `${f}i`);
  stems.push(f, `${f} regular`, `${f}-regular`, `${f}regular`, `${f}_regular`);
  return stems;
}

// Same numbers glyph reports in Font.metrics, taken from the font tables so
// both layout paths agree.
function metricsOf(otf) {
  const os2 = otf.tables.os2 || {};
  const post = otf.tables.post || {};
  return {
    unitsPerEm: otf.unitsPerEm,
    ascender: otf.ascender,
    descender: otf.descender,
    lineGap: otf.tables.hhea ? otf.tables.hhea.lineGap : 0,
    underlinePosition: post.underlinePosition ?? -otf.unitsPerEm * 0.1,
    underlineThickness: post.underlineThickness || otf.unitsPerEm * 0.05,
    strikeoutPosition: os2.yStrikeoutPosition ?? otf.unitsPerEm * 0.25,
    strikeoutSize: os2.yStrikeoutSize || otf.unitsPerEm * 0.05,
  };
}

// One record per (family, bold, italic). Records that share a file share the
// decoded font objects through fileCache.
//
// adapter:
//   findFile(stems) -> { name, index } for the first stem with a file, or null
//   loadFile(name) -> Promise<ArrayBuffer>
//   parseFont(buffer) -> opentype.js Font
//   getEngine() -> Promise<glyph engine>, or null when laying out in JS
//   onChange() -> called when a face becomes ready
export class FontManager {
  constructor(adapter) {
    this.adapter = adapter;
    this.faces = new Map();
    this.fileCache = new Map();
    this.version = 0;
  }

  static faceKey(family, bold, italic) {
    return `${family.toLowerCase().trim()}|${bold ? 1 : 0}|${italic ? 1 : 0}`;
  }

  // Sync. Returns the ready face record or null while it loads or if missing.
  getFace(family, bold, italic) {
    const key = FontManager.faceKey(family, bold, italic);
    let rec = this.faces.get(key);
    if (!rec) {
      rec = { key, family, bold, italic, status: "loading", font: null, otf: null, metrics: null, fakeBold: false, fakeItalic: false, promise: null };
      rec.promise = this._load(rec);
      this.faces.set(key, rec);
    }
    return rec.status === "ready" ? rec : null;
  }

  loadFace(family, bold, italic) {
    this.getFace(family, bold, italic);
    return this.faces.get(FontManager.faceKey(family, bold, italic)).promise;
  }

  isLoaded(family, bold, italic) {
    const rec = this.faces.get(FontManager.faceKey(family, bold, italic));
    return !!rec && rec.status === "ready";
  }

  // "missing" once the lookup failed. Used by the editor to fall back.
  status(family, bold, italic) {
    const rec = this.faces.get(FontManager.faceKey(family, bold, italic));
    return rec ? rec.status : "loading";
  }

  _resolveFile(family, bold, italic) {
    const stems = variantStems(family, bold, italic);
    const found = this.adapter.findFile(stems);
    if (!found) return null;
    return { name: found.name, exact: found.index < stems.length - REGULAR_STEMS };
  }

  async _loadFile(name) {
    let entry = this.fileCache.get(name);
    if (!entry) {
      entry = (async () => {
        const enginePromise = this.adapter.getEngine();
        const buffer = await this.adapter.loadFile(name);
        const otf = this.adapter.parseFont(buffer);
        let font = null;
        if (enginePromise) {
          const engine = await enginePromise;
          font = await engine.loadFont(new Uint8Array(buffer));
        }
        return { font, otf, metrics: metricsOf(otf) };
      })();
      this.fileCache.set(name, entry);
    }
    return entry;
  }

  async _load(rec) {
    try {
      const found = this._resolveFile(rec.family, rec.bold, rec.italic);
      if (!found) {
        rec.status = "missing";
        console.warn(`[Text Glyph] no .ttf/.otf project file found for font "${rec.family}"`);
        return null;
      }
      const { font, otf, metrics } = await this._loadFile(found.name);
      rec.font = font;
      rec.otf = otf;
      rec.metrics = metrics;
      rec.fakeBold = rec.bold && !found.exact;
      rec.fakeItalic = rec.italic && !found.exact;
      rec.status = "ready";
    } catch (e) {
      rec.status = "missing";
      console.error(`[Text Glyph] failed to load font "${rec.family}"`, e);
      return null;
    }
    this.version++;
    this.adapter.onChange();
    return rec;
  }
}
