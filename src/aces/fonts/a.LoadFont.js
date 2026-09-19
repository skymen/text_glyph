export const config = {
  listName: "Load font",
  displayText: "Load font [i]{0}[/i] ([i]{1}[/i])",
  description: "Load a project font ahead of time so text using it appears without delay. Waits until the font is ready.",
  isAsync: true,
  params: [
    { id: "family", name: "Font family", desc: "Font family name, matching a project font file.", type: "string", initialValue: '"Arial"' },
    { id: "style", name: "Style", desc: "Font style.", type: "combo", initialValue: "normal", items: [{ normal: "Normal" }, { bold: "Bold" }, { italic: "Italic" }, { boldItalic: "Bold and italic" }] },
  ],
};
export const expose = true;
export default async function (family, style) {
  await this._shared.fonts.loadFace(String(family), style === 1 || style === 3, style === 2 || style === 3);
}
