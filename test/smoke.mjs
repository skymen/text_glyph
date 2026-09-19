import { readFile } from "node:fs/promises";
import {
  glyph, bitmap, defineGlyphConfig, defineGlyphSchema, resourceLease,
  createRasterCodecProgram, bitmapCodec, defineCodecBuffers, id,
  createBitmapBaker, bitmapBakerFromCore, createFontLibrary, createFontBaker,
  bakeFontPipeline, createResolvedRasterBakePlan, parseOpenType,
} from "../src/vendor/glyph.js";

const dist = new URL("../node_modules/@pmndrs/glyph/dist/", import.meta.url);
const t0 = performance.now();
const [shaperWasm, fontBakerWasm, bitmapBakerWasm] = await Promise.all(
  ["text-shaper.wasm", "font-baker.wasm", "bitmap-baker.wasm"].map((f) => readFile(new URL(f, dist)))
);
await glyph.init({ wasm: shaperWasm });
const fontBaker = await createFontBaker(fontBakerWasm);
const bitmapModule = bitmapBakerFromCore(await createBitmapBaker(bitmapBakerWasm));
console.log("init ms", (performance.now() - t0).toFixed(1));

async function runtimeBake(request) {
  const plans = (request.rasters ?? []).map((r) => {
    if (r.kind !== "bitmap") throw new Error("unexpected raster kind " + r.kind);
    return createResolvedRasterBakePlan(bitmapModule, { artifact: "embedded" }, r.descriptor, r.rasterKey);
  });
  const t = performance.now();
  const result = await bakeFontPipeline({
    fontBaker, source: request.source, fontFaceIndex: 0, rasters: plans,
    ...(request.unicodeRanges === undefined ? {} : { unicodeRanges: request.unicodeRanges }),
  });
  console.log("bake ms", (performance.now() - t).toFixed(1), "artifact bytes", result.composed.artifacts[0].bytes.byteLength, "timings", result.timings);
  return result.composed.artifacts[0].bytes;
}

const library = createFontLibrary({ runtimeBake });
const ttf = new Uint8Array(await readFile(process.argv[2] ?? "/System/Library/Fonts/Supplemental/Arial.ttf"));
const font = await library.loadFont(
  { source: { bytes: ttf }, runtimeBake },
  bitmap({ strikes: [8], coverage: { text: " " } })
);
console.log("font metrics", font.metrics, "glyphs", font.glyphCount);

const schema = defineGlyphSchema({
  program: (_b, p) => p, buffer: (_b, i) => i, material: (_b, m) => m, transform: (_b, t) => t,
  batch: (_b, i) => i, instance: (_b, i) => i, instanceSpan: (_b, i) => i,
});
const SYS = defineCodecBuffers({
  stableGlyphId: { id: id.buffer("c3-text-glyph/stable-glyph"), scalar: "u32", lanes: ["stableGlyphId"] },
  placementSlot: { id: id.buffer("c3-text-glyph/placement-slot"), scalar: "u32", lanes: ["placementSlot"] },
});
const CAPS = Object.freeze({
  capabilities: Object.freeze(["storage-buffers", "alias-vec2", "alias-vec4", "ordered-direct"]),
  maxBufferBytes: 16 * 1024 * 1024, updateAlignment: 4, coalesceGapBytes: 128, rangeCallPenaltyBytes: 256,
  maxBuffersPerDraw: 8, maxResourcesPerDraw: 4, maxIndirectDraws: 0, fragmentationBudget: 8,
  wholeBufferThresholdBasisPoints: 7500,
});
const config = defineGlyphConfig({
  schema,
  encode: ({ ids }) => ({
    descriptor: {
      capabilitySets: [CAPS],
      programs: [createRasterCodecProgram(bitmapCodec, { namespace: "c3-text-glyph", system: SYS, capabilitySet: CAPS, transformMode: "direct", ids })],
    },
  }),
  resolve: ({ resourceName, payload }) => resourceLease({ name: resourceName, resource: payload }, () => {}),
  renderer: () => ({
    decode: () => ({ result: undefined, commit() {}, discard() {} }),
    syncTransforms() {}, dispose() {},
  }),
  root: { create: (ctx) => ctx.create({ services: ctx.services }, { boundary: {} }) },
});
const handle = glyph.handle("c3", config);
const transform = {};
const text = "Hello Wörld, this is a longer line that should wrap. مرحبا بالعالم";
const ctrl = handle.services.createText({
  font, text, transform,
  style: { fontSize: 32, color: "#ffffff" },
  layout: { wrap: "word", align: "start" },
  constraints: { width: { mode: "at-most", size: 300 } },
});
let t1 = performance.now();
const m = ctrl.measure();
console.log("measure ms", (performance.now() - t1).toFixed(2), { width: m.width, height: m.height, lines: m.lineCount, glyphs: m.glyphCount, ascent: m.ascent, descent: m.descent, lineHeight: m.lineHeight });
t1 = performance.now();
const g = ctrl.inspect();
console.log("inspect ms", (performance.now() - t1).toFixed(2));
for (let i = 0; i < Math.min(8, g.glyphCount); i++)
  console.log(i, "gid", g.glyphIds[i], "cluster", g.clusters[i], "x", g.x[i].toFixed(1), "y", g.y[i].toFixed(1), "adv", g.glyphAdvances[i].toFixed(1), "bidi", g.glyphBidiLevels[i], "ink", g.glyphInkX[i].toFixed(1), g.glyphInkY[i].toFixed(1), g.glyphInkWidths[i].toFixed(1), g.glyphInkHeights[i].toFixed(1));
