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

  async fetch(url, options = {}) {
    try {
      const key = url + JSON.stringify(options);
      const cached = this.#cache.get(key);

      if (cached) {
        return cached;
      }

      //create artificial delay for demonstration purposes
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.#cache.set(key, response);

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  clearCache() {
    this.#cache = new Map();
  }
}

export const fetchService = new FetchService();
