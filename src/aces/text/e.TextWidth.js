export const config = { returnType: "number", description: "Width of the widest line of laid out text, in layout pixels.", params: [] };
export const expose = false;
export default function () {
  return this._tgTextWidth();
}
