const NAMED = {
  black: [0, 0, 0],
  white: [1, 1, 1],
  red: [1, 0, 0],
  green: [0, 128 / 255, 0],
  lime: [0, 1, 0],
  blue: [0, 0, 1],
  yellow: [1, 1, 0],
  cyan: [0, 1, 1],
  aqua: [0, 1, 1],
  magenta: [1, 0, 1],
  fuchsia: [1, 0, 1],
  orange: [1, 165 / 255, 0],
  purple: [128 / 255, 0, 128 / 255],
  pink: [1, 192 / 255, 203 / 255],
  gray: [128 / 255, 128 / 255, 128 / 255],
  grey: [128 / 255, 128 / 255, 128 / 255],
  silver: [192 / 255, 192 / 255, 192 / 255],
  brown: [165 / 255, 42 / 255, 42 / 255],
  gold: [1, 215 / 255, 0],
  navy: [0, 0, 128 / 255],
  teal: [0, 128 / 255, 128 / 255],
  olive: [128 / 255, 128 / 255, 0],
  maroon: [128 / 255, 0, 0],
  transparent: [0, 0, 0, 0],
};

const cache = new Map();

function hexDigit(c) {
  if (c >= 48 && c <= 57) return c - 48;
  if (c >= 97 && c <= 102) return c - 87;
  if (c >= 65 && c <= 70) return c - 55;
  return -1;
}

// #rgb, #rgba, #rrggbb, #rrggbbaa without regex or intermediate strings.
function parseHex(str) {
  const len = str.length;
  if (len !== 4 && len !== 5 && len !== 7 && len !== 9) return null;
  const short = len <= 5;
  const step = short ? 1 : 2;
  const out = [0, 0, 0, 1];
  let pos = 1;
  for (let k = 0; pos < len; k++) {
    let v = hexDigit(str.charCodeAt(pos));
    if (v < 0) return null;
    if (short) v = v * 17;
    else {
      const lo = hexDigit(str.charCodeAt(pos + 1));
      if (lo < 0) return null;
      v = v * 16 + lo;
    }
    out[k] = v / 255;
    pos += step;
  }
  return out;
}

// Returns [r, g, b, a] in 0..1, or null when the string is not a color.
export function parseCssColor(str) {
  if (typeof str !== "string") return null;
  if (str.charCodeAt(0) === 35) {
    const hex = parseHex(str);
    if (hex) return hex;
  }
  const key = str.trim().toLowerCase();
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  let out = null;
  const named = NAMED[key];
  if (named) out = named.length === 4 ? named : [named[0], named[1], named[2], 1];
  else if (key[0] === "#") out = parseHex(key);
  else {
    const m = key.match(
      /^rgba?\(\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*(?:[,/]\s*([\d.]+)(%?)\s*)?\)$/
    );
    if (m) {
      const pct = key.includes("%");
      const s = pct ? 100 : 255;
      let a = m[4] === undefined ? 1 : parseFloat(m[4]);
      if (m[5] === "%") a /= 100;
      out = [
        Math.min(1, parseFloat(m[1]) / s),
        Math.min(1, parseFloat(m[2]) / s),
        Math.min(1, parseFloat(m[3]) / s),
        Math.max(0, Math.min(1, a)),
      ];
    }
  }
  // Animated colors produce a new string every tick, so the cache is capped.
  if (cache.size > 512) cache.clear();
  cache.set(key, out);
  return out;
}

// Construct packs rgb() / rgba() expression results into one number. This is
// the same decoding the engine uses (C3.GetRValue and friends).
export function rgbValueToColor(v) {
  if (typeof v !== "number" || !isFinite(v)) return [0, 0, 0];
  if (v >= 0) return [(v & 255) / 255, ((v & 65280) >> 8) / 255, ((v & 16711680) >> 16) / 255];
  let r = Math.floor(-v / 274877906944);
  if (r > 8191) r -= 16384;
  let g = Math.floor((-v % 274877906944) / 16777216);
  if (g > 8191) g -= 16384;
  let b = Math.floor((-v % 16777216) / 1024);
  if (b > 8191) b -= 16384;
  return [r / 1024, g / 1024, b / 1024];
}
