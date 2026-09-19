export const config = {
  listName: "Set word spacing",
  displayText: "Set word spacing to [i]{0}[/i]",
  description: "Extra pixels after every space. Can be negative.",
  params: [{ id: "px", name: "Pixels", desc: "Extra advance per space.", type: "number", initialValue: "0" }],
};
export const expose = true;
export default function (px) {
  this._tgSetWordSpacing(px);
}
