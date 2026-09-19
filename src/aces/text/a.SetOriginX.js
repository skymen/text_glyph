export const config = {
  listName: "Set origin X",
  displayText: "Set origin X to [i]{0}[/i]",
  description: "Set the horizontal origin as a fraction of the width: 0 is the left edge, 0.5 the center, 1 the right edge.",
  params: [{ id: "x", name: "Origin X", desc: "Horizontal origin from 0 (left) to 1 (right).", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (x) {
  this._tgSetOriginX(x);
}
