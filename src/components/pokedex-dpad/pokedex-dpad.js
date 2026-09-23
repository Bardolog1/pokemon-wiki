import { LitElement, html, css } from "lit";

export class PokedexDpad extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .d-pad {
      position: relative;
      width: 85px;
      height: 85px;
    }
    .d-pad-v {
      position: absolute;
      left: 28px;
      width: 29px;
      height: 85px;
      background-color: #222;
      border-radius: 4px;
      border: 3px solid var(--dex-border);
      box-sizing: border-box;
    }
    .d-pad-h {
      position: absolute;
      top: 28px;
      width: 85px;
      height: 29px;
      background-color: #222;
      border-radius: 4px;
      border: 3px solid var(--dex-border);
      box-sizing: border-box;
    }
    .d-pad-center {
      position: absolute;
      top: 28px;
      left: 28px;
      width: 29px;
      height: 29px;
      background-color: #222;
      z-index: 2;
    }

    .d-pad-clickable {
      all: unset;
      display: block;
      box-sizing: border-box;
      cursor: pointer;
      position: absolute;
      width: 29px;
      height: 29px;
      z-index: 10;
    }
    .d-pad-left { left: 0; top: 28px; }
    .d-pad-right { right: 0; top: 28px; }
    .d-pad-up { left: 28px; top: 0; }
    .d-pad-down { left: 28px; bottom: 0; }
    .d-pad-clickable:active { background-color: rgba(255, 255, 255, 0.25); border-radius: 4px; }
  `;

  #emit(direction) {
    this.dispatchEvent(
      new CustomEvent("dpad-click", { detail: { direction }, bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="d-pad">
        <div class="d-pad-v"></div>
        <div class="d-pad-h"></div>
        <div class="d-pad-center"></div>

        <button
          type="button"
          class="d-pad-clickable d-pad-left"
          aria-label="Vista anterior"
          @click="${() => this.#emit("left")}"
        ></button>
        <button
          type="button"
          class="d-pad-clickable d-pad-right"
          aria-label="Vista siguiente"
          @click="${() => this.#emit("right")}"
        ></button>
        <button
          type="button"
          class="d-pad-clickable d-pad-up"
          aria-label="Desplazar pantalla hacia arriba"
          @click="${() => this.#emit("up")}"
        ></button>
        <button
          type="button"
          class="d-pad-clickable d-pad-down"
          aria-label="Desplazar pantalla hacia abajo"
          @click="${() => this.#emit("down")}"
        ></button>
      </div>
    `;
  }
}
customElements.define("pokedex-dpad", PokedexDpad);
