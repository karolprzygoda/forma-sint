const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
      <style>
        dialog[open] {
          transform: scale(1);
          opacity: 1;
        }
        dialog {
          border: none;
          border-radius: 0.375rem;
          background-color: var(--modal-background-color, white);
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
          width: var(--modal-width, 100%);
          height: var(--modal-height, 100%);
          min-width: var(--modal-min-width, 320px);
          min-height: var(--modal-min-height, 420px);
          max-height: var(--modal-max-height, 620px);
          max-width: var(--modal-max-width, 840px);
          display: flex;
        }
        ::slotted(*){
          flex: 1;
        }
      </style>
      <dialog>
        <div class="wrapper">
          <slot name="close-button"></slot>
          <slot></slot>
        </div>
      </dialog>
    `;

class Modal extends HTMLElement {
  #modal;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    document.body.style.overflow = "hidden";
  };

  #handleEnableScroll = () => {
    document.body.style.overflow = "";
  };

  open = () => {
    this.#handleDisableScroll();
    this.#modal.showModal();
  };

  close = () => {
    this.#modal.close();
  };

  connectedCallback() {
    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
    this.#modal = this.shadowRoot.querySelector("dialog");
    this.#modal.addEventListener("click", this.#handleBackdropClick);
    this.#modal.addEventListener("close", this.#handleEnableScroll);

    if (this.hasAttribute("open")) {
      this.open();
    }
  }

  disconnectedCallback() {
    this.#modal.removeEventListener("click", this.#handleBackdropClick);
    this.#modal.removeEventListener("close", this.#handleEnableScroll);
  }
}

customElements.define("modal-panel", Modal);
