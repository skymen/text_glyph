export const config = { returnType: "number", description: "Number of laid out lines.", params: [] };
export const expose = false;
export default function () {
  return this._tgLineCount();
}
