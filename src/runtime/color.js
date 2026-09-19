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

// Returns [r, g, b, a] in 0..1, or null when the string is not a color.
export function parseCssColor(str) {
  if (typeof str !== "string") return null;
  const key = str.trim().toLowerCase();
  if (cache.has(key)) return cache.get(key);
  let out = null;
  const named = NAMED[key];
  if (named) out = named.length === 4 ? named : [named[0], named[1], named[2], 1];
  else if (key[0] === "#") {
    const h = key.slice(1);
    if (/^[0-9a-f]{3,4}$/.test(h)) {
      const v = h.split("").map((c) => parseInt(c + c, 16) / 255);
      out = [v[0], v[1], v[2], v.length === 4 ? v[3] : 1];
    } else if (/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(h)) {
      const n = parseInt(h.slice(0, 6), 16);
      out = [
        ((n >> 16) & 255) / 255,
        ((n >> 8) & 255) / 255,
        (n & 255) / 255,
        h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1,
      ];
    }
  } else {
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
