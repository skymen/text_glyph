// Entry for scripts/bundle-glyph.mjs. Everything the addon uses from
// @pmndrs/glyph and opentype.js, re-exported so it can be bundled into one
// static module (src/vendor/glyph.js). CAW's Vite build turns dynamic imports
// into separate chunks that never make it into the .c3addon, and glyph has
// several, so the bundle is made here with dynamic imports inlined.
//
// The dist paths below are not on glyph's public export map (0.1.0). They are
// needed to bake fonts on the main thread with wasm bytes we load ourselves.
export { glyph, bitmap } from "@pmndrs/glyph";
export {
  defineGlyphConfig,
  defineGlyphSchema,
  resourceLease,
  createRasterCodecProgram,
  bitmapCodec,
  defineCodecBuffers,
  id,
} from "@pmndrs/glyph/core";
export { createBitmapBaker, bitmapBakerFromCore } from "@pmndrs/glyph/bakers/bitmap";
export { createFontLibrary } from "../node_modules/@pmndrs/glyph/dist/loader.js";
export { createFontBaker } from "../node_modules/@pmndrs/glyph/dist/font-baker/index.js";
export { bakeFontPipeline } from "../node_modules/@pmndrs/glyph/dist/internal/font-bake-pipeline.js";
export { createResolvedRasterBakePlan } from "../node_modules/@pmndrs/glyph/dist/internal/raster-bake-plan.js";
export { parse as parseOpenType } from "opentype.js";
