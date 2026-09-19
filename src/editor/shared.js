// Editor side services: one font manager per project (files are looked up by
// name in that project), one atlas. The editor page's content security policy
// forbids WebAssembly, so text is laid out by src/runtime/simpleLayout.js.
import { createShared } from "../runtime/textCore.js";
import { FONT_EXTS } from "../runtime/fontManager.js";
import { parseOpenType } from "../vendor/opentype.js";

const listeners = new Set();

// Refresh callbacks from every live editor instance.
export function addListener(fn) {
  listeners.add(fn);
}

export function removeListener(fn) {
  listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn();
}

// The editor SDK has no project file listing, only lookups by name, so the
// stems are tried with the casings font files usually ship with.
function casings(stem) {
  const out = new Set([stem]);
  const title = stem.replace(/(^|[\s_-])([a-z])/g, (m, p, c) => p + c.toUpperCase());
  out.add(title);
  out.add(title.replace(/(bold|italic|regular)/g, (m) => m[0].toUpperCase() + m.slice(1)));
  out.add(stem.toUpperCase());
  return out;
}

const sharedByProject = new Map();

export function getEditorShared(project) {
  const key = project.GetName();
  let s = sharedByProject.get(key);
  if (s) return s;
  const adapter = {
    createEngine: null,
    parseFont: parseOpenType,
    findFile(stems) {
      for (let i = 0; i < stems.length; i++) {
        for (const stem of casings(stems[i])) {
          for (const ext of FONT_EXTS) {
            const file = project.GetProjectFileByName(stem + ext);
            if (file) return { name: stem + ext, index: i };
          }
        }
      }
      return null;
    },
    async loadFile(name) {
      const file = project.GetProjectFileByName(name);
      if (!file) throw new Error(`[Text Glyph] project file "${name}" not found`);
      return file.GetBlob().arrayBuffer();
    },
    onChange: notify,
  };
  s = createShared(adapter);
  sharedByProject.set(key, s);
  return s;
}

// Runtime IRenderer method names over the editor's IWebGLRenderer.
export function gfxFor(iRenderer) {
  return {
    drawMesh: (p, u, i, c) => iRenderer.DrawMesh(p, u, i, c),
    setTexture: (t) => iRenderer.SetTexture(t),
    setTextureFillMode: () => iRenderer.SetTextureFillMode(),
    createDynamicTexture: (w, h, o) => iRenderer.CreateDynamicTexture(w, h, o),
    updateTexture: (d, t, o) => iRenderer.UpdateTexture(d, t, o),
    deleteTexture: (t) => iRenderer.DeleteTexture(t),
  };
}
