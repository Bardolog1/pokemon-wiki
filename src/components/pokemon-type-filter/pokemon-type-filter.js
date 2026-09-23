import { LitElement, html, css } from "lit";
import { TYPES_COLORS, getTypeColors } from "../pokemon-type-badge/pokemon-type-badge.js";

const TYPE_NAMES = Object.keys(TYPES_COLORS).filter((t) => t !== "unknown");

export class PokemonTypeFilter extends LitElement {
  static properties = {
    selected: { type: Array },
  };

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.6rem;
      width: 100%;
    }

    .show-all-btn {
      background: rgba(255, 255, 255, 0.6);
      border: none;
      border-radius: 100px;
      padding: 0.45rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .show-all-btn:hover {
      background: rgba(255, 255, 255, 0.85);
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }

    .chip {
      all: unset;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      border: 2px solid transparent;
      transition: transform 0.15s ease, border-color 0.15s ease, filter 0.15s ease, opacity 0.15s ease;
    }

    .chip:hover {
      transform: scale(1.08);
    }

    .chip[aria-pressed="true"] {
      border-color: #ffcb04;
    }

    /* Con selección activa, los no seleccionados van en escala de grises; sin selección, todos a color. */
    .chips.has-selection .chip:not([aria-pressed="true"]) {
      filter: grayscale(1);
      opacity: 0.6;
    }

    .chip img {
      width: 1.35rem;
      height: 1.35rem;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
    }
  `;

  constructor() {
    super();
    this.selected = [];
  }

  #toggle(type) {
    const isSelected = this.selected.includes(type);
    const next = isSelected ? this.selected.filter((t) => t !== type) : [...this.selected, type];
    this.selected = next;
    this.dispatchEvent(new CustomEvent("types-change", { detail: next, bubbles: true, composed: true }));
  }

  #clear() {
    this.selected = [];
    this.dispatchEvent(new CustomEvent("types-change", { detail: [], bubbles: true, composed: true }));
  }

  render() {
    const hasSelection = this.selected.length > 0;
    return html`
      ${hasSelection
        ? html`<button type="button" class="show-all-btn" @click=${this.#clear}>Ver todos</button>`
        : ""}
      <div class="chips ${hasSelection ? "has-selection" : ""}">
        ${TYPE_NAMES.map((type) => {
          const [c0, c1] = getTypeColors(type);
          const isSelected = this.selected.includes(type);
          return html`
            <button
              type="button"
              class="chip"
              aria-pressed="${isSelected}"
              aria-label="Filtrar por tipo ${type}"
              title="${type}"
              style="background: radial-gradient(circle, ${c1} 0%, ${c0} 100%);"
              @click=${() => this.#toggle(type)}
            >
              <img src="assets/${type}.svg" alt="" />
            </button>
          `;
        })}
      </div>
    `;
  }
}
customElements.define("pokemon-type-filter", PokemonTypeFilter);
