export const config = {
  id: "OnTypewriterTextFinished",
  listName: "On typewriter text finished",
  displayText: "On typewriter text finished",
  description: "Triggered when the typewriter action has revealed the whole text.",
  isTrigger: true,
  params: [],
};
export const expose = false;
export default function () {
  return true;
}
