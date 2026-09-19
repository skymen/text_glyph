import { parseCssColor } from "./color.js";

// Same tag grammar as Construct's Text object: [tag], [tag=param], [/tag],
// "\[" escapes a bracket. Unknown tags are kept as style entries so [tag=x]
// style metadata still reaches the renderer.
// The parser is hand written and allocation light because Animate Text feeds
// a new string with one tag group per letter on every tick.
const TAG_RE = /\[(\/?)([^\[\n]*?)\]/g;

const segmenter =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

// UTF-16 offsets of every grapheme cluster end, in order.
export function graphemeEnds(text) {
  const ends = [];
  if (segmenter) {
    for (const s of segmenter.segment(text)) ends.push(s.index + s.segment.length);
  } else {
    for (const ch of text) ends.push((ends.length ? ends[ends.length - 1] : 0) + ch.length);
  }
  return ends;
}

// Self closing tags stand for an inline object and occupy one space in the
// plain text.
const INLINE_TAGS = new Set(["icon", "space"]);
export const INLINE_CHAR = " ";

export function stripTags(text) {
  let out = "";
  let last = 0;
  let m;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(text)) !== null) {
    if (m.index > 0 && text.charAt(m.index - 1) === "\\") continue;
    out += text.substring(last, m.index);
    if (m[1] !== "/") {
      const body = m[2];
      const eq = body.indexOf("=");
      if (INLINE_TAGS.has((eq === -1 ? body : body.substring(0, eq)).toLowerCase())) out += INLINE_CHAR;
    }
    last = m.index + m[0].length;
  }
  out += text.substring(last);
  return unescape(out);
}

