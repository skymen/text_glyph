export const config = { returnType: "number", description: "Vertical alignment in percent, 0 (top) to 100 (bottom).", params: [] };
export const expose = false;
export default function () {
  return this._core.alignY * 100;
}
