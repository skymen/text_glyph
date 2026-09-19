export const config = {
  listName: "Remove flow exclusion",
  displayText: "Stop flowing text around [i]{0}[/i]",
  description: "Stop wrapping around the picked instances.",
  params: [{ id: "object", name: "Object", desc: "The picked instances to release.", type: "object" }],
};
export const expose = true;
export default function (object) {
  this._tgRemoveExclusion(object);
}
