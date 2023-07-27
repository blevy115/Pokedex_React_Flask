export function formatName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatGameName(name) {
  return name
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join("/");
}