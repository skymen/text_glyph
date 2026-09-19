export const config = {
  listName: "Set origin",
  displayText: "Set origin to ([i]{0}[/i], [i]{1}[/i])",
  description: "Set the origin point as fractions of the size. (0, 0) is the top left corner, (0.5, 0.5) the center, (1, 1) the bottom right corner.",
  params: [
    { id: "x", name: "Origin X", desc: "Horizontal origin from 0 (left) to 1 (right).", type: "number", initialValue: "0" },
    { id: "y", name: "Origin Y", desc: "Vertical origin from 0 (top) to 1 (bottom).", type: "number", initialValue: "0" },
  ],
};
export const expose = true;
export default function (x, y) {
  this._tgSetOrigin(x, y);
}
