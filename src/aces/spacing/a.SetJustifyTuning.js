export const config = {
  listName: "Set justify tuning",
  displayText: "Set justify word space to [i]{0}[/i] to [i]{1}[/i] times, letter space up to [i]{2}[/i]",
  description: "How far spaces may shrink and grow when justifying before letters spread apart. Max 0 means no limit.",
  params: [
    { id: "min", name: "Min word space", desc: "Smallest multiple of the natural space width, 0.01 to 1.", type: "number", initialValue: "1" },
    { id: "max", name: "Max word space", desc: "Largest multiple of the natural space width, 0 for no limit.", type: "number", initialValue: "0" },
    { id: "letter", name: "Letter space", desc: "Most extra pixels between letters once spaces are at their maximum.", type: "number", initialValue: "0" },
  ],
};
export const expose = true;
export default function (min, max, letter) {
  this._tgSetJustifyTuning(min, max, letter);
}
