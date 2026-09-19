export const config = { returnType: "string", description: "The current font family name.", params: [] };
export const expose = false;
export default function () {
  return this._family;
}
