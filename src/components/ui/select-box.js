const selectBoxTemplate = document.createElement("template");
selectBoxTemplate.innerHTML = `
    <style>
      *{
        box-sizing: border-box;
      }
      :host {
        position: relative;
      }
      :host([open]) .trigger{
        border-color: var(--secondary) ;
      }
      :host([open]) .items-wrapper {
        display: flex;
      }
      :host([open]) .trigger-content{
       border-color: #1d1d1d;
      }
      .trigger {
        background-color: transparent;
        border: transparent 1px solid;
        border-radius: 0.375rem;
        border-bottom: none;
        width: 100%;
        padding: 0.75rem;
        cursor: pointer;
      }
      .trigger-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        width: 100%;
        border-bottom: transparent 1px solid;
      }
      .trigger-content::after{
        content: url("data:image/svg+xml, %3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11.6998 13.2484L16.2998 8.64844L17.3535 9.70219L11.6998 15.3559L6.04601 9.70219L7.09976 8.64844L11.6998 13.2484Z' fill='%231D1D1D'/%3E%3C/svg%3E");
        width: 24px;
        height: 24px;
      }
      .items-wrapper {
        background-color: white;
        top: calc(100% - 0.75rem);
        border: var(--secondary) 1px solid;
        border-top: none;
        border-bottom-left-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 100;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
      }
    </style>
    <button part="trigger" class="trigger">
     <span class="trigger-content"></span>
    </button>
    <div part="items-wrapper" role="listbox" class="items-wrapper">
      <slot></slot>
    </div>
`;

class SelectBox extends HTMLElement {
  #isOpen = false;
  #abortController = new AbortController();
  #selectBoxTrigger;
  #selectBoxTriggerContent;
  #value;
  #selectedItem;
  #onOpen;
  #onClose;
  #onChange;
  #focusableElements;
  #childObserver;

