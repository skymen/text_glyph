// Layout checks for TextCore with a Node adapter: alignment shifts, justify,
// RTL, wrap none and kerning. Runs over both the glyph (wasm) layout and the
// JavaScript layout the editor uses. Uses the system Arial.
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { createShared, TextCore } from "../src/runtime/textCore.js";
import { getGlyphEngine } from "../src/runtime/glyphEngine.js";
import { parseOpenType } from "../src/vendor/glyph.js";

const dist = new URL("../node_modules/@pmndrs/glyph/dist/", import.meta.url);
const ARIAL = process.argv[2] ?? "/System/Library/Fonts/Supplemental/Arial.ttf";
const adapter = {
  createEngine: () => getGlyphEngine((name) => readFile(new URL(name, dist))),
  parseFont: parseOpenType,
  findFile: (stems) => ({ name: ARIAL, index: stems.length - 1 }),
  loadFile: async (name) => {
    const b = await readFile(name);
    return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  },
  onChange() {},
};

for (const mode of ["glyph", "simple"]) {
  const shared = createShared(mode === "glyph" ? adapter : { ...adapter, createEngine: null });
  await shared.ready;
  await shared.fonts.loadFace("Arial", false, false);
  assert.equal(shared.simple, mode === "simple");

  const core = new TextCore(shared);
  core.setSize(15);
  core.setText("abc def ");
  core.setAlignment(0, 0);
  assert.ok(core.ensureLayout(300, 100), "layout ready");
  const adv = core.insp.lineAdvances[0];
  assert.ok(adv > 40 && adv < 300, "advance " + adv);
  assert.equal(core._lineShift[0], 0);
  core.setAlignment(1, 1);
  core.ensureLayout(300, 100);
  assert.ok(Math.abs(core._lineShift[0] - (300 - adv)) < 1e-3, "right shift " + core._lineShift[0]);
  assert.ok(Math.abs(core._offsetY - (100 - core.insp.contentHeight)) < 1e-3, "bottom offset");
  core.setAlignment(0.25, 0.5);
  core.ensureLayout(300, 100);
  assert.ok(Math.abs(core._lineShift[0] - (300 - adv) * 0.25) < 1e-3, "quarter shift");
  const [bx] = core.glyphBox(0);
  assert.ok(Math.abs(bx - (300 - adv) * 0.25) < 1e-3, "glyphBox includes shift");

  // Justify: every line but the last fills the width, the last line follows alignX.
  core.setText("one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen");
  core.setAlignment(1, 0);
  core.setJustify(1);
  core.ensureLayout(150, 300);
  const insp = core.insp;
  assert.ok(insp.lineCount >= 3, "lines " + insp.lineCount);
  for (let l = 0; l < insp.lineCount - 1; l++)
    assert.ok(Math.abs(insp.lineAdvances[l] - 150) < 0.6, `justified line ${l} advance ${insp.lineAdvances[l]}`);
  const last = insp.lineCount - 1;
  assert.ok(insp.lineAdvances[last] < 150 - 1, "last line not justified");
  assert.ok(Math.abs(core._lineShift[last] - (150 - insp.lineAdvances[last])) < 1e-3, "last line right aligned");
  core.setJustify(2);
  core.ensureLayout(150, 300);
  assert.ok(Math.abs(core.insp.lineAdvances[core.insp.lineCount - 1] - 150) < 0.6, "every line justified");

  // RTL text with auto direction starts at the right edge, so alignX 1 needs no shift.
  core.setJustify(0);
  core.setDirection(2);
  core.setText("مرحبا بالعالم");
  core.setAlignment(1, 0);
  core.ensureLayout(300, 100);
  assert.ok(Math.abs(core._lineShift[0]) < 1e-3, "rtl right aligned shift " + core._lineShift[0]);
  const rtlAdv = core.insp.lineAdvances[0];
  let minX = Infinity;
  for (let i = 0; i < core.insp.glyphCount; i++) minX = Math.min(minX, core.insp.x[i]);
  assert.ok(Math.abs(minX - (300 - rtlAdv)) < 1, "rtl line sits at the right edge");
  core.setAlignment(0, 0);
  core.ensureLayout(300, 100);
  assert.ok(Math.abs(core._lineShift[0] + (300 - rtlAdv)) < 1e-3, "rtl left aligned shift");

  // Auto direction is per paragraph.
  core.setText("abc\nمرحبا\nxyz");
  core.ensureLayout(300, 100);
  assert.equal(core.insp.lineCount, 3);
  assert.ok(Math.abs(core._lineShift[0]) < 1e-3 && Math.abs(core._lineShift[2]) < 1e-3, "ltr paragraphs unshifted");
  assert.ok(core._lineShift[1] < -10, "rtl paragraph shifted left " + core._lineShift[1]);

  // Wrap none keeps one line.
  core.setDirection(0);
  core.setWrap(2);
  core.setText("one two three four five six seven eight nine ten eleven twelve");
  core.ensureLayout(100, 100);
  assert.equal(core.insp.lineCount, 1);

  // Kerning: "AV" is narrower than the sum of "A" and "V".
  core.setWrap(0);
  const width = (t) => { core.setText(t); core.ensureLayout(300, 100); return core.insp.lineAdvances[0]; };
  const av = width("AV"), a = width("A"), v = width("V");
  assert.ok(av < a + v - 0.5, `AV kerned in ${mode}: ${av} vs ${a + v}`);

  // Overflow off hides whole lines below the box, ellipsis cuts the text.
  core.setText("one two three four five six seven eight nine ten");
  core.ensureLayout(120, 50);
  assert.ok(core.insp.lineCount >= 4, "many lines");
  const lh0 = core.insp.lines[0].lineHeight;
  core.setOverflow(false);
  core.ensureLayout(120, 50);
  assert.equal(core._lineLimit, Math.floor(50 / lh0), "clipped line limit in " + mode);
  core.setOverflow(true);
  core.setEllipsis(true);
  core.ensureLayout(120, 50);
  assert.equal(core.insp.lineCount, 2, "ellipsis lines in " + mode);
  assert.equal(core.insp.glyphIds[core.insp.glyphCount - 1], 171, "ends with … in " + mode);
  assert.ok(core.insp.lineAdvances[1] <= 120, "ellipsis line fits");
  core.setEllipsis(false);

  // Spacing, max lines, columns, paragraph spacing and inline blanks.
  core.setOverflow(true);
  core.setEllipsis(false);
  const plainAdv = width("abc def");
  core.setLetterSpacing(3);
  assert.ok(Math.abs(width("abc def") - (plainAdv + 3 * 7)) < 0.6, "letter spacing in " + mode + " " + width("abc def"));
  core.setLetterSpacing(0);
  core.setWordSpacing(10);
  assert.ok(Math.abs(width("abc def") - (plainAdv + 10)) < 0.6, "word spacing in " + mode);
  core.setWordSpacing(0);
  assert.ok(Math.abs(width("[letterspacing=3]abc[/letterspacing] def") - (plainAdv + 9)) < 0.6, "letter spacing tag in " + mode);
  const gapAdv = width("a[space=30]b");
  assert.ok(Math.abs(gapAdv - (width("ab") + 30)) < 0.6, "space tag in " + mode + " " + gapAdv);
  core.setText("one two three four five six seven eight nine ten");
  core.setMaxLines(2);
  core.ensureLayout(120, 300);
  assert.equal(core.insp.lineCount, 2, "max lines in " + mode);
  core.setMaxLines(0);
  core.setParagraphSpacing(8);
  core.setText("a\nb\nc");
  core.ensureLayout(300, 100);
  assert.ok(Math.abs(core._lineYShift[2] - 16) < 1e-3 && core._lineYShift[0] === 0, "paragraph spacing shift");
  assert.ok(Math.abs(core.textHeight() - (3 * lh0 + 16)) < 0.6, "paragraph spacing height " + core.textHeight());
  core.setParagraphSpacing(0);
  core.setColumns(2, 10);
  core.setText("one two three four five six seven eight nine ten eleven twelve");
  core.ensureLayout(200, 50);
  {
    const ins = core.insp;
    const xs = Array.from(ins.lineGlyphStarts).map((g) => ins.x[g]);
    assert.ok(xs.some((x) => x > 100) && xs.some((x) => x < 1), "columns in " + mode + " " + xs.join(","));
  }
  core.setColumns(1, 0);
  core.setEllipsis(true);
  core.setWrap(2);
  core.setText("this is a very long line that does not wrap at all");
  core.ensureLayout(120, 100);
  assert.equal(core.insp.glyphIds[core.insp.glyphCount - 1], 171, "nowrap ellipsis in " + mode);
  assert.ok(core.insp.lineAdvances[0] <= 120.5, "nowrap ellipsis fits in " + mode);
  core.setEllipsis(false);
  core.setWrap(0);

  // Line metrics match between modes: 15pt Arial line height.
  core.setText("x");
  core.ensureLayout(300, 100);
  const lh = core.insp.lines[0].lineHeight;
  assert.ok(Math.abs(lh - 20 * 2355 / 2048) < 0.05, `line height ${lh} in ${mode}`);
  assert.ok(Math.abs(core.insp.lines[0].ascent - (20 * 1854 / 2048 + 20 * 67 / 2048 / 2)) < 0.05, "ascent in " + mode);
  core.dispose();
  console.log(mode, "layout checks passed");
}
// Fredoka kerns letters against the space, which makes HarfRust flag the first
// glyph of most words unsafe to break. Without the kern-off-on-spaces
// workaround glyph would break after "stays" here and split "the" at 200.
{
  const FREDOKA = new URL("../examples/fonts/Fredoka-Regular.ttf", import.meta.url).pathname;
  const shared = createShared({ ...adapter, findFile: (stems) => ({ name: FREDOKA, index: stems.length - 1 }) });
  await shared.ready;
  await shared.fonts.loadFace("Fredoka", false, false);
  const core = new TextCore(shared);
  core.setFont("Fredoka", false, false);
  core.setSize(12);
  core.setText("Reveals one grapheme at a time over a duration. Layout stays put and a trigger fires at the end.");
  for (const w of [200, 280]) {
    core.ensureLayout(w, 300);
    const insp = core.insp;
    for (let l = 0; l < insp.lineCount - 1; l++) {
      const line = core._parsed.plain.slice(insp.lineTextStarts[l], insp.lineTextEnds[l]);
      const next = core._parsed.plain.slice(insp.lineTextStarts[l + 1]).split(" ")[0];
      assert.ok(line.endsWith(" "), `line ${l} at ${w} breaks at a space: ${JSON.stringify(line)}`);
      assert.ok(insp.lineAdvances[l] + spaceAndWord(core, next) > w, `line ${l} at ${w} is as full as it can be: ${JSON.stringify(line)} + ${next}`);
    }
  }
  core.dispose();
  console.log("space kerning wrap check passed");
}
function spaceAndWord(core, word) {
  const probe = new TextCore(core.shared);
  probe.setFont(core.family, false, false);
  probe.setSize(core.ptSize);
  probe.setText(" " + word);
  probe.ensureLayout(10000, 100);
  const w = probe.insp.contentWidth;
  probe.dispose();
  return w;
}
console.log("core tests passed");
