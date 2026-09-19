export const config = {
  listName: "Add flow exclusion",
  displayText: "Flow text around [i]{0}[/i] on [i]{1}[/i] side with margin [i]{2}[/i]",
  description: "Text wraps around the picked instances. Sprites use their collision polygon, anything else its bounding box. The layout follows them as they move.",
  params: [
    { id: "object", name: "Object", desc: "The picked instances to flow around.", type: "object" },
    { id: "side", name: "Wrap side", desc: "Which side of the shape text may flow on.", type: "combo", initialValue: "both", items: [{ both: "Both" }, { start: "Start" }, { end: "End" }, { largest: "Largest" }] },
    { id: "margin", name: "Margin", desc: "Clearance around the shape in pixels.", type: "number", initialValue: "0" },
  ],
};
export const expose = true;
export default function (object, side, margin) {
  this._tgAddExclusion(object, side, margin);
}
