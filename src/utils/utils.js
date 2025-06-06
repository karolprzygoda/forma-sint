export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function objectToStyles(styles) {
  return Object.entries(styles)
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(" ");
}
