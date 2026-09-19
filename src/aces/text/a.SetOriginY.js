export const config = {
  listName: "Set origin Y",
  displayText: "Set origin Y to [i]{0}[/i]",
  description: "Set the vertical origin as a fraction of the height: 0 is the top edge, 0.5 the center, 1 the bottom edge.",
  params: [{ id: "y", name: "Origin Y", desc: "Vertical origin from 0 (top) to 1 (bottom).", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (y) {
  this._tgSetOriginY(y);
}
