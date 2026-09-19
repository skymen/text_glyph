export const config = {
  returnType: "string",
  description: "The [tag=...] name under a layout position, or an empty string.",
  params: [
    { id: "x", name: "X", desc: "X position in layout coordinates.", type: "number" },
    { id: "y", name: "Y", desc: "Y position in layout coordinates.", type: "number" },
  ],
};
export const expose = false;
export default function (x, y) {
  return this._tgTagAt(x, y);
}
