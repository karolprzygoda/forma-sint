const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
      <style>
        dialog[open] {
          transform: scale(1);
          opacity: 1;
        }
        dialog {
          border: none;
          background-color: var(--modal-background-color, white);
          padding: 0;
          transform: scale(0.8);
          opacity: 0;
          transition:
              transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.3s ease-out,
              overlay 0.3s ease-out allow-discrete,
              display 0.3s ease-out allow-discrete;
        }
        dialog::backdrop {
          background-color: rgb(0 0 0 / 0%);
          transition:
            display 0.3s allow-discrete,
            overlay 0.3s allow-discrete,
            background-color 0.3s;
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
      </style>
      <dialog >
        <slot></slot>
      </dialog>
    `;

class Modal extends HTMLElement {
  modal;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  #handleBackdropClick = (e) => {
    const rect = this.modal.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;
    if (!isInDialog) {
      this.close();
    }
  };

  connectedCallback() {
    this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
    this.modal = this.shadowRoot.querySelector("dialog");
    this.modal.addEventListener("click", this.#handleBackdropClick);

    if (this.hasAttribute("open")) {
      this.open();
    }
  }

  disconnectedCallback() {
    this.modal.removeEventListener("click", this.#handleBackdropClick);
  }

  open() {
    document.body.style.overflow = "hidden";
    this.modal.showModal();
  }

  close() {
    this.modal.close();
    document.body.style.overflow = "";
  }
}

customElements.define("modal-panel", Modal);
