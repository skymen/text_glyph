export const config = {
  listName: "Set paragraph spacing",
  displayText: "Set paragraph spacing to [i]{0}[/i]",
  description: "Extra pixels between paragraphs, meaning after every line break in the text.",
  params: [{ id: "px", name: "Pixels", desc: "Space between paragraphs.", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (px) {
  this._tgSetParagraphSpacing(px);
}
