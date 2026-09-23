import { LitElement, html, css } from "lit";
import { normalizeSearchQuery } from "./pokemon-search.utils.js";

const SEARCH_ICON = html`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
  <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2.5" />
  <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
</svg>`;

export class PokemonSearch extends LitElement {
  static properties = {
    value: { type: String },
    expanded: { type: Boolean, state: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    .search {
      display: flex;
      align-items: center;
      height: 2.2rem;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.6);
      overflow: hidden;
      transition: background 0.15s ease;
    }

    .search:hover,
    .search.open {
      background: rgba(255, 255, 255, 0.85);
    }

    .toggle {
      flex: none;
      width: 2.2rem;
      height: 2.2rem;
      border: none;
      background: transparent;
      color: inherit;
      display: grid;
      place-items: center;
      cursor: pointer;
    }

    input {
      width: 0;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0;
      transition: width 0.25s ease, padding 0.25s ease;
    }

    .open input {
      width: min(11rem, 40vw);
      padding-right: 0.9rem;
    }

    @media (prefers-reduced-motion: reduce) {
      input {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.value = "";
    this.expanded = false;
  }

  #emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  async #toggle() {
    if (this.expanded || this.value) {
      this.#collapse();
      return;
    }
    this.expanded = true;
    await this.updateComplete;
    this.renderRoot.querySelector("input").focus();
  }

  #collapse() {
    this.expanded = false;
    if (this.value) {
      this.value = "";
      this.#emit("search-clear");
    }
  }

  #clearActiveSearch() {
    if (!this.value) return;
    this.value = "";
    this.#emit("search-clear");
  }

  #onInput(event) {
    if (!normalizeSearchQuery(event.target.value)) this.#clearActiveSearch();
  }

  #onKeydown(event) {
    if (event.key === "Enter") {
      const query = normalizeSearchQuery(event.target.value);
      if (query) {
        this.value = event.target.value;
        this.#emit("search-submit", { query, raw: event.target.value });
      } else {
        this.#clearActiveSearch();
      }
    } else if (event.key === "Escape") {
      this.#collapse();
    }
  }

  render() {
    const open = this.expanded || Boolean(this.value);
    return html`
      <div class="search ${open ? "open" : ""}">
        <button
          type="button"
          class="toggle"
          @click="${this.#toggle}"
          aria-label="${open ? "Cerrar búsqueda" : "Buscar Pokémon"}"
          aria-expanded="${open}"
          title="${open ? "Cerrar búsqueda" : "Buscar por nombre o número"}"
        >
          ${SEARCH_ICON}
        </button>
        <input
          type="text"
          .value="${this.value}"
          placeholder="Nombre o número"
          aria-label="Buscar Pokémon por nombre o número"
          autocomplete="off"
          tabindex="${open ? 0 : -1}"
          @input="${this.#onInput}"
          @keydown="${this.#onKeydown}"
        />
      </div>
    `;
  }
}
customElements.define("pokemon-search", PokemonSearch);
