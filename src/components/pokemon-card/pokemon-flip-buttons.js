// src/components/pokemon-card/pokemon-flip-buttons.js
import { LitElement, html, css } from "lit";

export class PokemonFlipButtons extends LitElement {
  static styles = css`
    .buttons-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .button {
      height: 100%;
      width: 10%;
    }
    .button img {
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <div class="buttons-container">
        <div
          class="button button-pokedex"
          @click=${() => this.dispatchEvent(new CustomEvent("pokedex-click", { bubbles: true }))}
        >
          <img src="assets/pokegenie.svg" alt="pokedex" />
        </div>
        <div
          class="button button-flip"
          @click=${() => this.dispatchEvent(new CustomEvent("flip-click", { bubbles: true }))}
        >
          <img src="assets/phone-flip.svg" alt="flip" />
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-flip-buttons", PokemonFlipButtons);
