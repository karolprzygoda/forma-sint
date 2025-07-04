import heroSrcSet from "/src/assets/hero-image.webp?w=826;1180;1446;1652;1836;2048;2270;2478;2680;2880;3050;3220;3380;3540;3690;3830;3960;4096&format=webp&as=srcset";
import listingSrcSet from "/src/assets/listing-image.webp?w=270;665;984;1230;1430;1610;1770;1910;2048&format=webp&as=srcset";

import "./components/ui/drawer.js";
import "./components/ui/modal.js";
import "./components/ui/select-box.js";
// import "./components/ui/toast.js"; UNDER DEVELOPMENT

import "./components/swiper.js";

import initializeFeaturedList from "./components/featured-list.js";
import initializeProductListing from "./components/product-listing.js";

import { loadImg } from "./utils/utils.js";

import { paramsService } from "./services/params-service.js";
import { productsService } from "./services/products-service.js";

const STATIC_IMAGES = {
  hero: {
    srcSet: heroSrcSet,
    alt: "Premium outdoor clothing showcase",
    sizes: "(max-width:767px)100vw,(max-width:1439px)90vw,1200px",
    loading: "eager",
  },
  listing: {
    srcSet: listingSrcSet,
    alt: "You'll look and feel like the champion.",
    sizes: "(max-width:767px)100vw,(max-width:1439px)90vw,1200px",
  },
};

const imagePlaceholders = document.querySelectorAll("[data-static-image]");

imagePlaceholders.forEach((placeholder) => {
  const imageType = placeholder.dataset.staticImage;
  const { srcSet, alt, sizes, loading } = STATIC_IMAGES[imageType] || {};

  if (srcSet) {
    loadImg(placeholder, srcSet, alt, sizes, loading);
  } else {
    console.warn(`No static image data found for type: ${imageType}`);
  }
});

const mobileNavTrigger = document.getElementById("mobile-nav-trigger");
const mobileNavPanel = document.getElementById("mobile-nav-panel");

const productModal = document.getElementById("product-modal");
const productModalImage = productModal.querySelector("img");
const productModalBadge = productModal.querySelector(".modal__badge");

const renderModal = (productData) => {
  productModalImage.src = productData.image;
  productModalImage.alt = `Product Image: ${productData.id}`;

  productModalBadge.textContent = `ID: ${productData.id}`;
  productModal.open();
};

productModal.onClose = () => paramsService.deleteParam("product-id");

mobileNavTrigger.addEventListener("click", (e) => {
  mobileNavPanel.open();
});

document.body.addEventListener("click", (e) => {
  const target = e.target.closest("[data-product]");

  if (!target) return;

  const productId = target.id.split("-").pop();
  const productData = productsService.productCache.get(parseInt(productId));

  if (!productData) return;
  e.preventDefault();

  paramsService.setParam("product-id", productData.id);

  renderModal(productData);
});

await Promise.all([initializeFeaturedList(), initializeProductListing()]);

if (paramsService.hasParam("product-id")) {
  const productId = paramsService.getParam("product-id");
  const productData = productsService.productCache.get(parseInt(productId));

  if (productData) {
    renderModal(productData);
  } else {
    paramsService.deleteParam("product-id");
  }
}

const toast = document.querySelector("toast-popover");

toast.show("info", "Welcome to our store!", "Explore our latest collections.", 5000, "top-right");
