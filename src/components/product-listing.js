import { paramsService } from "../services/params-service.js";
import { productsService } from "../services/products-service.js";

const INITIAL_PAGE_NUMBER = 2;

const itemTemplate = document.getElementById("product-listing-item-template");
const dataContainer = document.getElementById("product-listing-container");
const skeletonTemplate = document.getElementById("product-listing-skeleton-template");
const productSelect = document.getElementById("product-listing-select-box");

if (paramsService.hasParam("page-size")) {
  productSelect.value = paramsService.getParam("page-size");
}

if (!paramsService.hasParam("page-size")) {
  paramsService.setParam("page-size", productSelect.value);
}

const renderProducts = (data) => {
  const productCardList = data.map((item) => {
    const productItem = itemTemplate.content.cloneNode(true);
    const imgEl = productItem.querySelector("img");
    const badgeEl = productItem.querySelector(".product-listing__badge");
    const rootEl = productItem.querySelector(".product-listing__card");

    rootEl.id = `product-listing-item-${item.id}`;

    imgEl.src = item.image;
    imgEl.alt = "Product Image:" + item.id;
    imgEl.loading = "lazy";

    badgeEl.textContent = `ID: ${item.id}`;

    return productItem;
  });

  dataContainer.append(...productCardList);
};

const refreshProductList = async () => {
  const desiredItemsNumber = parseInt(productSelect.value, 10);
  const currentItemsNumber = dataContainer.querySelectorAll(".product-listing__card").length;
  const pageSize = productsService.pageSize;

  paramsService.setParam("page-size", desiredItemsNumber);

  if (desiredItemsNumber < currentItemsNumber) {
    for (let i = currentItemsNumber; i > desiredItemsNumber; i--) {
      dataContainer.removeChild(dataContainer.lastElementChild);
    }
  } else {
    const iterations = Math.ceil(desiredItemsNumber / pageSize);
    const params = [];

    for (let i = 0, pageNumber = INITIAL_PAGE_NUMBER; i < iterations; i++, pageNumber++) {
      params.push([pageNumber, dataContainer, skeletonTemplate]);
    }

    productsService.appendSkeletons(
      dataContainer,
      skeletonTemplate,
      desiredItemsNumber - (currentItemsNumber === 0 ? pageSize : currentItemsNumber),
    );

    const results = await Promise.all(
      params.map((promise) => productsService.fetchProducts(...promise)),
    );

    productsService.removeSkeletons(dataContainer);

    const data = results.flat().slice(currentItemsNumber, desiredItemsNumber);

    renderProducts(data);
  }
};

productSelect.onChange = refreshProductList;

export default async function initializeProductListing() {
  await refreshProductList();
}
