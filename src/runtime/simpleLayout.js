// JavaScript layout used where wasm cannot run (the Construct editor). Same
// output shape as glyph's inspect(), built from opentype.js advances and
// pair kerning. No complex shaping, no bidi mixing: a right to left
// paragraph is drawn reversed, like the built-in Text object does.

const NOTDEF = 0;

function isSpace(ch) {
  return ch === " " || ch === "\t" || ch === " " || ch === "　";
}

function lineMetrics(items, lineHeightMul) {
  let ascent = 0, descent = 0, lineHeight = 0;
  for (const it of items) {
    const m = it.face.metrics;
    const natural = (m.ascender - m.descender + m.lineGap) / m.unitsPerEm;
    const lh = it.size * lineHeightMul;
    const extra = (lh - natural * it.size) / 2;
    ascent = Math.max(ascent, (it.size * (m.ascender + m.lineGap / 2)) / m.unitsPerEm + extra);
    descent = Math.max(descent, (it.size * (-m.descender + m.lineGap / 2)) / m.unitsPerEm + extra);
    lineHeight = Math.max(lineHeight, lh);
  }
  return { ascent, descent, lineHeight: Math.max(lineHeight, ascent + descent) };
}

// Advance of the first `count` items, including each item's own spacing.
function lineAdvance(items, count) {
  let advance = 0;
  for (let k = 0; k < count; k++) advance += items[k].adv + items[k].extra + (k > 0 ? items[k].kern : 0);
  return advance;
}

function ellipsisItems(ref) {
  const otf = ref.face.otf;
  const scale = ref.size / otf.unitsPerEm;
  const mk = (gid) => ({ off: 0, len: 0, gid, face: ref.face, size: ref.size, adv: (otf.glyphs.get(gid).advanceWidth || 0) * scale, extra: 0, kern: 0, space: false, nl: false, cr: false, inline: null });
  const gid = otf.charToGlyphIndex("…");
  if (gid) return [mk(gid)];
  const dot = otf.charToGlyphIndex(".");
  return [mk(dot), mk(dot), mk(dot)];
}

// Cuts a line's items so an ellipsis fits inside `width`.
function truncate(its, width, plainLength) {
  const ref = its[its.length - 1];
  const ell = ellipsisItems(ref);
  const ellAdv = ell.reduce((a, it) => a + it.adv, 0);
  let count = its.length;
  while (count > 0 && (lineAdvance(its, count) + ellAdv > width || its[count - 1].space)) count--;
  const cutOff = count < its.length ? its[count].off : ref.off + ref.len;
  for (const it of ell) it.off = Math.min(cutOff, plainLength);
  return its.slice(0, count).concat(ell);
}

