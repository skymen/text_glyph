# Text Glyph backlog

- Icons: `[icon=...]` from a Sprite icon set. Plan: a span holding one space with `wordSpacing` set to the icon width reserves the slot, then draw the frame at that glyph's position. Needs the Sprite frame texture API (IAnimationFrame extends IImageInfo, so getTexture/getTexRect exist).
- Inline objects: glyph's Rust engine already lays out inline objects (`EngineInlineObjectRecord`), only the public `GlyphTextState` lacks the field. A small TS patch upstream (configured-handle.ts `#bindState`, `maxInlineObjects` in engine-encoding.ts) would replace the space/wordSpacing trick.
- WOFF/WOFF2 fonts: glyph's baker rejects them (sfnt.rs). WOFF is per-table zlib, decodable in JS; WOFF2 needs a brotli decoder. Only .ttf/.otf work today.
- Variable fonts: rejected by glyph's baker (`UnsupportedVariableFont`). Users must ship static instances.
- Bake in a worker: fonts are baked on the main thread behind the load promise. A font first used mid-game hitches for the bake time (about 25 ms for Arial). Move to a Worker once the wasm URL plumbing is sorted.
- Atlas eviction: after 8 pages the whole atlas resets. Fine for now, an LRU per page would avoid re-rasterizing everything on big CJK texts.
- Height clipping: the built-in Text stops drawing lines below the box. We draw everything (overflow visible).
- Outline is always drawn behind the fill. The built-in's `[outline]` draws on top and `[outlineback]` behind.
- Editor preview uses Construct's text renderer, so it ignores BBCode styling and uses the base font only.
- glyph 0.1.0 internals imported by path in `src/runtime/glyphEngine.js` (loader.js, font-baker/index.js, internal/font-bake-pipeline.js, internal/raster-bake-plan.js). Pin the version; re-check these paths on every glyph upgrade.
- Check in Construct: `drawMesh` vertex color multiplication with layer/effects, `layerToDrawSurface` returning device pixels, project font file names in `projectFileList` (folder prefixes), `getCurrentZ` for Z elevation.
- Animate Text still round-trips through a BBCode string every tick: it serializes per-letter values, then `parseBBCode` re-parses them. A direct fragment API (Animate Text hands over `[text, tags]` groups, Text Glyph builds fragments without parseFloat or substring) would remove both the string build and the parse, the two biggest per-tick costs left.
- `fragIndexFor` is a binary search per glyph on every reparse. A forward scan with a cached index would do for LTR text.
