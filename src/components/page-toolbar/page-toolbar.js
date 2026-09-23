import { LitElement, html, css } from "lit";

export class PageToolbar extends LitElement {
  static properties = {
    favoritesOnly: { type: Boolean },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .favorites-toggle {
      background: rgba(255, 255, 255, 0.6);
      border: none;
      border-radius: 100px;
      padding: 0.5rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .favorites-toggle:hover {
      background: rgba(255, 255, 255, 0.85);
    }

    .favorites-toggle.active {
      background: #ffcb04;
    }

    .tour-trigger {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.6);
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .tour-trigger:hover {
      background: rgba(255, 255, 255, 0.85);
    }
  `;

  constructor() {
    super();
    this.favoritesOnly = false;
  }

  #emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button
        type="button"
        class="favorites-toggle ${this.favoritesOnly ? "active" : ""}"
        @click="${() => this.#emit("favorites-toggle-click")}"
        aria-pressed="${this.favoritesOnly}"
      >
        ★ ${this.favoritesOnly ? "Ver todos" : "Mis favoritos"}
      </button>

      <button
        type="button"
        class="tour-trigger"
        @click="${() => this.#emit("tour-click")}"
        aria-label="Ver tutorial de la app"
        title="Ver tutorial"
      >
        ?
      </button>
    `;
  }
}
customElements.define("page-toolbar", PageToolbar);
