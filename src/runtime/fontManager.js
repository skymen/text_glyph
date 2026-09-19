import { parseOpenType } from "../vendor/glyph.js";
import { getGlyphEngine } from "./glyphEngine.js";

const FONT_EXTS = [".ttf", ".otf"];

function baseName(name) {
  const slash = Math.max(name.lastIndexOf("/"), name.lastIndexOf("\\"));
  return slash === -1 ? name : name.substring(slash + 1);
}

function stemOf(name) {
  const base = baseName(name);
  const dot = base.lastIndexOf(".");
  return (dot === -1 ? base : base.substring(0, dot)).toLowerCase();
}

// File name stems tried for a family/style, most specific first.
function variantStems(family, bold, italic) {
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

// One record per (family, bold, italic). Records that share a file share the
// decoded font objects through fileCache.
export class FontManager {
  constructor(runtime) {
    this.runtime = runtime;
    this.faces = new Map();
    this.fileCache = new Map();
    this.fileIndex = null;
    this.version = 0;
  }

  _index() {
    if (this.fileIndex) return this.fileIndex;
    const index = new Map();
    for (const entry of this.runtime.assets.projectFileList) {
      const lower = entry.name.toLowerCase();
      if (!FONT_EXTS.some((ext) => lower.endsWith(ext))) continue;
      const stem = stemOf(entry.name);
      if (!index.has(stem)) index.set(stem, entry.name);
    }
    this.fileIndex = index;
    return index;
  }

  static faceKey(family, bold, italic) {
    return `${family.toLowerCase().trim()}|${bold ? 1 : 0}|${italic ? 1 : 0}`;
  }

  // Sync. Returns the ready face record or null while it loads or if missing.
  getFace(family, bold, italic) {
    const key = FontManager.faceKey(family, bold, italic);
    let rec = this.faces.get(key);
    if (!rec) {
      rec = { key, family, bold, italic, status: "loading", font: null, otf: null, fakeBold: false, fakeItalic: false, promise: null };
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

  // The last 5 stems are always the regular face, everything before is the
  // requested style. exact tells whether a style file was found.
  _resolveFile(family, bold, italic) {
    const index = this._index();
    const stems = variantStems(family, bold, italic);
    const regularStart = stems.length - 5;
    for (let i = 0; i < stems.length; i++) {
      const name = index.get(stems[i]);
      if (name) return { name, exact: i < regularStart };
    }
    return null;
  }

  async _loadFile(name) {
    let entry = this.fileCache.get(name);
    if (!entry) {
      entry = (async () => {
        const engine = await getGlyphEngine(this.runtime);
        const url = await this.runtime.assets.getProjectFileUrl(name);
        const buffer = await this.runtime.assets.fetchArrayBuffer(url);
        const [font, otf] = await Promise.all([
          engine.loadFont(new Uint8Array(buffer)),
          Promise.resolve().then(() => parseOpenType(buffer)),
        ]);
        return { font, otf };
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
      const { font, otf } = await this._loadFile(found.name);
      rec.font = font;
      rec.otf = otf;
      rec.fakeBold = rec.bold && !found.exact;
      rec.fakeItalic = rec.italic && !found.exact;
      rec.status = "ready";
    } catch (e) {
      rec.status = "missing";
      console.error(`[Text Glyph] failed to load font "${rec.family}"`, e);
      return null;
    }
    this.version++;
    this.runtime.sdk.updateRender();
    return rec;
  }
}
