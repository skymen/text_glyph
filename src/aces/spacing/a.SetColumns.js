export const config = {
  listName: "Set columns",
  displayText: "Set columns to [i]{0}[/i] with gap [i]{1}[/i]",
  description: "Flow the text through several columns inside the box, filling each to the box height in turn.",
  params: [
    { id: "count", name: "Columns", desc: "Number of columns, 1 for none.", type: "number", initialValue: "1" },
    { id: "gap", name: "Gap", desc: "Pixels between columns.", type: "number", initialValue: "0" },
  ],
};
export const expose = true;
export default function (count, gap) {
  this._tgSetColumns(count, gap);
}
