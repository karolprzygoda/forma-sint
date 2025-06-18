import { getRandomInt, objectToStyles } from "../utils/utils.js";
import { fetchService } from "../services/fetch-service.js";

const API_BASE_URL = "https://brandstestowy.smallhost.pl/api/random?pageNumber=1&pageSize=10";

const dataContainer = document.getElementById("featured-products-carousel");
const cardTemplate = document.getElementById("product-card-template");
const skeletonTemplate = document.getElementById("product-card-skeleton-template");

dataContainer.append(
  ...Array.from({ length: 10 }).map(() => skeletonTemplate.content.cloneNode(true)),
);

const featuredData = await fetchService.fetch(API_BASE_URL);

dataContainer.querySelectorAll(".product-card").forEach((item) => item.remove()); // Clear skeletons after data is fetched

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

  const productCard = cardTemplate.content.cloneNode(true);
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

dataContainer.append(...featuredList);

dataContainer.addEventListener("click", (e) => {});
