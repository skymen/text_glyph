export const config = { returnType: "string", description: "The current text, including BBCode tags.", params: [] };
export const expose = false;
export default function () {
  return this._text;
}
