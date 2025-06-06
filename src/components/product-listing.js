import { fetchData } from "../actions/fetch-actons.js";

const listingData = await fetchData(2, 14);
const listingItemTemplate = document.getElementById("product-listing-item-template");
const listingEl = document.getElementById("product-listing-container");

const listingItems = listingData.data.map((item) => {
  const productItem = listingItemTemplate.content.cloneNode(true);
  const imgEl = productItem.querySelector("img");
  const badgeEl = productItem.querySelector(".product-listing__badge");

  imgEl.src = item.image;
  imgEl.alt = "Product Image:" + item.id;

  badgeEl.textContent = `ID: ${item.id}`;

  return productItem;
});

listingEl.append(...listingItems);
