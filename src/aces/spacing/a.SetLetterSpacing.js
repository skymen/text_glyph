export const config = {
  listName: "Set letter spacing",
  displayText: "Set letter spacing to [i]{0}[/i]",
  description: "Extra pixels after every character. Can be negative.",
  params: [{ id: "px", name: "Pixels", desc: "Extra advance per character.", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (px) {
  this._tgSetLetterSpacing(px);
}