// plain: text. frags: [{ start, end, face, sizePx, letterSpacing,
//   wordSpacing, inlineWidth }] covering it in order (inlineWidth >= 0 marks a
//   placeholder for an icon or a blank).
// opts: { width, height, wrap (0 word, 1 character, 2 none), overflow
//   ("visible" | "ellipsis"), lineHeight (multiple of the font size),
//   justify (0, 1, 2), justifyMin, justifyMax, justifyLetter, maxLines,
//   columns, columnGap, paragraphRtl(offset) -> bool }
export function simpleLayout(plain, frags, opts) {
  const items = [];
  let fi = 0;
  let prevGlyph = null, prevFace = null;
  for (let off = 0; off < plain.length; ) {
    const cp = plain.codePointAt(off);
    const ch = String.fromCodePoint(cp);
    while (fi < frags.length - 1 && off >= frags[fi].end) fi++;
    const frag = frags[fi];
    const face = frag.face, size = frag.sizePx;
    const otf = face.otf;
    const scale = size / otf.unitsPerEm;
    let adv = 0, gid = NOTDEF, kern = 0, extra = 0;
    const nl = ch === "\n";
    const space = isSpace(ch);
    const inline = frag.inlineWidth >= 0 ? frag : null;
    if (inline) {
      adv = frag.inlineWidth;
      prevGlyph = null;
    } else if (!nl && ch !== "\r") {
      gid = otf.charToGlyphIndex(ch) || NOTDEF;
      const g = otf.glyphs.get(gid);
      adv = (g.advanceWidth || 0) * scale;
      if (prevGlyph && prevFace === face) kern = otf.getKerningValue(prevGlyph, g) * scale;
      extra = frag.letterSpacing + (space ? frag.wordSpacing : 0);
      prevGlyph = g;
      prevFace = face;
    } else {
      prevGlyph = null;
    }
    items.push({ off, len: ch.length, gid, face, size, adv, extra, kern, space, nl, cr: ch === "\r", inline });
    off += ch.length;
  }

  const columns = Math.max(1, opts.columns | 0);
  const gap = columns > 1 ? opts.columnGap : 0;
  const w = columns > 1 ? Math.max(1, (opts.width - gap * (columns - 1)) / columns) : opts.width;

  // Line breaking. A line is [start, end) over items; `hard` marks lines
  // ended by a newline or the end of the text.
  const lines = [];
  let start = 0;
  while (start < items.length) {
    let i = start, width = 0, lastBreak = -1, hard = false;
    while (i < items.length) {
      const it = items[i];
      if (it.nl) {
        hard = true;
        i++;
        break;
      }
      if (it.cr) {
        i++;
        continue;
      }
      const add = it.adv + it.extra + (i > start ? it.kern : 0);
      if (opts.wrap !== 2 && width + add > w && i > start && !it.space) {
        if (opts.wrap === 0 && lastBreak > start) i = lastBreak;
        break;
      }
      width += add;
      i++;
      if (opts.wrap === 0 && it.space && i < items.length && !items[i].space) lastBreak = i;
    }
    if (i === items.length) hard = true;
    lines.push({ start, end: i, hard, items: null, metrics: null, col: 0, top: 0 });
    start = i;
  }
  if (!lines.length) lines.push({ start: 0, end: 0, hard: true, items: null, metrics: null, col: 0, top: 0 });
  for (const L of lines) {
    L.items = [];
    for (let k = L.start; k < L.end; k++) if (!items[k].nl && !items[k].cr) L.items.push(items[k]);
    const metricItems = L.items.length ? L.items : [items[Math.min(L.start, items.length - 1)] || { face: frags[0].face, size: frags[0].sizePx }];
    L.metrics = lineMetrics(metricItems, opts.lineHeight);
  }

  let cut = false;
  if (opts.maxLines > 0 && lines.length > opts.maxLines) {
    lines.length = opts.maxLines;
    cut = true;
  }

  // Column placement. Lines that do not fit the last column overflow below it.
  let col = 0, y = 0;
  for (const L of lines) {
    const lh = L.metrics.lineHeight;
    if (columns > 1 && y + lh > opts.height + 0.01 && col < columns - 1 && y > 0) {
      col++;
      y = 0;
    }
    L.col = col;
    L.top = y;
    y += lh;
  }

  const ellipsis = opts.overflow === "ellipsis";
  if (ellipsis) {
    let keep = lines.length;
    while (keep > 0) {
      const L = lines[keep - 1];
      if (L.col < columns - 1 || L.top + L.metrics.lineHeight <= opts.height + 0.01) break;
      keep--;
    }
    if (keep < lines.length) {
      lines.length = keep;
      cut = true;
    }
    for (let l = 0; l < lines.length; l++) {
      const L = lines[l];
      const last = l === lines.length - 1;
      if (!L.items.length) continue;
      if (lineAdvance(L.items, L.items.length) > w + 0.01 || (last && cut)) {
        L.items = truncate(L.items, w, plain.length);
        L.ellipsis = true;
      }
    }
  }

  let n = 0;
  for (const L of lines) n += L.items.length;
  const glyphIds = new Uint32Array(n), clusters = new Uint32Array(n);
  const sizes = new Float32Array(n), xs = new Float32Array(n), ys = new Float32Array(n), advs = new Float32Array(n);
  const lineStarts = new Uint32Array(lines.length), lineCounts = new Uint32Array(lines.length);
  const lineAdvs = new Float32Array(lines.length), lineTextStarts = new Uint32Array(lines.length), lineTextEnds = new Uint32Array(lines.length);
  const lineAvail = new Float32Array(lines.length), lineBaselines = new Float32Array(lines.length);
  const outLines = [];
  let gi = 0, contentWidth = 0, contentHeight = 0;
  for (let l = 0; l < lines.length; l++) {
    const L = lines[l];
    const glyphStart = gi;
    const lineItems = L.items;
    const { ascent, descent, lineHeight } = L.metrics;
    let trailing = lineItems.length;
    while (trailing > 0 && lineItems[trailing - 1].space) trailing--;
    let advance = lineAdvance(lineItems, trailing);
    const justify = !L.ellipsis && (opts.justify === 2 || (opts.justify === 1 && !L.hard));
    let spaceExtra = 0, letterExtra = 0;
    if (justify && advance < w) {
      let spaces = 0;
      for (let k = 0; k < trailing; k++) if (lineItems[k].space) spaces++;
      let missing = w - advance;
      if (spaces) {
        const spaceAdv = lineItems.find((it) => it.space).adv;
        spaceExtra = opts.justifyMax > 0 ? Math.min(missing / spaces, spaceAdv * (Math.max(1, opts.justifyMax) - 1)) : missing / spaces;
        missing -= spaceExtra * spaces;
      }
      if (missing > 0.01 && trailing > 1 && opts.justifyLetter > 0) {
        letterExtra = Math.min(missing / (trailing - 1), opts.justifyLetter);
        missing -= letterExtra * (trailing - 1);
      }
      advance = w - Math.max(0, missing);
    }
    const rtl = lineItems.length ? opts.paragraphRtl(lineItems[0].off) : false;
    const colX = L.col * (w + gap);
    const baseline = L.top + ascent;
    let x = rtl ? colX + w : colX;
    for (let k = 0; k < lineItems.length; k++) {
      const it = lineItems[k];
      let adv = it.adv + it.extra;
      if (k < trailing) {
        if (it.space) adv += spaceExtra;
        if (k < trailing - 1) adv += letterExtra;
      }
      const kern = k > 0 ? it.kern : 0;
      if (rtl) {
        x -= adv + kern;
        xs[gi] = x;
      } else {
        x += kern;
        xs[gi] = x;
        x += adv;
      }
      ys[gi] = baseline;
      glyphIds[gi] = it.gid;
      clusters[gi] = it.off;
      sizes[gi] = it.size;
      advs[gi] = it.adv;
      gi++;
    }
    lineStarts[l] = glyphStart;
    lineCounts[l] = gi - glyphStart;
    lineAdvs[l] = advance;
    lineAvail[l] = w;
    lineBaselines[l] = baseline;
    lineTextStarts[l] = L.start < items.length ? items[L.start].off : plain.length;
    lineTextEnds[l] = L.end > 0 && L.end - 1 < items.length ? items[L.end - 1].off + items[L.end - 1].len : plain.length;
    outLines.push({ index: l, textStart: lineTextStarts[l], textEnd: lineTextEnds[l], glyphStart, glyphCount: gi - glyphStart, baseline, advance, ascent, descent, lineHeight });
    contentWidth = Math.max(contentWidth, colX + advance);
    contentHeight = Math.max(contentHeight, L.top + lineHeight);
  }
  return {
    width: opts.width,
    height: contentHeight,
    contentWidth,
    contentHeight,
    glyphCount: gi,
    lineCount: lines.length,
    lines: outLines,
    glyphIds,
    clusters,
    glyphFontSizes: sizes,
    x: xs,
    y: ys,
    glyphAdvances: advs,
    lineGlyphStarts: lineStarts,
    lineGlyphCounts: lineCounts,
    lineAdvances: lineAdvs,
    lineAvail,
    lineBaselines,
    lineTextStarts,
    lineTextEnds,
  };
}
