export const config = {
  listName: "Set line height",
  displayText: "Set line height to [i]{0}[/i]",
  description: "Set the extra pixels added to every line. Can be negative.",
  params: [{ id: "lineHeight", name: "Line height", desc: "Extra pixels per line.", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (lineHeight) {
  this._tgSetLineHeight(lineHeight);
}
