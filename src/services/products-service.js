class ProductsService {
  static #instance;
  #baseUrl = "https://brandstestowy.smallhost.pl/api/random";
  #productCache = new Map();
  #featuredProductsLength = 10;
  #currentPageSize = 0;

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

  get currentPageSize() {
    return this.#currentPageSize;
  }

  get featuredProductsLength() {
    return this.#featuredProductsLength;
  }

  get productCache() {
    return this.#productCache;
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

  async fetchProducts(pageSize, options = {}) {
    const page = pageSize + this.featuredProductsLength;

    const url = new URL(`?pageNumber=1&pageSize=${page}`, this.#baseUrl);

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();

    if (!data) {
      throw new Error("Failed to fetch product data");
    }

    data.forEach((item) => {
      this.#productCache.set(item.id, item);
    });

    this.#currentPageSize = page;

    return data;
  }
}

export const productsService = new ProductsService();
