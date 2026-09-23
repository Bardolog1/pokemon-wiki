import { LitElement, html } from "lit";
import { styles } from "./pokedex-numpad.styles.js";

export class PokedexNumpad extends LitElement {
  static properties = {
    yellowFlash: { type: Boolean },
  };

  static styles = styles;

  constructor() {
    super();
    this.yellowFlash = false;
  }

  #emit(name) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  #digit(num) {
    this.dispatchEvent(
      new CustomEvent("digit-click", { detail: { digit: num }, bubbles: true, composed: true }),
    );
  }

  render() {
    const gridNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    return html`
      <div class="grid-buttons">
        ${gridNumbers.map(
          (num) => html`
            <button
              type="button"
              class="grid-btn"
              aria-label="Dígito ${num}"
              @click="${() => this.#digit(num)}"
            >
              ${num}
            </button>
          `,
        )}
      </div>

      <div class="middle-controls">
        <div class="white-btns">
          <button
            type="button"
            class="white-btn"
            @click="${() => this.#emit("delete-click")}"
            title="Borrar y limpiar búsqueda"
            aria-label="Borrar el último dígito y limpiar búsqueda"
          >
            DEL
          </button>
          <button
            type="button"
            class="white-btn bold-red"
            @click="${() => this.#emit("search-click")}"
            title="Buscar"
            aria-label="Buscar el Pokémon escrito"
          >
            GO
          </button>
        </div>
        <button
          type="button"
          class="yellow-btn ${this.yellowFlash ? "flash" : ""}"
          @click="${() => this.#emit("reset-click")}"
          title="Reiniciar búsqueda"
          aria-label="Reiniciar búsqueda"
        ></button>
      </div>
    `;
  }
}
customElements.define("pokedex-numpad", PokedexNumpad);
