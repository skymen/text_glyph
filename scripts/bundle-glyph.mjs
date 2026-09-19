// Bundles scripts/glyph-entry.js into src/vendor/glyph.js. Run through
// `npm run bundleGlyph`; `npm run build` and `npm run dev` run it first.
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

await build({
  entryPoints: [path.join(root, "scripts/glyph-entry.js")],
  outfile: path.join(root, "src/vendor/glyph.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  splitting: false,
  minify: false,
  legalComments: "none",
  // Only reached by glyph's node baker; never runs in the browser.
  external: ["node:fs/promises"],
  // glyph resolves its worker and wasm files relative to import.meta.url. We
  // never use those paths (wasm bytes are passed in), and Vite must not try to
  // turn them into assets.
  define: { "import.meta.url": "undefined" },
  logLevel: "warning",
});

console.log("bundled src/vendor/glyph.js");