  static #focusableSelectors = [
    "button:not([disabled]):not([selected])",
    "input:not([disabled]):not([selected])",
    "textarea:not([disabled]):not([selected])",
    "select:not([disabled]):not([selected])",
    "a[href]:not([selected])",
    '[tabindex]:not([tabindex="-1"]):not([selected])',
    "details:not([selected])",
    "summary:not([selected])",
  ].join(",");
  static observedAttributes = ["open"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get value() {
    return this.#value;
  }

  set value(val) {
    if (typeof val === "string" || typeof val === "number") {
      const availableItems = this.querySelectorAll("select-box-item");

      const newSelectedItem = Array.from(availableItems).find(
        (item) => item.value === val || item.getAttribute("value") === String(val),
      );

      if (newSelectedItem) {
        this.#updateSelectedItem(newSelectedItem);
      }
    } else {
      console.warn("Value must be a string or number");
    }
  }

  get selectedItem() {
    return this.#selectedItem;
  }

  get isOpen() {
    return this.#isOpen;
  }

  set onOpen(callback) {
    if (typeof callback === "function") {
      this.#onOpen = callback;
    } else {
      console.warn("onOpen must be a function");
    }
  }

  set onClose(callback) {
    if (typeof callback === "function") {
      this.#onClose = callback;
    } else {
      console.warn("onClose must be a function");
    }
  }

  set onChange(callback) {
    if (typeof callback === "function") {
      this.#onChange = callback;
    } else {
      console.warn("onChange must be a function");
    }
  }

  #handleDismiss = (e) => {
    if (!this.contains(e.target) && this.#isOpen) {
      this.close();
    }
  };

  #handleFocusTrap = () => {
    if (this.#isOpen) {
      this.#focusableElements[0].focus();
    } else {
      this.#selectBoxTrigger.focus();
    }
  };

  #updateSelectedItem = (item) => {
    this.#selectedItem.removeAttribute("selected");
    this.#selectedItem = item;
    this.#selectedItem.setAttribute("selected", "");
    this.#value = item.value ?? item.getAttribute("value");
    this.#selectBoxTriggerContent.textContent = item.textContent;
  };

  #updateFocusableElements = () => {
    this.#focusableElements = this.querySelectorAll(SelectBox.#focusableSelectors);
  };

  #handleSelectItem = (e) => {
    const item = e.target.closest("select-box-item");
    if (!item) return;

    this.#updateSelectedItem(item);
    this.#onChange?.();
    this.close();
  };

  #handleKeydown = (e) => {
    const { key, shiftKey } = e;
    const elements = this.#focusableElements;
    const isOpen = this.#isOpen;
    const activeIndex = Array.from(elements).indexOf(document.activeElement);

    if (["ArrowDown", "ArrowUp", "Escape", "Enter"].includes(key)) {
      e.preventDefault();
    }

    if (key === "Escape") {
      return this.close();
    }

    if (key === "Enter") {
      return this.#handleSelectItem(e);
    }

    let navKeyValue = 0;
    if (key === "ArrowDown") navKeyValue = 1;
    if (key === "ArrowUp") navKeyValue = -1;
    if (key === "Tab") navKeyValue = shiftKey ? -1 : 1;

    if (navKeyValue !== 0) {
      if (!isOpen && key !== "Tab") {
        return this.open();
      }

      if (key === "Tab" && !isOpen) {
        return;
      }

      e.preventDefault();
      const nextIdx = (activeIndex + navKeyValue + elements.length) % elements.length;
      elements[nextIdx].focus();
    }
  };

  #addEventListeners() {
    const { signal } = this.#abortController;

    this.#selectBoxTrigger.addEventListener("click", this.toggle, { signal });
    this.addEventListener("click", this.#handleSelectItem, { signal });
    this.addEventListener("keydown", this.#handleKeydown, { signal });
    document.addEventListener("click", this.#handleDismiss, { signal });

    this.shadowRoot
      .querySelector("slot")
      .addEventListener("slotchange", this.#updateFocusableElements, { once: true });
    this.#childObserver = new MutationObserver(this.#updateFocusableElements);
    this.#childObserver.observe(this, {
      childList: true,
      subtree: true,
    });
  }

  #removeEventListeners() {
    this.#abortController.abort();
    this.#childObserver.disconnect();
  }

  open = () => {
    this.#onOpen?.();
    this.setAttribute("open", "");
  };

  close = () => {
    this.#onClose?.();
    this.removeAttribute("open");
  };

  toggle = () => {
    this.toggleAttribute("open");
    if (this.#isOpen) {
      this.#onOpen?.();
    } else {
      this.#onClose?.();
    }
  };

  connectedCallback() {
    this.shadowRoot.appendChild(selectBoxTemplate.content.cloneNode(true));
    this.#selectBoxTrigger = this.shadowRoot.querySelector(".trigger");
    this.#selectBoxTriggerContent = this.shadowRoot.querySelector(".trigger-content");
    this.#selectedItem = this.querySelector("select-box-item");

    this.#updateSelectedItem(this.#selectedItem);
    this.#addEventListeners();
  }

  disconnectedCallback() {
    this.#removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      this.#isOpen = newValue !== null;
      this.#handleFocusTrap();
    }
  }
}

const selectBoxItemTemplate = document.createElement("template");
selectBoxItemTemplate.innerHTML = `
   <style>
      *{
        box-sizing: border-box;
      }
      :host {
        padding: 0 0.75rem !important;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      :host([selected]){
        display: none;
      }
      :host(:hover) {
        background-color: var(--secondary);
      }
      :host(:last-child) .content{
        border-bottom: none;
      }
      .content {
        border-bottom: var(--secondary) 1px solid;
        width: 100%;
        padding: 0.375rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
   </style>
   <div role="option" class="content">
     <slot></slot>
   </div>
`;

class SelectBoxItem extends HTMLElement {
  #value;
  #textContent;

  static observedAttributes = ["value", "selected"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get value() {
    return this.#value;
  }

  get textContent() {
    return this.#textContent;
  }

  set value(val) {
    this.#value = val;
  }

  set textContent(text) {
    this.#textContent = text;
  }

  connectedCallback() {
    this.shadowRoot.appendChild(selectBoxItemTemplate.content.cloneNode(true));
    this.#value = this.getAttribute("value") || "";
    this.tabIndex = 0;

    const slot = this.shadowRoot.querySelector("slot");
    const assignedNodes = slot.assignedNodes();

    if (assignedNodes.length > 0) {
      this.#textContent = assignedNodes[0].textContent.trim();
    }
  }
}

customElements.define("select-box", SelectBox);
customElements.define("select-box-item", SelectBoxItem);
