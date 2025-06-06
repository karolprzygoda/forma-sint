const drawerTemplate = document.createElement("template");
drawerTemplate.innerHTML = `
  <style>
    dialog[open] {
      transform: none;
    }
    dialog {
      border: none;
      margin: 0;
      background-color: var(--drawer-background-color, white);
      max-height: 100%;
      max-width: 100%;
      padding: 0;
      inset-inline-start: unset;
      transition:
          transform 0.3s ease-out,
          overlay 0.3s ease-out allow-discrete,
          display 0.3s ease-out allow-discrete;
    }
    dialog[data-position="left"] {
      left: 0;
      top: 0;
      width: var(--drawer-width, 75%);
      height:var(--drawer-height, 100%);
    }
    dialog[data-position="right"] {
      right: 0;
      top: 0;
      width: var(--drawer-width, 75%);
      height:var(--drawer-height, 100%);
    }
    dialog[data-position="top"] {
      top: 0;
      left: 0;
      width: var(--drawer-width, 100%);
      height: var(--drawer-height, 75%);
    }
    dialog[data-position="bottom"] {
      bottom: 0;
      left: 0;
      width: var(--drawer-width, 100%);
      height: var(--drawer-height, 75%);
    }
    dialog[data-position="left"]:not([open]) {
      transform: translateX(-100%);
    }
    dialog[data-position="right"]:not([open]) {
      transform: translateX(100%);
    }
    dialog[data-position="top"]:not([open]) {
      transform: translateY(-100%);
    }
    dialog[data-position="bottom"]:not([open]) {
      transform: translateY(100%);
    }
    @starting-style {
      dialog[data-position="left"][open] {  
        transform: translateX(-100%);
      }
      dialog[data-position="right"][open] {  
        transform: translateX(100%);
      }
      dialog[data-position="top"][open] {  
        transform: translateY(-100%);
      }
      dialog[data-position="bottom"][open] {  
        transform: translateY(100%);
      }
    }
    dialog::backdrop {
      background-color: rgb(0 0 0 / 0%);
      transition:
        display 0.3s allow-discrete,
        overlay 0.3s allow-discrete,
        background-color 0.3s;
    }
    dialog[open]::backdrop {
      background-color: var(--drawer-backdrop,rgb(0 0 0 / 50%));
    }
    @starting-style {
      dialog[open]::backdrop {
        background-color: rgb(0 0 0 / 0%);
      }
    }
  </style>
  <dialog>
    <slot></slot>
  </dialog>
`;

class Drawer extends HTMLElement {
  #drawer;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  #handleBackdropClick = (e) => {
    const rect = this.#drawer.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;
    if (!isInDialog) {
      this.close();
    }
  };

  #handleAnchorClick = (e) => {
    const anchorTag = e.target;

    if (!anchorTag.matches("a") && !anchorTag.hash) return;

    const hash = anchorTag.hash.slice(1);
    const targetElement = document.getElementById(hash);

    if (!targetElement) return;

    e.preventDefault();
    this.close();
    history.replaceState(null, "", `#${hash}`);
    targetElement.scrollIntoView({ behavior: "smooth" });
  };

  connectedCallback() {
    this.shadowRoot.appendChild(drawerTemplate.content.cloneNode(true));
    this.#drawer = this.shadowRoot.querySelector("dialog");
    this.#drawer.setAttribute("data-position", this.getAttribute("position") || "right");
    this.#drawer.addEventListener("click", this.#handleBackdropClick);
    this.#drawer.addEventListener("click", this.#handleAnchorClick);

    if (this.hasAttribute("open")) {
      this.open();
    }
  }

  disconnectedCallback() {
    this.#drawer.removeEventListener("click", this.#handleBackdropClick);
    this.#drawer.removeEventListener("click", this.#handleAnchorClick);
  }

  open() {
    document.body.style.overflow = "hidden";
    this.#drawer.showModal();
  }

  close() {
    this.#drawer.close();
    document.body.style.overflow = "";
  }
}

customElements.define("drawer-panel", Drawer);
