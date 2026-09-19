export const config = {
  listName: "Set font size",
  displayText: "Set font size to [i]{0}[/i]",
  description: "Set the font size in points.",
  params: [{ id: "size", name: "Size", desc: "Font size in points.", type: "number", initialValue: "12" }],
};
export const expose = true;
export default function (size) {
  this._tgSetSize(size);
}
