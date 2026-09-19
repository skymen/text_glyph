export const config = {
  listName: "Compare text",
  displayText: "Text is [i]{0}[/i] (case sensitive: [i]{1}[/i])",
  description: "Compare the current text with a string.",
  params: [
    { id: "text", name: "Text", desc: "Text to compare with.", type: "string", initialValue: '""' },
    { id: "caseSensitive", name: "Case sensitive", desc: "Whether the comparison is case sensitive.", type: "boolean", initialValue: "false" },
  ],
};
export const expose = true;
export default function (text, caseSensitive) {
  text = String(text);
  return caseSensitive ? this._text === text : this._text.toLowerCase() === text.toLowerCase();
}
