export const config = { returnType: "number", description: "Height of all laid out lines, in layout pixels.", params: [] };
export const expose = false;
export default function () {
  return this._tgTextHeight();
}
