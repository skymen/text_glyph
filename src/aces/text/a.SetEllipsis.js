export const config = {
  listName: "Set ellipsis",
  displayText: "Set ellipsis [i]{0}[/i]",
  description: "Cut text that does not fit the box and end it with an ellipsis (…).",
  params: [{ id: "enabled", name: "Ellipsis", desc: "Whether to cut overflowing text with an ellipsis.", type: "boolean", initialValue: "false" }],
};
export const expose = true;
export default function (enabled) {
  this._tgSetEllipsis(enabled);
}
