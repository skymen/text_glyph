export const config = {
  listName: "Set icon set",
  displayText: "Set icon set to [i]{0}[/i]",
  description: "Use a Sprite's animations for [icon=animation] tags. The Sprite needs at least one instance in the layout.",
  params: [{ id: "object", name: "Sprite", desc: "The Sprite object whose animations are the icons.", type: "object" }],
};
export const expose = true;
export default function (object) {
  this._tgSetIconSet(object);
}
