export const config = {
  returnType: "number",
  description: "The width of the nth [tag=...] span with the given name, in layout coordinates.",
  params: [
    { id: "tag", name: "Tag", desc: "Tag name.", type: "string" },
    { id: "index", name: "Index", desc: "Zero based index of the span among spans with that tag.", type: "number" },
  ],
};
export const expose = false;
export default function (tag, index) {
  const r = this._tgTagRect(tag, index);
  return r ? r.width : 0;
}