function unescape(s) {
  if (s.indexOf("\\") === -1) return s;
  return s.replace(/\\\[/g, "[").replace(/\\\\/g, "\\");
}

function num(p, fallback) {
  const v = parseFloat(p);
  return isFinite(v) ? v : fallback;
}

const ZERO_OFFSET = Object.freeze({ value: 0, percent: false });

// Offsets accept "10" (px) or "50%" (of the fragment's font size).
function offset(p) {
  if (p === null) return ZERO_OFFSET;
  const v = parseFloat(p);
  if (!isFinite(v)) return ZERO_OFFSET;
  let e = p.length - 1;
  while (e > 0 && p.charCodeAt(e) <= 32) e--;
  return { value: v, percent: p.charCodeAt(e) === 37 };
}

export function makeStyle() {
  return {
    bold: false,
    italic: false,
    sizePt: 0, // 0 means inherit
    font: "", // "" means inherit
    color: null, // [r,g,b,a] or null
    opacity: 1,
    outline: null,
    outlineBack: false,
    stroke: false,
    lineThickness: 1,
    underline: false,
    strike: false,
    offsetX: ZERO_OFFSET,
    offsetY: ZERO_OFFSET,
    hide: false,
    background: null,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    tag: "",
    overline: false,
    decorationColor: null, // [r,g,b,a] or null for the text color
    decorationThickness: 0, // 0 follows lineThickness
    decorationOffset: ZERO_OFFSET,
    decorationStyle: 0, // index into DECORATION_STYLES
    shadow: null, // { color, dx, dy } or null
    letterSpacing: 0,
    wordSpacing: 0,
    inline: null, // { kind: "icon", name, frame, scale } or { kind: "space", width }
  };
}

export const DECORATION_STYLES = ["solid", "double", "dotted", "dashed", "wavy"];

// "[shadow=#000 2 2]" or "[shadow=#000,2,2]". Offsets accept px or %.
function shadow(p) {
  if (p === null) return null;
  const parts = p.trim().split(/[\s,]+/);
  const color = parseCssColor(parts[0]);
  if (!color) return null;
  return { color, dx: offset(parts[1] ?? "1"), dy: offset(parts[2] ?? parts[1] ?? "1") };
}

// "[icon=name]", "[icon=name,scale]", "[icon=name,scale,frame]".
function icon(p) {
  const parts = (p || "").split(",").map((x) => x.trim());
  return { kind: "icon", name: parts[0] || "", scale: num(parts[1], 1) || 1, frame: Math.max(0, num(parts[2], 0) | 0) };
}

// Parameters are resolved when the tag is pushed, so a fragment under an open
// tag only assigns the resolved value.
function resolveParam(tag, param) {
  switch (tag) {
    case "size":
      return Math.max(0.1, num(param, 0)) || 0;
    case "font":
    case "tag":
      return param ? param.trim() : "";
    case "color":
    case "outline":
    case "outlineback":
    case "background":
      return parseCssColor(param);
    case "opacity":
      return Math.max(0, Math.min(1, num(param, 100) / 100));
    case "linethickness":
      return Math.max(0, num(param, 1));
    case "offsetx":
    case "offsety":
      return offset(param);
    case "angle":
      return num(param, 0);
    case "scale":
    case "scalex":
    case "scaley":
      return num(param, 1);
    case "decorationcolor":
      return parseCssColor(param);
    case "decorationthickness":
      return Math.max(0, num(param, 0));
    case "decorationoffset":
      return offset(param);
    case "decorationstyle": {
      const i = DECORATION_STYLES.indexOf((param || "").trim().toLowerCase());
      return i === -1 ? 0 : i;
    }
    case "shadow":
      return shadow(param);
    case "letterspacing":
    case "wordspacing":
      return num(param, 0);
    case "icon":
      return icon(param);
    case "space":
      return { kind: "space", width: offset(param) };
  }
  return param;
}

function applyTag(st, tag, v) {
  switch (tag) {
    case "b":
      st.bold = true;
      break;
    case "i":
      st.italic = true;
      break;
    case "u":
      st.underline = true;
      break;
    case "s":
      st.strike = true;
      break;
    case "size":
      st.sizePt = v;
      break;
    case "font":
      st.font = v;
      break;
    case "color":
      if (v) st.color = v;
      break;
    case "opacity":
      st.opacity = v;
      break;
    case "outline":
      if (v) st.outline = v;
      st.outlineBack = false;
      break;
    case "outlineback":
      if (v) st.outline = v;
      st.outlineBack = true;
      break;
    case "stroke":
      st.stroke = true;
      break;
    case "linethickness":
      st.lineThickness = v;
      break;
    case "offsetx":
      st.offsetX = v;
      break;
    case "offsety":
      st.offsetY = v;
      break;
    case "hide":
      st.hide = true;
      break;
    case "background":
      if (v) st.background = v;
      break;
    case "angle":
      st.angle = v;
      break;
    case "scale":
      st.scaleX = st.scaleY = v;
      break;
    case "scalex":
      st.scaleX = v;
      break;
    case "scaley":
      st.scaleY = v;
      break;
    case "tag":
      st.tag = v;
      break;
    case "o":
    case "overline":
      st.overline = true;
      break;
    case "decorationcolor":
      if (v) st.decorationColor = v;
      break;
    case "decorationthickness":
      st.decorationThickness = v;
      break;
    case "decorationoffset":
      st.decorationOffset = v;
      break;
    case "decorationstyle":
      st.decorationStyle = v;
      break;
    case "shadow":
      if (v) st.shadow = v;
      break;
    case "letterspacing":
      st.letterSpacing = v;
      break;
    case "wordspacing":
      st.wordSpacing = v;
      break;
    case "icon":
    case "space":
      st.inline = v;
      break;
  }
}

function plainResult(plain) {
  return {
    plain,
    frags: plain.length ? [{ start: 0, end: plain.length, style: makeStyle(), face: null }] : [],
  };
}

// Returns { plain, frags: [{ start, end, style, face }] } with UTF-16 offsets
// into plain. `face` is a slot the layout fills in.
export function parseBBCode(src, enabled) {
  if (!enabled) return plainResult(src);
  if (src.indexOf("[") === -1) return plainResult(unescape(src));
  const frags = [];
  const stackTags = [];
  const stackVals = [];
  const esc = src.indexOf("\\") !== -1;
  let plain = "";
  let last = 0;
  let i = 0;
  let nextNl = src.indexOf("\n");
  const n = src.length;
  for (;;) {
    const at = src.indexOf("[", i);
    if (at === -1) break;
    if (at > 0 && src.charCodeAt(at - 1) === 92) {
      i = at + 1;
      continue;
    }
    // A tag body cannot contain "[" or a newline.
    const close = src.indexOf("]", at + 1);
    if (close === -1) break;
    const inner = src.indexOf("[", at + 1);
    if (inner !== -1 && inner < close) {
      i = inner;
      continue;
    }
    if (nextNl !== -1 && nextNl < at) nextNl = src.indexOf("\n", at);
    if (nextNl !== -1 && nextNl < close) {
      i = at + 1;
      continue;
    }
    if (at > last) {
      let text = src.substring(last, at);
      if (esc) text = unescape(text);
      const st = makeStyle();
      for (let k = 0; k < stackTags.length; k++) applyTag(st, stackTags[k], stackVals[k]);
      frags.push({ start: plain.length, end: plain.length + text.length, style: st, face: null });
      plain += text;
    }
    last = close + 1;
    i = last;
    if (close === at + 1) continue;
    if (src.charCodeAt(at + 1) === 47) {
      const tag = src.substring(at + 2, close).toLowerCase();
      for (let k = stackTags.length - 1; k >= 0; --k) {
        if (stackTags[k] === tag) {
          stackTags.splice(k, 1);
          stackVals.splice(k, 1);
          break;
        }
      }
    } else {
      let eq = -1;
      for (let k = at + 1; k < close; k++) {
        if (src.charCodeAt(k) === 61) {
          eq = k;
          break;
        }
      }
      const tag = src.substring(at + 1, eq === -1 ? close : eq).toLowerCase();
      const param = eq === -1 ? null : src.substring(eq + 1, close);
      if (INLINE_TAGS.has(tag)) {
        const st = makeStyle();
        for (let k = 0; k < stackTags.length; k++) applyTag(st, stackTags[k], stackVals[k]);
        applyTag(st, tag, resolveParam(tag, param));
        frags.push({ start: plain.length, end: plain.length + 1, style: st, face: null });
        plain += INLINE_CHAR;
      } else {
        stackTags.push(tag);
        stackVals.push(resolveParam(tag, param));
      }
    }
  }
  if (last < n) {
    let text = src.substring(last);
    if (esc) text = unescape(text);
    const st = makeStyle();
    for (let k = 0; k < stackTags.length; k++) applyTag(st, stackTags[k], stackVals[k]);
    frags.push({ start: plain.length, end: plain.length + text.length, style: st, face: null });
    plain += text;
  }
  return { plain, frags };
}
