class ParamsService {
  static #instance;
  #url = new URL(window.location.href);

  constructor() {
    if (ParamsService.#instance) {
      return ParamsService.#instance;
    }
    ParamsService.#instance = this;
  }

  static get instance() {
    if (!ParamsService.#instance) {
      ParamsService.#instance = new ParamsService();
    }
    return ParamsService.#instance;
  }

  get url() {
    return this.#url;
  }

  getParam(param) {
    return this.#url.searchParams.get(param);
  }

  setParam(param, value) {
    this.#url.searchParams.set(param, value);
    window.history.pushState({}, "", this.#url.toString());
  }

  deleteParam(param) {
    this.#url.searchParams.delete(param);
    window.history.pushState({}, "", this.#url.toString());
  }

  hasParam(param) {
    return this.#url.searchParams.has(param);
  }

  clearParams() {
    this.#url.search = "";
    window.history.pushState({}, "", this.#url.toString());
  }

  getAllParams() {
    const params = {};
    for (const [key, value] of this.#url.searchParams.entries()) {
      params[key] = value;
    }
    return params;
  }
}

export const paramsService = new ParamsService();
