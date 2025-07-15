import "./components/drawer.js";
import "./components/modal.js";
import "./components/select-box.js";
import "./components/toast.js";
import "./modules/static-images-loader.js";
import "./modules/swiper.js";
import "./modules/mobile-navigation.js";
import { renderFeaturedProducts } from "./modules/featured-section.js";
import { renderModal } from "./modules/product-modal.js";
import { toast } from "./modules/toast.js";
import { refreshListingSection, renderListingProducts } from "./modules/product-listing-section.js";
import { productsService } from "./services/products-service.js";
import { paramsService } from "./services/params-service.js";

const skeletons = document.querySelectorAll("[data-product-skeleton]");
const productSelect = document.getElementById("product-listing-select-box");

productSelect.onChange = refreshListingSection;
productSelect.value = paramsService.getParam("page-size") ?? productSelect.value;
paramsService.setParam("page-size", productSelect.value);

try {
  const products = await productsService.fetchProducts(+productSelect.value);

  skeletons.forEach((skeleton) => skeleton.remove());

  if (paramsService.hasParam("product-id")) {
    const productId = paramsService.getParam("product-id");
    const productData = productsService.productCache.get(+productId);

    productData ? renderModal(productData) : paramsService.deleteParam("product-id");
  }

  renderFeaturedProducts(products.slice(0, productsService.featuredProductsLength));
  renderListingProducts(products.slice(productsService.featuredProductsLength));
} catch (error) {
  toast.show("error", "Error", "Failed to load products. Please try again later.", "bottom-right");
  console.error("Error fetching products:", error);
}
