export const config = { returnType: "number", description: "Horizontal origin as a fraction of the width, 0 (left) to 1 (right).", params: [] };
export const expose = false;
export default function () {
  return this.originX;
}
