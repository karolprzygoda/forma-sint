class FetchService {
  static #instance;
  #cache;

  constructor() {
    if (FetchService.#instance) {
      return FetchService.#instance;
    }
    FetchService.#instance = this;
    this.#cache = new Map();
  }

  static get instance() {
    if (!FetchService.#instance) {
      FetchService.#instance = new FetchService();
    }
    return FetchService.#instance;
  }

  get cache() {
    return this.#cache;
  }

  clearCache() {
    this.#cache = new Map();
  }

  async fetch(url, options = {}) {
    try {
      const key = url + JSON.stringify(options);
      const cached = this.#cache.get(key);

      if (cached) {
        return cached;
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      this.#cache.set(key, data);

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
}

export const fetchService = new FetchService();
