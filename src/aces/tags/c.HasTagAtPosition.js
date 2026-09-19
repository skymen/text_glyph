export const config = {
  listName: "Has tag at position",
  displayText: "Has tag [i]{0}[/i] at ([i]{1}[/i], [i]{2}[/i])",
  description: "True if the text under a layout position is inside a [tag=...] span with the given name.",
  params: [
    { id: "tag", name: "Tag", desc: "Tag name to look for.", type: "string", initialValue: '""' },
    { id: "x", name: "X", desc: "X position in layout coordinates.", type: "number", initialValue: "0" },
    { id: "y", name: "Y", desc: "Y position in layout coordinates.", type: "number", initialValue: "0" },
  ],
};
export const expose = true;
export default function (tag, x, y) {
  const found = this._tgTagAt(x, y);
  return !!found && found.toLowerCase() === String(tag).toLowerCase();
}
