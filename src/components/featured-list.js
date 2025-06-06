import { fetchData } from "../actions/fetch-actons.js";
import { getRandomInt, objectToStyles } from "../utils/utils.js";

const featuredSwiperEl = document.getElementById("featured-products-carousel");
const productCardTemplate = document.getElementById("product-card-template");

const featuredData = await fetchData(1, 10);

const badgeOption = new Map();
badgeOption.set(1, { label: "BESTSELLER", styles: { "background-color": "var(--label-primary)" } });
badgeOption.set(2, {
  label: "LIMITED EDITION",
  styles: { "background-color": "var(--label-secondary)" },
});
badgeOption.set(3, { label: "", styles: { display: "none" } });

const featuredList = featuredData.data.map((item) => {
  const number = getRandomInt(1, 4);

  const badge = badgeOption.get(number);
  const badgeStyles = objectToStyles(badge.styles);

  const productCard = productCardTemplate.content.cloneNode(true);
  const label = productCard.querySelector(".product-card__badge");
  const imgEl = productCard.querySelector("img");
  const titleEl = productCard.querySelector("h2.text-lg");

  label.textContent = badge.label;
  label.style = badgeStyles;

  imgEl.src = item.image;
  imgEl.alt = "Product Image:" + item.id;

  titleEl.textContent = item.text;

  return productCard;
});

featuredSwiperEl.append(...featuredList);
