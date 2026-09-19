import { parseBBCode, stripTags, graphemeEnds } from "../src/runtime/bbcode.js";
import { parseCssColor, rgbValueToColor } from "../src/runtime/color.js";
import assert from "node:assert/strict";

let r = parseBBCode("Hello [b]bold[/b] and [color=#ff0000]red[/color]!", true);
assert.equal(r.plain, "Hello bold and red!");
assert.equal(r.frags.length, 5);
assert.equal(r.frags[1].style.bold, true);
assert.deepEqual(r.frags[3].style.color, [1, 0, 0, 1]);
assert.equal(r.frags[3].start, 15);
assert.equal(r.frags[3].end, 18);

r = parseBBCode("[size=20][font=Roboto]x[/font][/size] \\[not a tag]", true);
assert.equal(r.plain, "x [not a tag]");
assert.equal(r.frags[0].style.sizePt, 20);
assert.equal(r.frags[0].style.font, "Roboto");

r = parseBBCode("[offsety=50%][angle=15][tag=link]a[/tag]", true);
assert.deepEqual(r.frags[0].style.offsetY, { value: 50, percent: true });
assert.equal(r.frags[0].style.angle, 15);
assert.equal(r.frags[0].style.tag, "link");

r = parseBBCode("[scale=2]a[/scale][scalex=0.5][scaley=3]b[/scaley][/scalex]", true);
assert.deepEqual([r.frags[0].style.scaleX, r.frags[0].style.scaleY, r.frags[1].style.scaleX, r.frags[1].style.scaleY], [2, 2, 0.5, 3]);

r = parseBBCode("[b]raw[/b]", false);
assert.equal(r.plain, "[b]raw[/b]");
assert.equal(r.frags.length, 1);

assert.equal(stripTags("[b]a[/b][i]b[/i] \\[c]"), "ab [c]");
assert.deepEqual(graphemeEnds("ab\u{1F600}c"), [1, 2, 4, 5]);

assert.deepEqual(parseCssColor("#fff"), [1, 1, 1, 1]);
assert.deepEqual(parseCssColor("rgba(255, 0, 0, 0.5)"), [1, 0, 0, 0.5]);
assert.deepEqual(parseCssColor("orange"), [1, 165 / 255, 0, 1]);
assert.equal(parseCssColor("nope"), null);
assert.deepEqual(rgbValueToColor(255 | (128 << 8) | (0 << 16)), [1, 128 / 255, 0]);
// C3's PackRGBAEx for (1, 0.5, 0, 1)
const packEx = (r, g, b, a) => {
  const c = (v) => { v = Math.max(-8192, Math.min(8191, Math.floor(1024 * v))); return v < 0 ? v + 16384 : v; };
  return -(16384 * c(r) * 16384 * 1024 + 16384 * c(g) * 1024 + 1024 * c(b) + Math.max(0, Math.min(1023, Math.floor(1023 * a))));
};
const ex = rgbValueToColor(packEx(1, 0.5, 0, 1));
assert.ok(Math.abs(ex[0] - 1) < 1e-3 && Math.abs(ex[1] - 0.5) < 1e-3 && Math.abs(ex[2]) < 1e-3, JSON.stringify(ex));
console.log("bbcode/color tests passed");
