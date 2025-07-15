import { paramsService } from "../services/params-service.js";
import { productsService } from "../services/products-service.js";

const productModal = document.getElementById("product-modal");
const productImage = productModal.querySelector("img");
const productBadge = productModal.querySelector(".modal__badge");

const renderModal = (productData) => {
  productImage.src = productData.image;
  productImage.alt = `Product Image: ${productData.id}`;

  productBadge.textContent = `ID: ${productData.id}`;

  productModal.open();
};

productModal.onClose = () => paramsService.deleteParam("product-id");

document.body.addEventListener("click", (e) => {
  const target = e.target.closest("[data-product]");

  if (!target) return;

  e.preventDefault();
  const productId = target.id.split("-").pop();
  const productData = productsService.productCache.get(parseInt(productId));

  if (!productData) return;

  paramsService.setParam("product-id", productData.id);

  renderModal(productData);
});

export { renderModal };
