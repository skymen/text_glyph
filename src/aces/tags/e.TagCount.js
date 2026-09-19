export const config = {
  returnType: "number",
  description: "How many separate [tag=...] spans with the given name the text contains.",
  params: [{ id: "tag", name: "Tag", desc: "Tag name.", type: "string" }],
};
export const expose = false;
export default function (tag) {
  return this._tgTagCount(tag);
}
