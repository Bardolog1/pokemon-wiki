import { LitElement, html, css } from "lit";

export class PokedexNumpad extends LitElement {
  static properties = {
    yellowFlash: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    .grid-btn,
    .white-btn,
    .yellow-btn {
      all: unset;
      display: block;
      box-sizing: border-box;
      cursor: pointer;
    }

    .grid-buttons {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 3px;
      width: 220px;
      background-color: var(--dex-border);
      border: 4px solid var(--dex-border);
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 2px;
    }
    .grid-btn {
      height: 42px;
      background-color: #00bfff;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-family: monospace;
      font-weight: bold;
      font-size: 1.4rem;
      text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
      user-select: none;
      transition: transform 0.05s, background-color 0.05s;
    }
    .grid-btn:hover { background-color: #33ccff; }
    .grid-btn:active { transform: scale(0.85); background-color: #0088cc; }

    .middle-controls {
      display: flex;
      width: 220px;
      justify-content: flex-end;
      align-items: center;
      gap: 15px;
    }
    .white-btns { display: flex; gap: 10px; margin-right: auto; }
    .white-btn {
      width: 45px;
      height: 22px;
      background-color: #fff;
      border: 3px solid var(--dex-border);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.7rem;
      font-family: sans-serif;
      font-weight: bold;
    }
    .white-btn:active { transform: scale(0.9); }
    .white-btn.bold-red { color: red; }

    .yellow-btn {
      width: 22px;
      height: 22px;
      background-color: var(--dex-yellow);
      border: 3px solid var(--dex-border);
      border-radius: 50%;
      transition: background-color 0.1s;
    }
    .yellow-btn.flash { background-color: #ffffee; box-shadow: 0 0 15px yellow; transform: scale(1.05); }
  `;

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
