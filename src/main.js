import "./components/swiper.js";
import "./components/ui/drawer.js";
import "./components/featured-list.js";
import "./components/product-listing.js";
import "./components/ui/modal.js";
import "./components/ui/skeleton.js";

const mobileNavTrigger = document.getElementById("mobile-nav-trigger");
const mobileNavPanel = document.getElementById("mobile-nav-panel");
const mobileNavClose = document.getElementById("mobile-nav-close");

const productModal = document.getElementById("product-modal");
const productModalClose = document.getElementById("product-modal-close");

mobileNavTrigger.addEventListener("click", (e) => {
  mobileNavPanel.open();
});

mobileNavClose.addEventListener("click", (e) => {
  mobileNavPanel.close();
});

productModalClose.addEventListener("click", (e) => {
  productModal.close();
});
