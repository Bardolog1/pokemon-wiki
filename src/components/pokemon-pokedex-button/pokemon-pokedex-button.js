import { LitElement, html, css } from "lit";

export class PokemonPokedexButton extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      height: 100%;
      width: 100%;
      display: block;
    }
    img {
      width: 100%;
      height: 100%;
    }
  `;

  // stopPropagation: la card entera flippea al hacer click (ver
  // pokemon-card.js); este botón vive dentro de esa misma zona clickeable,
  // así que su click no debe burbujear y disparar también el flip.
  #onClick(e) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("pokedex-click", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <button type="button" @click="${this.#onClick}" aria-label="Ver en la Pokédex" title="Ver en la Pokédex">
        <img src="assets/pokegenie.svg" alt="" />
      </button>
    `;
  }
}
customElements.define("pokemon-pokedex-button", PokemonPokedexButton);
