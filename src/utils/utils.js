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

export function loadImg(imgEl, srcset, alt = "", sizes = "", loading = "lazy") {
  imgEl.srcset = srcset;
  imgEl.sizes = sizes;
  imgEl.alt = alt;
  imgEl.loading = loading;

  const onLoad = () => {
    imgEl.classList.remove("image-placeholder");
    imgEl.removeEventListener("load", onLoad);
  };

  if (imgEl.complete && imgEl.naturalWidth !== 0) {
    imgEl.classList.remove("image-placeholder");
  } else {
    imgEl.addEventListener("load", onLoad);
  }
}
