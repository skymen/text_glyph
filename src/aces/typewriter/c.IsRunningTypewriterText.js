export const config = {
  listName: "Is running typewriter text",
  displayText: "Is running typewriter text",
  description: "True while text is being revealed by the typewriter action.",
  isInvertible: true,
  params: [],
};
export const expose = true;
export default function () {
  return this._tgIsTypewriting();
}
