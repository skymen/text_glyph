export const config = {
  listName: "Set wrapping",
  displayText: "Set wrapping to [i]{0}[/i]",
  description: "Set whether lines break between words, between characters, or only at line breaks in the text.",
  params: [{ id: "mode", name: "Mode", desc: "Wrapping mode.", type: "combo", initialValue: "word", items: [{ word: "Word" }, { character: "Character" }, { none: "None" }] }],
};
export const expose = true;
export default function (mode) {
  this._tgSetWrap(mode);
}
