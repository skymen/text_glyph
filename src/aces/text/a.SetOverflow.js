export const config = {
  listName: "Set overflow",
  displayText: "Set overflow [i]{0}[/i]",
  description: "Let text extend past the bottom of the box. When off, lines that do not fit inside the box are not drawn.",
  params: [{ id: "enabled", name: "Overflow", desc: "Whether text may extend past the bottom of the box.", type: "boolean", initialValue: "true" }],
};
export const expose = true;
export default function (enabled) {
  this._tgSetOverflow(enabled);
}
