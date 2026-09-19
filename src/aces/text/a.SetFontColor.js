import { rgbValueToColor } from "../../runtime/color.js";
export const config = {
  listName: "Set font color",
  displayText: "Set font color to [i]{0}[/i]",
  description: "Set the text color, e.g. with rgb(255, 0, 0) or rgbEx(100, 0, 0).",
  params: [{ id: "color", name: "Color", desc: "Color value from rgb() or rgbEx().", type: "number", initialValue: "rgb(0, 0, 0)" }],
};
export const expose = true;
export default function (color) {
  this._tgSetColor(rgbValueToColor(color));
}
