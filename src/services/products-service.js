import { fetchService } from "./fetch-service.js";

class ProductsService {
  static #instance;
  #baseUrl = "https://brandstestowy.smallhost.pl/api/random";
  #pageSize = 14;
  #productCache = new Map();

  constructor() {
    if (ProductsService.#instance) {
      return ProductsService.#instance;
    }

    ProductsService.#instance = this;
  }

  static get instance() {
    if (!ProductsService.#instance) {
      ProductsService.#instance = new ProductsService();
    }
    return ProductsService.#instance;
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  get pageSize() {
    return this.#pageSize;
  }

  get productCache() {
    return this.#productCache;
  }

  set pageSize(size) {
    if (typeof size === "number" && size > 0) {
      this.#pageSize = size;
    } else {
      console.warn("Page size must be a positive number");
    }
  }

  #clearCache() {
    this.#productCache.clear();
  }

  appendSkeletons = (container, skeletonTemplate, number) => {
    container.append(
      ...Array.from({ length: number }).map(() => skeletonTemplate.content.cloneNode(true)),
    );
  };

  removeSkeletons = (container) => {
    container.querySelectorAll("[data-product-skeleton]").forEach((item) => item.remove());
  };

  async fetchProducts(pageNumber) {
    const url = new URL(`?pageNumber=${pageNumber}&pageSize=${this.#pageSize}`, this.#baseUrl);

    const response = await fetchService.fetch(url);

    if (!response || !response.data) {
      throw new Error("Failed to fetch product data");
    }

    response.data.forEach((item) => {
      this.#productCache.set(item.id, item);
    });

    return response.data;
  }
}

export const productsService = new ProductsService();
