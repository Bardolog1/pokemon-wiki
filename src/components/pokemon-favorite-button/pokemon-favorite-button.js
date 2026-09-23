import { LitElement, html, css } from "lit";
import { favoritesStore } from "../../services/favorites-store.js";

export class PokemonFavoriteButton extends LitElement {
  static properties = {
    pokemonId: { type: Number, attribute: "pokemon-id" },
    active: { type: Boolean, state: true },
  };

  static styles = css`
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
      font-size: 0.9rem;
      line-height: 1;
      color: rgba(255, 255, 255, 0.6);
      transition: transform 0.1s ease, color 0.15s ease;
    }

    button:hover {
      transform: scale(1.1);
    }

    button:focus-visible {
      outline: 2px solid #ffcb04;
      outline-offset: 2px;
    }

    button.active {
      color: #ffcb04;
    }
  `;

  constructor() {
    super();
    this.pokemonId = null;
    this.active = false;
    this._onChange = () => {
      this.active = favoritesStore.isFavorite(this.pokemonId);
    };
  }

  connectedCallback() {
    super.connectedCallback();
    favoritesStore.addEventListener("change", this._onChange);
    this.active = favoritesStore.isFavorite(this.pokemonId);
  }

  disconnectedCallback() {
    favoritesStore.removeEventListener("change", this._onChange);
    super.disconnectedCallback();
  }

  updated(changed) {
    if (changed.has("pokemonId")) {
      this.active = favoritesStore.isFavorite(this.pokemonId);
    }
  }

  #toggle(e) {
    e.stopPropagation();
    if (this.pokemonId == null) return;
    favoritesStore.toggle(this.pokemonId);
  }

  render() {
    const label = this.active ? "Quitar de favoritos" : "Agregar a favoritos";
    return html`
      <button
        type="button"
        class="${this.active ? "active" : ""}"
        @click="${this.#toggle}"
        aria-pressed="${this.active}"
        aria-label="${label}"
        title="${label}"
      >
        ★
      </button>
    `;
  }
}
customElements.define("pokemon-favorite-button", PokemonFavoriteButton);
