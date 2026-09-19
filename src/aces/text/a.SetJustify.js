export const config = {
  listName: "Set justify",
  displayText: "Set justify to [i]{0}[/i]",
  description: "Stretch word spacing so lines fill the box width.",
  params: [{ id: "mode", name: "Mode", desc: "Which lines to justify.", type: "combo", initialValue: "none", items: [{ none: "Off" }, { lines: "All but last line" }, { all: "Every line" }] }],
};
export const expose = true;
export default function (mode) {
  this._tgSetJustify(mode);
}
