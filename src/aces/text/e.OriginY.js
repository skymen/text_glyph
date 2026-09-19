export const config = { returnType: "number", description: "Vertical origin as a fraction of the height, 0 (top) to 1 (bottom).", params: [] };
export const expose = false;
export default function () {
  return this.originY;
}
