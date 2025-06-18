import { fetchService } from "../services/fetch-service.js";

const API_BASE_URL = "https://brandstestowy.smallhost.pl/api/random?pageNumber=2&pageSize=14";

const itemTemplate = document.getElementById("product-listing-item-template");
const dataContainer = document.getElementById("product-listing-container");
const modalEl = document.getElementById("product-modal");
const skeletonTemplate = document.getElementById("product-listing-skeleton-template");

dataContainer.append(
  ...Array.from({ length: 10 }).map(() => skeletonTemplate.content.cloneNode(true)),
);

const listingData = await fetchService.fetch(API_BASE_URL);

dataContainer.querySelectorAll(".product-listing__card").forEach((item) => item.remove()); // Clear skeletons after data is fetched

const listingItems = listingData.data.map((item) => {
  const productItem = itemTemplate.content.cloneNode(true);
  const imgEl = productItem.querySelector("img");
  const badgeEl = productItem.querySelector(".product-listing__badge");
  const rootEl = productItem.querySelector(".product-listing__card");

  rootEl.id = `product-listing-item-${item.id}`;

  imgEl.src = item.image;
  imgEl.alt = "Product Image:" + item.id;

  badgeEl.textContent = `ID: ${item.id}`;

  return productItem;
});

dataContainer.append(...listingItems);

dataContainer.addEventListener("click", (e) => {
  const target = e.target.closest(".product-listing__card");
  if (!target) return;

  const itemId = target.id.split("-").pop();
  const itemData = listingData.data.find((item) => item.id === parseInt(itemId));

  if (!itemData) return;

  modalEl.querySelector("img").src = itemData.image;
  modalEl.querySelector(".modal__badge").textContent = `ID: ${itemData.id}`;
  modalEl.open();
});
