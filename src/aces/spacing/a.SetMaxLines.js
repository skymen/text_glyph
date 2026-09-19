export const config = {
  listName: "Set max lines",
  displayText: "Set max lines to [i]{0}[/i]",
  description: "Highest number of lines to lay out. 0 means no limit.",
  params: [{ id: "count", name: "Lines", desc: "Line limit, 0 for none.", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (count) {
  this._tgSetMaxLines(count);
}
