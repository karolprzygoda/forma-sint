// -------- WARNING: This Component is in development --------

const toastTemplate = document.createElement("template");
toastTemplate.innerHTML = `
    <style>
        :host {
         
        }

        .toast-container {
          pointer-events: auto;
          background: var(--toast-bg, #ffffff);
          border: 1px solid var(--toast-border, #e5e7eb);
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          padding: 12px 16px;
          min-width: 300px;
          max-width: 400px;
          font-family: Inter, system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--toast-text, #374151);
          transform: translateY(-100%);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toast-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .toast-title {
          font-weight: 600;
          font-size: 14px;
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
          font-size: 13px;
        }

        :host([open]){
          transform: translateY(0);
          opacity: 1;
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
        }

        :host([position="top-right"]) {
          top: 16px;
          right: 16px;
        }

        :host([position="top-center"]) {
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
        }

        :host([position="bottom-left"]) {
          bottom: 16px;
          left: 16px;
        }

        :host([position="bottom-right"]) {
          bottom: 16px;
          right: 16px;
        }

        :host([position="bottom-center"]) {
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
        }
      </style>
      <div class="toast-container">
        <div class="toast-header">
          <h4 class="toast-title">
            <span class="toast-icon"></span>
            <span class="title-placeholder"></span>
          </h4>
          <button class="toast-close" aria-label="Close toast">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>
        <p class="toast-message"></p>
      </div>
`;

class ToastComponent extends HTMLElement {
  #isVisible = false;
  #titleElement;
  #iconElement;
  #messageElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["type", "duration", "position", "isVisible"];
  }

  getIcon = (type) => {
    const icons = {
      success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
      </svg>`,
      error: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>`,
      info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>`,
    };
    return icons[type] || icons.info;
  };

  show = (type, title, message, duration, position) => {
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
    this.removeAttribute("data-type");
    this.removeAttribute("data-position");
    this.hidePopover();
  };

  connectedCallback() {
    this.shadowRoot.appendChild(toastTemplate.content.cloneNode(true));
    this.setAttribute("popover", "");
    this.#titleElement = this.shadowRoot.querySelector(".title-placeholder");
    this.#iconElement = this.shadowRoot.querySelector(".toast-icon");
    this.#messageElement = this.shadowRoot.querySelector(".toast-message");
  }

  disconnectedCallback() {}
}

customElements.define("toast-popover", ToastComponent);
