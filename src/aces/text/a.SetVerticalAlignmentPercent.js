export const config = {
  listName: "Set vertical alignment (by percentage)",
  displayText: "Set vertical alignment to [i]{0}[/i]%",
  description: "Set where the text block sits in the box: 0 is the top, 50 the middle, 100 the bottom. Any value in between works.",
  params: [{ id: "percent", name: "Percent", desc: "Vertical alignment from 0 (top) to 100 (bottom).", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (percent) {
  this._tgSetVAlign(percent / 100);
}
