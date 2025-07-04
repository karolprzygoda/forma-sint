import { getRandomInt, objectToStyles } from "../utils/utils.js";
import { productsService } from "../services/products-service.js";

const INITIAL_PAGE_NUMBER = 1;
const BADGE_OPTIONS = {
  1: {
    label: "BESTSELLER",
    styles: { "background-color": "var(--label-primary)" },
  },
  2: {
    label: "LIMITED EDITION",
    styles: { "background-color": "var(--label-secondary)" },
  },
  3: {
    label: "",
    styles: { display: "none" },
  },
};

const dataContainer = document.getElementById("featured-products-carousel");
const cardTemplate = document.getElementById("product-card-template");

const renderProduct = (productData) => {
  const number = getRandomInt(1, 4);
  const badge = BADGE_OPTIONS[number];
  const badgeStyles = objectToStyles(badge.styles);

  const productCardFragment = cardTemplate.content.cloneNode(true);
  const productCard = productCardFragment.querySelector(".product-card");

  const label = productCardFragment.querySelector(".product-card__badge");
  const imgEl = productCardFragment.querySelector("img");
  const titleEl = productCardFragment.querySelector("h2.text-lg");

  productCard.id = `product-card-${productData.id}`;
  productCard.href = `?product-id=${productData.id}`;

  label.textContent = badge.label;
  label.style = badgeStyles;

  imgEl.src = productData.image;
  imgEl.alt = "Product Image:" + productData.id;
  imgEl.loading = "lazy";

  titleEl.textContent = productData.text;

  return productCardFragment;
};

export default async function initializeFeaturedList() {
  const data = await productsService.fetchProducts(INITIAL_PAGE_NUMBER, dataContainer);
  productsService.removeSkeletons(dataContainer);

  const productCardList = data.map((product) => renderProduct(product));

  dataContainer.append(...productCardList);
}
