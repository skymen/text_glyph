export const config = {
  listName: "Set horizontal alignment (by percentage)",
  displayText: "Set horizontal alignment to [i]{0}[/i]%",
  description: "Set where each line sits in the box: 0 is the left edge, 50 the center, 100 the right edge. Any value in between works.",
  params: [{ id: "percent", name: "Percent", desc: "Horizontal alignment from 0 (left) to 100 (right).", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (percent) {
  this._tgSetHAlign(percent / 100);
}
