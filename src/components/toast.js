const toastTemplate = document.createElement("template");
toastTemplate.innerHTML = `
    <style>
      :host(:popover-open) {
        transform: translate(var(--toast-transform-x), 0);
      }
      
      :host {
        pointer-events: auto;
        background: var(--toast-bg, #ffffff);
        border: 1px solid var(--toast-border, #e5e7eb);
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        padding: 8px 12px !important;
        min-width: 300px;
        max-width: 400px;
        inset: unset;
        color: var(--toast-text, #374151);
        transform: translate(var(--toast-transform-x), var(--toast-transform-y));
        transition: all var(--toast-transition-duration, 0.3s) var(--toast-timing-fucntion, cubic-bezier(0.4, 0, 0.2, 1)) allow-discrete;
      }

      .toast-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
      }

      .toast-title {
        font-weight: 600;
        font-size: 16px;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .toast-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .toast-close {
        width: 24px;
        height: 24px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: var(--toast-close-color, #6b7280);
        transition: color 0.2s ease;
      }

      .toast-close:hover {
        color: var(--toast-close-hover-color, #374151);
        background-color: var(--toast-close-hover-bg, #f3f4f6);
      }

      .toast-message {
        margin: 0;
        color: var(--toast-message-color, #6b7280);
        font-size: 14px;
      }
      
      .toast-icon svg {
        width: 100%;
        height: 100%;
      }
      
      .toast-close svg{
        width: 100%;
        height: 100%;
      }
      
      /* Type-specific styles */
      :host([data-type="success"]) {
        --toast-bg: #f0fdf4;
        --toast-border: #bbf7d0;
        --toast-text: #166534;
        --toast-close-color: #16a34a;
        --toast-close-hover-color: #15803d;
        --toast-close-hover-bg: #dcfce7;
      }

      :host([data-type="error"]) {
        --toast-bg: #fef2f2;
        --toast-border: #fecaca;
        --toast-text: #991b1b;
        --toast-close-color: #dc2626;
        --toast-close-hover-color: #b91c1c;
        --toast-close-hover-bg: #fee2e2;
      }

      :host([data-type="warning"]) {
        --toast-bg: #fffbeb;
        --toast-border: #fed7aa;
        --toast-text: #92400e;
        --toast-close-color: #ea580c;
        --toast-close-hover-color: #c2410c;
        --toast-close-hover-bg: #fef3c7;
      }

      :host([data-type="info"]) {
        --toast-bg: #eff6ff;
        --toast-border: #bfdbfe;
        --toast-text: #1e40af;
        --toast-close-color: #3b82f6;
        --toast-close-hover-color: #2563eb;
        --toast-close-hover-bg: #dbeafe;
      }

      /* Position styles */
      :host([position="top-left"]) {
        top: 16px;
        left: 16px;
        --toast-transform-y: -150%;
        --toast-transform-x: 0;
      }

      :host([position="top-right"]) {
        top: 16px;
        right: 16px;
        --toast-transform-y: -150%;
        --toast-transform-x: 0;
      }

      :host([position="top-center"]) {
        top: 16px;
        left: 50%;
        --toast-transform-y: -150%;
        --toast-transform-x: -50%;
      }

      :host([position="bottom-left"]) {
        bottom: 16px;
        left: 16px;
        --toast-transform-y: 150%;
        --toast-transform-x: 0;
      }

      :host([position="bottom-right"]) {
        bottom: 16px;
        right: 16px;
        --toast-transform-y: 150%;
        --toast-transform-x: 0;
      }

      :host([position="bottom-center"]) {
        bottom: 16px;
        left: 50%;
        --toast-transform-x: -50%;
        --toast-transform-y: 150%;
      }
      
      @starting-style {
        :host(:popover-open){
          transform: translate(var(--toast-transform-x), var(--toast-transform-y))
        }
      }
      
      @media (max-width: 1024px) {
        :host(:popover-open) {
          transform: translate(-50%, 0);
        }
      
        :host{
          transform: translate(-50%, var(--toast-transform-y))
        }
  
        :host([position="top-left"]),
        :host([position="top-right"]),
        :host([position="bottom-left"]),
        :host([position="bottom-right"]) {
          left: 50%;
        }
        
        @starting-style {
          :host(:popover-open){
            transform: translate(-50%, var(--toast-transform-y))
          }
        }
      }  
      </style>
      <div class="toast-header">
        <h4 class="toast-title">
          <span class="toast-icon"></span>
          <span class="title-placeholder"></span>
        </h4>
        <button class="toast-close" aria-label="Close toast">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
         </svg>
        </button>
      </div>
      <p class="toast-message"></p>
`;

class ToastComponent extends HTMLElement {
  #isVisible = false;
  #titleElement;
  #iconElement;
  #messageElement;
  #closeButton;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["type", "position"];
  }

  getIcon = (type) => {
    const icons = {
      success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
      error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
      info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    };
    return icons[type] || icons.info;
  };

  show = (type, title, message, position) => {
    this.#isVisible = true;
    this.setAttribute("data-type", type || "info");
    this.setAttribute("position", position || "bottom-right");
    this.#titleElement.textContent = title;
    this.#iconElement.innerHTML = this.getIcon(type || "info");
    this.#messageElement.textContent = message;
    this.showPopover();
  };

  hide = () => {
    this.#isVisible = false;
    this.hidePopover();
  };

  connectedCallback() {
    this.shadowRoot.appendChild(toastTemplate.content.cloneNode(true));
    this.setAttribute("popover", "manual");
    this.#titleElement = this.shadowRoot.querySelector(".title-placeholder");
    this.#iconElement = this.shadowRoot.querySelector(".toast-icon");
    this.#messageElement = this.shadowRoot.querySelector(".toast-message");
    this.#closeButton = this.shadowRoot.querySelector(".toast-close");

    this.#closeButton.addEventListener("click", this.hide);
  }

  disconnectedCallback() {
    this.#closeButton.removeEventListener("click", this.hide);
  }
}

customElements.define("toast-popover", ToastComponent);
