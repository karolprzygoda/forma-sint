import heroSrcSet from "/src/assets/hero-image.webp?w=270;665;984;1180;1446;1652;1836;2048;2270;2478;2680;2880;3050;3220;3380;3540;3690;3830;3960;4096&format=webp&as=srcset";
import listingSrcSet from "/src/assets/listing-image.webp?w=270;665;984;1230;1430;1610;1770;1910;2048&format=webp&as=srcset";

const STATIC_IMAGES = {
  hero: {
    srcSet: heroSrcSet,
    alt: "Premium outdoor clothing showcase",
    sizes: "calc(98.07vw - 26px)",
    loading: "eager",
  },
  listing: {
    srcSet: listingSrcSet,
    alt: "You'll look and feel like the champion.",
    sizes: "(min-width: 2560px) calc(33.41vw - 46px), (min-width: 940px) 48vw, calc(100vw - 32px)",
  },
};

const imagePlaceholders = document.querySelectorAll("[data-static-image]");

const loadImg = (imgEl, srcset, alt = "", sizes = "", loading = "lazy") => {
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
};

imagePlaceholders.forEach((placeholder) => {
  const imageName = placeholder.dataset.staticImage;
  const { srcSet, alt, sizes, loading } = STATIC_IMAGES[imageName] || {};

  if (srcSet) {
    loadImg(placeholder, srcSet, alt, sizes, loading);
  } else {
    console.warn(`No static image data found for type: ${imageName}`);
  }
});
