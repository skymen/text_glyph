export const config = { returnType: "number", description: "Horizontal alignment in percent, 0 (left) to 100 (right).", params: [] };
export const expose = false;
export default function () {
  return this._core.alignX * 100;
}
