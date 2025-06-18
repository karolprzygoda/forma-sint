const skeletonTemplate = document.createElement("template");
skeletonTemplate.innerHTML = `
    <style>
        :host {
            display: block;
        }
        .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            border-radius: 0.375rem;
            width: 100%;
            height: 100%;
        }
        .skeleton.pulse {
            animation: skeleton-pulse 1.5s ease-in-out infinite;
        }
        .skeleton.wave {
            animation: skeleton-wave 1.5s linear infinite;
        }
        .skeleton.shimmer {
            position: relative;
            overflow: hidden;
        }
        .skeleton.shimmer::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            animation: skeleton-shimmer 1.5s infinite;
        }
        @keyframes skeleton-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        @keyframes skeleton-wave {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        @keyframes skeleton-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
    </style>
    <div class="skeleton"></div>
`;

class SkeletonComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["animation-type", "inject-styles"];
  }

  connectedCallback() {
    this.shadowRoot.appendChild(skeletonTemplate.content.cloneNode(true));
    const skeletonEl = this.shadowRoot.querySelector(".skeleton");
    skeletonEl.classList.add(this.getAttribute("animation-type") || "pulse");
    skeletonEl.style = this.getAttribute("inject-styles");
  }
}

customElements.define("ui-skeleton", SkeletonComponent);
