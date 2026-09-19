export const config = {
  listName: "Set vertical alignment",
  displayText: "Set vertical alignment to [i]{0}[/i]",
  description: "Set the vertical alignment of the text.",
  params: [{ id: "align", name: "Alignment", desc: "Vertical alignment.", type: "combo", initialValue: "top", items: [{ top: "Top" }, { center: "Center" }, { bottom: "Bottom" }] }],
};
export const expose = true;
export default function (align) {
  this._tgSetVAlign(align * 0.5);
}
