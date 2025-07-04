const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
      <style>
        dialog[open] {
          transform: scale(1);
          opacity: 1;
          /*adds padding right to prevent layout shift when scrollbar disappears so background color and border radius id assed to wrapper*/
          scrollbar-gutter: stable; 
        }
        dialog {
          border: none;
          background-color: transparent;
          padding: 0;
          transform: scale(0.8);
          opacity: 0;
          transition:
              transform var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out),
              opacity var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out),
              overlay var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out) allow-discrete,
              display var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out) allow-discrete;
        }
        dialog::backdrop {
          background-color: rgb(0 0 0 / 0%);
          transition:
            display var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out) allow-discrete,
            overlay var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out) allow-discrete,
            background-color var(--modal-transition-duration, 0.3s) var(--modal-timing-fucntion, ease-out);
        }
        dialog[open]::backdrop {
          background-color: var(--modal-backdrop,rgb(0 0 0 / 50%));
        }
        @starting-style {
          dialog[open] {
            transform: scale(0.8);
            opacity: 0;
          }
          dialog[open]::backdrop {
            background-color: rgb(0 0 0 / 0%);
          }
        }
        .wrapper {
          border-radius: 0.375rem;
          background-color: var(--modal-background-color, white);
          width: var(--modal-width, 100%);
          height: var(--modal-height, 100%);
          min-width: var(--modal-min-width, 320px);
          min-height: var(--modal-min-height, 420px);
          max-height: var(--modal-max-height, 620px);
          max-width: var(--modal-max-width, 840px);
          display: flex;
        }
      </style>
      <dialog part="modal">
        <div part="content-wrapper" class="wrapper">
          <slot></slot>
        </div>
      </dialog>
    `;

class Modal extends HTMLElement {
  #modal;
  #abortController = new AbortController();
  #isOpen = false;
  #onOpen;
  #onClose;

  static observedAttributes = ["open"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  get modal() {
    return this.#modal;
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

  #handleBackdropClick = (e) => {
    const rect = this.#modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;
    if (!isInDialog) {
      this.close();
    }
  };

  #handleDisableScroll = () => {
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    document.body.style.overflow = "hidden";
  };

  #handleEnableScroll = () => {
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
  };

  #setUpOnClickCallbacks = (e) => {
    this.#handleBackdropClick(e);

    const target = e.target.closest("[data-close-button]");

    if (target) {
      this.close();
    }
  };

  #setUpOnCloseCallbacks = (e) => {
    this.#onClose?.(e);
    this.#handleEnableScroll();
    this.removeAttribute("open");
  };

  #setUpEventListeners = () => {
    const { signal } = this.#abortController;
    this.#modal.addEventListener("click", this.#setUpOnClickCallbacks, { signal });
    this.#modal.addEventListener("close", this.#setUpOnCloseCallbacks, { signal });
  };

  #removeEventListeners = () => {
    this.#abortController.abort();
  };

  open = () => {
    this.#onOpen?.();
    this.#handleDisableScroll();
    this.#modal.showModal();
    this.setAttribute("open", "");
  };

  close = () => {
    this.#modal.close();
  };

  connectedCallback() {
    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
    this.#modal = this.shadowRoot.querySelector("dialog");
    this.#setUpEventListeners();

    if (this.isOpen) {
      this.open();
    }
  }

  disconnectedCallback() {
    this.#removeEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      this.#isOpen = newValue !== null;
    }
  }
}

customElements.define("modal-panel", Modal);
