import { getRandomInt, objectToStyles } from "../utils/utils.js";

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

const productsContainer = document.getElementById("featured-products-carousel");
const cardTemplate = document.getElementById("product-card-template");

const createProductCard = (product) => {
  const number = getRandomInt(1, 4);
  const badge = BADGE_OPTIONS[number];
  const badgeStyles = objectToStyles(badge.styles);

  const productCardFragment = cardTemplate.content.cloneNode(true);
  const productCard = productCardFragment.querySelector(".product-card");

  const label = productCardFragment.querySelector(".product-card__badge");
  const img = productCardFragment.querySelector("img");
  const title = productCardFragment.querySelector("h2.text-lg");

  productCard.id = `product-card-${product.id}`;
  productCard.href = `?product-id=${product.id}`;

  label.textContent = badge.label;
  label.style = badgeStyles;

  img.src = product.image;
  img.alt = "Product Image:" + product.id;
  img.width = 1024;
  img.height = 1024;
  img.loading = "lazy";

  title.textContent = product.text;

  return productCardFragment;
};

export const renderFeaturedProducts = (data) => {
  const products = data.map((product) => createProductCard(product));

  productsContainer.append(...products);
};
