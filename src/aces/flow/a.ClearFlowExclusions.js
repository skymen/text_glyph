export const config = {
  listName: "Clear flow exclusions",
  displayText: "Clear flow exclusions",
  description: "Stop wrapping around every instance.",
  params: [],
};
export const expose = true;
export default function () {
  this._tgClearExclusions();
}
