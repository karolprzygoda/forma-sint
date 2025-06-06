const ANIMATION_OPTIONS = {
  duration: 300,
  easing: "ease-out",
  fill: "forwards",
};

const ANIMATIONS = {
  right: {
    in: [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }],
    out: [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
  },
  left: {
    in: [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
    out: [{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }],
  },
  top: {
    in: [{ transform: "translateY(-100%)" }, { transform: "translateY(0)" }],
    out: [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }],
  },
  bottom: {
    in: [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
    out: [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
  },
};

const FADE_IN = [{ opacity: 0 }, { opacity: 1 }];
const FADE_OUT = [{ opacity: 1 }, { opacity: 0 }];

const offcanvasTemplate = document.createElement("template");
offcanvasTemplate.innerHTML = `
  <style>
  :host {
      position: fixed;    
      inset: 0;           
      display: block;     
      z-index: var(--offcanvas-z-index, 100);       
    }
  .backdrop {
      position: absolute;
      inset: 0; 
      width: 100%;
      height: 100%;
      background-color: var(--offcanvas-backdrop-color, rgba(0, 0, 0, 0.5));
      z-index: var(--offcanvas-backdrop-z-index, 100);
  }
  .offcanvas {
     position: absolute;
     background-color: var(--offcanvas-background, white);
     z-index: var(--offcanvas-panel-z-index, 200);
     outline: none;
  }
  .offcanvas[data-position="right"] {
     right: 0;
     top: 0;
     bottom: 0;
     width: var(--offcanvas-width, 75%);
     border-left: 1px solid var(--offcanvas-border-color, #ccc);
  }
  .offcanvas[data-position="left"] {
     left: 0;
     top: 0;
     bottom: 0;
     width: var(--offcanvas-width, 75%);
     border-right: 1px solid var(--offcanvas-border-color, #ccc);
  }
  .offcanvas[data-position="top"] {
     top: 0;
     left: 0;
     right: 0;
     height: var(--offcanvas-height, 30%);
     border-bottom: 1px solid var(--offcanvas-border-color, #ccc);
  }
  .offcanvas[data-position="bottom"] {
     bottom: 0;
     left: 0;
     right: 0;
     height: var(--offcanvas-height, 30%);
     border-top: 1px solid var(--offcanvas-border-color, #ccc);
  }
  .header{
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

  }
  .close-button {
      font-family: Inter, sans-serif;
      font-size: 1rem;
      font-weight: 500;
      margin-left: auto;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
  }
  </style>
  <div class="backdrop" role="presentation" aria-hidden="true"></div>
  <div class="offcanvas" role="dialog" aria-modal="true" aria-labelledby="offcanvas-title" tabindex="-1">
  <div class="header">
   <slot name="header"></slot>
    <button class="close-button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.39994 18.6538L5.34619 17.6L10.9462 12L5.34619 6.4L6.39994 5.34625L11.9999 10.9463L17.5999 5.34625L18.6537 6.4L13.0537 12L18.6537 17.6L17.5999 18.6538L11.9999 13.0538L6.39994 18.6538Z" fill="#1D1D1D"/>
      </svg>
      <span>Close</span>
    </button>
    </div>
    <slot name="content"></slot>
  </div>
`;

class OffcanvasPanel extends HTMLElement {
  #backdrop;
  #offcanvas;
  #focusableElements;
  #firstFocusableElement;
  #lastFocusableElement;
  #previouslyFocusedElement;
  #contentTemplate;
  #position;
  #isOpen = false;

  static #validPositions = new Set(["right", "left", "top", "bottom"]);
  static #focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
    "details",
    "summary",
  ].join(",");

  constructor(contentTemplate, position) {
    super();
    this.attachShadow({ mode: "open" });
    this.#contentTemplate = contentTemplate;
    this.#position = OffcanvasPanel.#validPositions.has(position) ? position : "right";
  }

  get isOpen() {
    return this.#isOpen;
  }

  #updateFocusableElements() {
    const shadowFocusable = Array.from(
      this.shadowRoot.querySelectorAll(OffcanvasPanel.#focusableSelectors),
    );
    const lightFocusable = Array.from(this.querySelectorAll(OffcanvasPanel.#focusableSelectors));

    this.#focusableElements = [...shadowFocusable, ...lightFocusable];
    this.#firstFocusableElement = this.#focusableElements[0] || null;
    this.#lastFocusableElement =
      this.#focusableElements[this.#focusableElements.length - 1] || null;
  }

  #trapFocus() {
    this.#updateFocusableElements();

    if (this.#firstFocusableElement) {
      this.#firstFocusableElement.focus();
    } else {
      this.#offcanvas.focus();
    }
  }

  #restoreFocus() {
    if (document.contains(this.#previouslyFocusedElement)) {
      this.#previouslyFocusedElement.focus();
    }
  }

  #handleAnchorClick = (e) => {
    const anchorTag = e.target;

    if (!anchorTag.matches("a") && !anchorTag.hash) return;

    const hash = anchorTag.hash.slice(1);
    const targetElement = document.getElementById(hash);

    if (!targetElement) return;

    e.preventDefault();
    this.close().then(() => {
      history.replaceState(null, "", `#${hash}`);
      targetElement.scrollIntoView({ behavior: "smooth" });
    });
  };

  #handleTabNavigation = (e) => {
    this.#updateFocusableElements();

    if (this.#focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    if (this.#focusableElements.length === 1) {
      e.preventDefault();
      this.#firstFocusableElement.focus();
      return;
    }

    const isTabBackward = e.shiftKey;
    const activeElement = document.activeElement;

    if (!this.contains(activeElement) && !this.#offcanvas.contains(activeElement)) {
      e.preventDefault();
      this.#firstFocusableElement.focus();
      return;
    }

    if (isTabBackward && activeElement === this.#firstFocusableElement) {
      e.preventDefault();
      this.#lastFocusableElement.focus();
      return;
    }

    if (!isTabBackward && activeElement === this.#lastFocusableElement) {
      e.preventDefault();
      this.#firstFocusableElement.focus();
    }
  };

  #handleKeyDown = (e) => {
    if (!this.#isOpen) return;

    if (e.key === "Escape") {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === "Tab") {
      this.#handleTabNavigation(e);
    }
  };

  #handleBackdropClick = (e) => {
    if (e.target === this.#backdrop) {
      this.close();
    }
  };

  async close() {
    if (!this.#isOpen) return;

    this.#isOpen = false;

    try {
      const backdropAnim = this.#backdrop.animate(FADE_OUT, ANIMATION_OPTIONS);
      const panelAnim = this.#offcanvas.animate(ANIMATIONS[this.#position].out, ANIMATION_OPTIONS);
      await Promise.all([backdropAnim.finished, panelAnim.finished]);
    } catch (error) {
      console.error("Animation failed:", error);
    } finally {
      this.remove();
    }
  }

  open() {
    if (this.#isOpen) return;

    this.#isOpen = true;
    this.#previouslyFocusedElement = document.activeElement;

    this.shadowRoot.append(offcanvasTemplate.content.cloneNode(true));
    this.append(this.#contentTemplate.content.cloneNode(true));

    this.#backdrop = this.shadowRoot.querySelector(".backdrop");
    this.#offcanvas = this.shadowRoot.querySelector(".offcanvas");
    this.#offcanvas.setAttribute("data-position", this.#position);

    document.body.append(this);
  }

  connectedCallback() {
    if (!this.#isOpen) return;

    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", this.#handleKeyDown);
    this.#backdrop.addEventListener("click", this.#handleBackdropClick);
    this.#offcanvas.addEventListener("click", this.#handleAnchorClick);

    this.#backdrop.animate(FADE_IN, ANIMATION_OPTIONS);
    this.#offcanvas.animate(ANIMATIONS[this.#position].in, ANIMATION_OPTIONS);

    this.#trapFocus();
  }

  disconnectedCallback() {
    document.body.style.overflow = "";

    document.removeEventListener("keydown", this.#handleKeyDown);
    this.#backdrop.removeEventListener("click", this.#handleBackdropClick);
    this.#offcanvas.removeEventListener("click", this.#handleAnchorClick);

    this.#restoreFocus();
    this.#isOpen = false;
  }
}

const offcanvasTriggerTemplate = document.createElement("template");
offcanvasTriggerTemplate.innerHTML = `
  <style>
    button {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
  </style>
  <button>
    <slot></slot>
  </button>
`;

class OffcanvasTrigger extends HTMLElement {
  #button;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["target-id", "target-position", "disabled"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      this.#updateDisabledState();
    }
  }

  #updateDisabledState() {
    if (this.#button) {
      this.#button.disabled = this.hasAttribute("disabled");
    }
  }

  #onClick = (e) => {
    e.preventDefault();

    const targetId = this.getAttribute("target-id");
    if (!targetId) {
      console.error("No target-id attribute specified for offcanvas trigger");
      return;
    }

    const offcanvasContentTemplate = document.getElementById(targetId);
    if (!offcanvasContentTemplate || offcanvasContentTemplate.tagName !== "TEMPLATE") {
      console.error(
        `Offcanvas content template with id "${targetId}" not found or is not a template element.`,
      );
      return;
    }

    const targetPosition = this.getAttribute("target-position") || "right";

    const offcanvas = new OffcanvasPanel(offcanvasContentTemplate, targetPosition);
    offcanvas.open();
  };

  connectedCallback() {
    this.shadowRoot.append(offcanvasTriggerTemplate.content.cloneNode(true));
    this.#button = this.shadowRoot.querySelector("button");
    this.#updateDisabledState();
    this.addEventListener("click", this.#onClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.#onClick);
  }
}

customElements.define("offcanvas-trigger", OffcanvasTrigger);
customElements.define("offcanvas-panel", OffcanvasPanel);
