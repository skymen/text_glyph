export const config = { returnType: "string", description: "The current text with BBCode tags removed.", params: [] };
export const expose = false;
export default function () {
  return this._tgPlainText();
}
