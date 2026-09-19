export const config = {
  listName: "Append text",
  displayText: "Append [i]{0}[/i]",
  description: "Add some text to the end of the existing text.",
  params: [{ id: "text", name: "Text", desc: "The text to append.", type: "any", initialValue: '""' }],
};
export const expose = true;
export default function (text) {
  this._tgCancelTypewriter();
  if (typeof text === "number" && text < 1e9) text = Math.round(text * 1e10) / 1e10;
  this._tgSetText(this._text + String(text));
}