console.log("lines", Array.from(g.lineBaselines).map((b, i) => ({ baseline: b.toFixed(1), adv: g.lineAdvances[i].toFixed(1), glyphs: g.lineGlyphCounts[i] })));
// update text, re-inspect
ctrl.update({ font, text: "Short", transform, style: { fontSize: 32 }, layout: { wrap: "word" }, constraints: { width: { mode: "at-most", size: 300 } } });
t1 = performance.now();
const g2 = ctrl.inspect();
console.log("update+inspect ms", (performance.now() - t1).toFixed(2), "glyphs", g2.glyphCount, "width", g2.width);
// spans: a colour-only span must not change positions, a size span must
const plainCtrl = handle.services.createText({ font, text: "AVAWA Town", transform, style: { fontSize: 32 }, layout: { wrap: "word" } });
const spanCtrl = handle.services.createText({ font, text: { text: "AVAWA Town", spans: [{ start: 0, end: 2 }, { start: 2, end: 10 }] }, transform, style: { fontSize: 32 }, layout: { wrap: "word" } });
const a = plainCtrl.inspect(), b = spanCtrl.inspect();
let maxDiff = 0; for (let i = 0; i < a.glyphCount; i++) maxDiff = Math.max(maxDiff, Math.abs(a.x[i] - b.x[i]));
console.log("kerning across a style span boundary: max x diff", maxDiff.toFixed(4), maxDiff < 1e-3 ? "OK" : "BROKEN");
const sizeCtrl = handle.services.createText({ font, text: { text: "AVAWA Town", spans: [{ start: 0, end: 2, style: { fontSize: 64 } }, { start: 2, end: 10 }] }, transform, style: { fontSize: 32 }, layout: { wrap: "word" } });
const c = sizeCtrl.inspect();
console.log("size span: glyph sizes", Array.from(c.glyphFontSizes).slice(0, 4), "line ascent", c.lines[0].ascent.toFixed(1));
const otf = parseOpenType(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
console.log("opentype glyph for gid", a.glyphIds[0], otf.glyphs.get(a.glyphIds[0]).name, "path cmds", otf.glyphs.get(a.glyphIds[0]).getPath(0, 0, 32).commands.length);
const rtl = handle.services.createText({ font, text: "abc مرحبا def", transform, style: { fontSize: 32, direction: "rtl" }, layout: { wrap: "word", align: "start" }, constraints: { width: { mode: "exact", size: 400 } } });
const r = rtl.inspect();
console.log("rtl paragraph first glyph x", r.x[0].toFixed(1), "last glyph x", r.x[r.glyphCount - 1].toFixed(1), "line advance", r.lineAdvances[0].toFixed(1), "bidi levels", Array.from(r.glyphBidiLevels).join(""));
