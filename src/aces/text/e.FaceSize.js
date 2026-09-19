export const config = { returnType: "number", description: "The current font size in points.", params: [] };
export const expose = false;
export default function () {
  return this._ptSize;
}
