export const config = {
  listName: "Typewriter text",
  displayText: "Typewriter text [i]{0}[/i] over [i]{1}[/i] seconds",
  description: "Set the text and reveal it one character at a time. The layout is computed once, so nothing shifts while typing.",
  params: [
    { id: "text", name: "Text", desc: "The text to type out.", type: "any", initialValue: '""' },
    { id: "duration", name: "Duration", desc: "Time in seconds to reveal the whole text.", type: "number", initialValue: "2" },
  ],
};
export const expose = true;
export default function (text, duration) {
  if (typeof text === "number" && text < 1e9) text = Math.round(text * 1e10) / 1e10;
  this._tgStartTypewriter(String(text), duration);
}
