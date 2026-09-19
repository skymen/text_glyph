export const config = {
  listName: "Set font face",
  displayText: "Set font face to [i]{0}[/i] ([i]{1}[/i])",
  description: "Set the font family and style. The family must match a .ttf or .otf project file.",
  params: [
    { id: "family", name: "Font family", desc: "Font family name, matching a project font file.", type: "string", initialValue: '"Arial"' },
    {
      id: "style", name: "Style", desc: "Font style.", type: "combo", initialValue: "normal",
      items: [{ normal: "Normal" }, { bold: "Bold" }, { italic: "Italic" }, { boldItalic: "Bold and italic" }],
    },
  ],
};
export const expose = true;
export default function (family, style) {
  this._tgSetFont(family, style === 1 || style === 3, style === 2 || style === 3);
}
