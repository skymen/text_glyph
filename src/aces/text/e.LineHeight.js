export const config = { returnType: "number", description: "The extra pixels added to every line.", params: [] };
export const expose = false;
export default function () {
  return this._lineHeightOffset;
}
