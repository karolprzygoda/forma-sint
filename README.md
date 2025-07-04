# IdoMods Frontend Recruitment Challenge

## 1. Project Description

This project is a recruitment coding challenge for the frontend developer position at **IdoMods**. The application demonstrates a modern, component-driven approach to building an e-commerce web application listing page. It features custom web components, dynamic data fetching, and a responsive, accessible UI. The scope includes:

- Product listing with featured and regular products
- Responsive design and accessibility best practices
- Integration with a mock API for product data
- Modular architecture using ES6 modules
- Use of native Web Components for reusable UI components (select box, modal, drawer, toast)
- Dynamic product filtering
- Basic state management for UI interactions

### Tech Stack

- **HTML** – application structure
- **CSS** – styling and responsiveness
- **JavaScript (ES6+)** – application logic, Web Components
- **Vite** – build tool and development server (bundling, hot reload, image optimization)

## 2. Key Highlights & Code Snippets

### ✨ Custom Web Components

The project leverages native Web Components for reusable UI, such as a custom select box and modal dialog.

**Example: Registering a Custom Select Box**

```js
class SelectBox extends HTMLElement {
  constructor() {
    super();
    // ... initialization ...
  }
  // ... component logic ...
}
customElements.define("select-box", SelectBox);
```

_This snippet shows how the custom select box is defined and registered, enabling its use as `<select-box></select-box>` in HTML._

### ⚡ Modular Service Layer

Data fetching and parameter management are abstracted into services for maintainability and testability.

**Example: reusable Fetch Service**

```js
// src/services/fetch-service.js
class FetchService {
    static #instance;
    #cache;

    constructor() {
        if (FetchService.#instance) {
            return FetchService.#instance;
        }
        FetchService.#instance = this;
        this.#cache = new Map();
    }

    static get instance() {
        if (!FetchService.#instance) {
            FetchService.#instance = new FetchService();
        }
        return FetchService.#instance;
    }

    get cache() {
        return this.#cache;
    }

    clearCache() {
        this.#cache = new Map();
    }

    async fetch(url, options = {}) {
        try {
            const key = url + JSON.stringify(options);
            const cached = this.#cache.get(key);

            if (cached) {
                return cached;
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            this.#cache.set(key, data);

            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }
}

export const fetchService = new FetchService();

```

_This service implements a singleton pattern to manage API requests and caching, ensuring efficient data retrieval across the application._

## 3. Biggest Challenge: Creating a Custom Select Box Web Component

The toughest obstacle was building a fully accessible, keyboard-navigable custom select box from scratch. Native `<select>` elements have built-in accessibility, but custom elements require manual handling of focus, keyboard events, and ARIA attributes.

**Approach & Solution:**

- Studied accessibility patterns for custom dropdowns
- Used Shadow DOM and slots for encapsulation and flexibility
- Implemented keyboard navigation (arrow keys, Enter, Escape)
- Implemented focus trapping and management
- Managed open/close state and selection via internal state

This resulted in a select box that is both visually appealing and accessible.

## 4. Lessons Learned

- **Web Components:** Gained hands-on experience with custom elements, templates, and Shadow DOM.
- **Slots:** Learned how to use slots for flexible content distribution inside web components.
- **Accessibility:** Deepened understanding of ARIA roles and keyboard navigation patterns.
- **State Management:** Improved skills in managing component state and interactions in a modular way.
- **Performance Optimization:** Learned how to optimize component rendering and data fetching for better performance.
- **Responsive Design:** Enhanced skills in creating responsive layouts using CSS Grid and Flexbox.
- **Code Modularity:** Emphasized the importance of modular code structure for maintainability and scalability.
- **API Integration:** Improved skills in integrating with APIs, handling asynchronous data fetching, and managing application state based on API responses.
- **Error Handling:** Learned to implement robust error handling for network requests and user interactions.
- **User Experience:** Understood the importance of user feedback mechanisms (like toasts) for better UX.
- **Performance Metrics:** Gained experience in measuring and optimizing web performance using tools like Google Lighthouse.
- **Version Control:** Improved skills in using Git for version control, including branching, merging, and pull requests.
- **Documentation:** Recognized the value of clear documentation for code maintainability and onboarding new developers.
- **Continuous Learning:** Realized the importance of staying updated with web standards, best practices, and new technologies in frontend development.
- **Community Resources:** Discovered valuable resources and communities for frontend developers, such as MDN Web Docs, W3C specifications, and various online forums.
- **Debugging Skills:** Enhanced debugging skills using browser developer tools to inspect elements, monitor network requests, and analyze performance metrics.
- **Cross-Browser Compatibility:** Gained experience in ensuring the application works consistently across different browsers and devices, addressing any compatibility issues that arose.
- **User-Centric Design:** Understood the importance of designing with the user in mind, focusing on usability, accessibility, and overall user experience.
- **Security Best Practices:** Learned about security considerations in frontend development, such as preventing XSS attacks, securing API endpoints, and handling sensitive data appropriately.
- **Image Optimization:** Learned techniques for optimizing images and other assets to improve load times and overall performance, such as using responsive images, lazy loading, and compression.

## 5. Biggest Achievement

Achieved **100 points in every category on Google Lighthouse** (Performance, Accessibility, Best Practices, SEO), reflecting a strong commitment to quality and web standards.

## 6. Areas for Improvement

- **Toast Web Component:** The toast notification component is functional but not fully polished. Future work includes:
  - Smoother animations
  - Improved accessibility (focus management, ARIA live regions)
  - More flexible API for triggering toasts
- **Testing:** Increase coverage for edge cases and user interactions.

## 7. Installation & Usage

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd forma-sint
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

### Development Instructions

1. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as indicated in the terminal).

### Production Build
1. **Build for production:**
   ```sh
   npm run build
   ```
   The production build will be output to the `dist` directory.


2. **Preview the production build:**
   ```sh
   npm run preview
   ```
   This will start a local server to preview the production build at `http://localhost:4173`.

---

_Thank you for reviewing this challenge!_
