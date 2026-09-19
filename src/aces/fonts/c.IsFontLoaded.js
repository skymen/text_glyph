export const config = {
  listName: "Is font loaded",
  displayText: "Is font [i]{0}[/i] ([i]{1}[/i]) loaded",
  description: "True once a project font has been loaded and is ready to draw with.",
  isInvertible: true,
  params: [
    { id: "family", name: "Font family", desc: "Font family name.", type: "string", initialValue: '"Arial"' },
    { id: "style", name: "Style", desc: "Font style.", type: "combo", initialValue: "normal", items: [{ normal: "Normal" }, { bold: "Bold" }, { italic: "Italic" }, { boldItalic: "Bold and italic" }] },
  ],
};
export const expose = true;
export default function (family, style) {
  return this._shared.fonts.isLoaded(String(family), style === 1 || style === 3, style === 2 || style === 3);
}
