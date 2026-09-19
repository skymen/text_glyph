import { parseCssColor } from "./color.js";

// Same tag grammar as Construct's Text object: [tag], [tag=param], [/tag],
// "\[" escapes a bracket. Unknown tags are kept as style entries so [tag=x]
// style metadata still reaches the renderer.
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

export function stripTags(text) {
  let out = "";
  let last = 0;
  let m;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(text)) !== null) {
    if (m.index > 0 && text.charAt(m.index - 1) === "\\") continue;
    out += text.substring(last, m.index);
    last = m.index + m[0].length;
  }
  out += text.substring(last);
  return unescape(out);
}

function unescape(s) {
  return s.replace(/\\\[/g, "[").replace(/\\\\/g, "\\");
}

function num(p, fallback) {
  const v = parseFloat(p);
  return isFinite(v) ? v : fallback;
}

// Offsets accept "10" (px) or "50%" (of the fragment's font size).
function offset(p) {
  if (typeof p !== "string") return { value: 0, percent: false };
  const t = p.trim();
  const v = parseFloat(t);
  if (!isFinite(v)) return { value: 0, percent: false };
  return { value: v, percent: t.endsWith("%") };
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
    offsetX: { value: 0, percent: false },
    offsetY: { value: 0, percent: false },
    hide: false,
    background: null,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    tag: "",
  };
}

function applyTag(st, tag, param) {
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
      st.sizePt = Math.max(0.1, num(param, 0)) || 0;
      break;
    case "font":
      st.font = param ? param.trim() : "";
      break;
    case "color":
      st.color = parseCssColor(param) || st.color;
      break;
    case "opacity":
      st.opacity = Math.max(0, Math.min(1, num(param, 100) / 100));
      break;
    case "outline":
      st.outline = parseCssColor(param) || st.outline;
      st.outlineBack = false;
      break;
    case "outlineback":
      st.outline = parseCssColor(param) || st.outline;
      st.outlineBack = true;
      break;
    case "stroke":
      st.stroke = true;
      break;
    case "linethickness":
      st.lineThickness = Math.max(0, num(param, 1));
      break;
    case "offsetx":
      st.offsetX = offset(param);
      break;
    case "offsety":
      st.offsetY = offset(param);
      break;
    case "hide":
      st.hide = true;
      break;
    case "background":
      st.background = parseCssColor(param) || st.background;
      break;
    case "angle":
      st.angle = num(param, 0);
      break;
    case "scale":
      st.scaleX = st.scaleY = num(param, 1);
      break;
    case "scalex":
      st.scaleX = num(param, 1);
      break;
    case "scaley":
      st.scaleY = num(param, 1);
      break;
    case "tag":
      st.tag = param ? param.trim() : "";
      break;
  }
}

// Returns { plain, frags: [{ start, end, style }] } with UTF-16 offsets into plain.
export function parseBBCode(src, enabled) {
  if (!enabled || !src.includes("[")) {
    const plain = enabled ? unescape(src) : src;
    return { plain, frags: plain.length ? [{ start: 0, end: plain.length, style: makeStyle() }] : [] };
  }
  const frags = [];
  const stack = [];
  let plain = "";
  let last = 0;
  let m;
  const push = (text) => {
    if (!text) return;
    text = unescape(text);
    const st = makeStyle();
    for (const s of stack) applyTag(st, s.tag, s.param);
    frags.push({ start: plain.length, end: plain.length + text.length, style: st });
    plain += text;
  };
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(src)) !== null) {
    const at = m.index;
    if (at > 0 && src.charAt(at - 1) === "\\") continue;
    push(src.substring(last, at));
    last = at + m[0].length;
    const body = m[2];
    if (!body) continue;
    if (m[1] === "/") {
      const tag = body.toLowerCase();
      for (let k = stack.length - 1; k >= 0; --k) {
        if (stack[k].tag === tag) {
          stack.splice(k, 1);
          break;
        }
      }
    } else {
      const eq = body.indexOf("=");
      const tag = (eq === -1 ? body : body.substring(0, eq)).toLowerCase();
      const param = eq === -1 ? null : body.substring(eq + 1);
      stack.push({ tag, param });
    }
  }
  push(src.substring(last));
  return { plain, frags };
}
