import { LitElement, html, css } from "lit";

export class PokedexNavButtons extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .dark-green-btn {
      all: unset;
      display: flex;
      box-sizing: border-box;
      cursor: pointer;
      width: 100px;
      height: 25px;
      background-color: var(--dex-dark-green);
      border: 3px solid var(--dex-border);
      border-radius: 4px;
      justify-content: center;
      align-items: center;
      color: #8bac0f;
      font-family: "Press Start 2P", monospace;
      font-size: 8px;
      font-weight: bold;
      user-select: none;
      transition: background-color 0.1s, transform 0.05s;
    }
    .dark-green-btn:hover { background-color: #385e50; }
    .dark-green-btn:active { transform: scale(0.92); }

    .bottom-controls {
      display: flex;
      width: 220px;
      justify-content: space-between;
    }
  `;

  #emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="bottom-controls">
        <button
          type="button"
          class="dark-green-btn"
          @click="${() => this.#emit("prev-click")}"
          title="Pokémon anterior"
          aria-label="Ir al Pokémon anterior"
        >
          ◄ PREV
        </button>
        <button
          type="button"
          class="dark-green-btn"
          @click="${() => this.#emit("next-click")}"
          title="Pokémon siguiente"
          aria-label="Ir al Pokémon siguiente"
        >
          NEXT ►
        </button>
      </div>
    `;
  }
}
customElements.define("pokedex-nav-buttons", PokedexNavButtons);
