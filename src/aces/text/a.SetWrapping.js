export const config = {
  listName: "Set wrapping",
  displayText: "Set wrapping to [i]{0}[/i]",
  description: "Set whether lines break between words or between characters.",
  params: [{ id: "mode", name: "Mode", desc: "Wrapping mode.", type: "combo", initialValue: "word", items: [{ word: "Word" }, { character: "Character" }] }],
};
export const expose = true;
export default function (mode) {
  this._tgSetWrap(mode);
}
