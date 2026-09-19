export const config = {
  listName: "Set BBCode enabled",
  displayText: "Set BBCode [b]{0}[/b]",
  description: "Enable or disable BBCode parsing of the text.",
  params: [{ id: "enabled", name: "Enabled", desc: "Whether BBCode tags are parsed.", type: "boolean", initialValue: "true" }],
};
export const expose = true;
export default function (enabled) {
  this._tgSetBBCode(enabled);
}
