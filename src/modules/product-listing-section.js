import { paramsService } from "../services/params-service.js";
import { productsService } from "../services/products-service.js";
import { toast } from "./toast.js";

const productsContainer = document.getElementById("product-listing-container");
const cardTemplate = document.getElementById("product-listing-item-template");
const skeletonTemplate = document.getElementById("product-listing-skeleton-template");

const createProductCard = (product) => {
  const productCardFragment = cardTemplate.content.cloneNode(true);
  const productCard = productCardFragment.querySelector(".product-listing__card");

  const img = productCard.querySelector("img");
  const badge = productCard.querySelector(".product-listing__badge");

  productCard.id = `product-listing-item-${product.id}`;
  productCard.href = `?product-id=${product.id}`;

  img.src = product.image;
  img.alt = "Product Image:" + product.id;
  img.width = 1024;
  img.height = 1024;
  img.loading = "lazy";

  badge.textContent = `ID: ${product.id}`;

  return productCardFragment;
};

const renderListingProducts = (data) => {
  const products = data.map((product) => createProductCard(product));

  productsContainer.append(...products);
};

const refreshListingSection = async (e) => {
  try {
    const desiredProdNum = +e.target.value;
    const { currentPageSize, featuredProductsLength } = productsService;
    const listingProdNum = currentPageSize - featuredProductsLength;

    if (desiredProdNum < listingProdNum) {
      for (let i = listingProdNum; i > desiredProdNum; i--) {
        productsContainer.removeChild(productsContainer.lastElementChild);
      }
    } else {
      const skeletonsToAppend = desiredProdNum - listingProdNum;
      if (skeletonsToAppend > 0) {
        productsService.appendSkeletons(productsContainer, skeletonTemplate, skeletonsToAppend);
      }
    }

    const products = await productsService.fetchProducts(desiredProdNum);
    productsService.removeSkeletons(productsContainer);
    paramsService.setParam("page-size", desiredProdNum);
    renderListingProducts(products.slice(currentPageSize));
  } catch (error) {
    toast.show(
      "error",
      "Error",
      "Failed to load products. Please try again later.",
      "bottom-right",
    );
    console.error("Error fetching products:", error);
  }
};

export { renderListingProducts, refreshListingSection };
