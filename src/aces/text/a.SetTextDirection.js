export const config = {
  listName: "Set text direction",
  displayText: "Set text direction to [i]{0}[/i]",
  description: "Set the base paragraph direction.",
  params: [{ id: "direction", name: "Direction", desc: "Base direction.", type: "combo", initialValue: "ltr", items: [{ ltr: "Left to right" }, { rtl: "Right to left" }, { auto: "Auto" }] }],
};
export const expose = true;
export default function (direction) {
  this._tgSetDirection(direction);
}
