export const config = {
  listName: "Set text",
  displayText: "Set text to [i]{0}[/i]",
  description: "Set the text to display. BBCode tags are parsed when BBCode is enabled.",
  params: [{ id: "text", name: "Text", desc: "The text to display.", type: "any", initialValue: '""' }],
};
export const expose = true;
export default function (text) {
  this._tgCancelTypewriter();
  if (typeof text === "number" && text < 1e9) text = Math.round(text * 1e10) / 1e10;
  this._tgSetText(text);
}
