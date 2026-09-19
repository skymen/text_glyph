export const config = {
  listName: "Set horizontal alignment",
  displayText: "Set horizontal alignment to [i]{0}[/i]",
  description: "Set the horizontal alignment of the text.",
  params: [{ id: "align", name: "Alignment", desc: "Horizontal alignment.", type: "combo", initialValue: "left", items: [{ left: "Left" }, { center: "Center" }, { right: "Right" }] }],
};
export const expose = true;
export default function (align) {
  this._tgSetHAlign(align * 0.5);
}
