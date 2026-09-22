// src/components/pokemon-card/pokemon-card.js
import { LitElement, html, css } from "lit";
import "./pokemon-type-badge.js";
import "./pokemon-stat-item.js";
import "./pokemon-flip-buttons.js";
import "./pokemon-stats-chart.js";
import { frontStyles, backStyles, sharedStyles } from "./pokemon-card.styles.js";
import { getTypeColors } from "./pokemon-type-badge.js";

export class PokemonCard extends LitElement {
  static properties = {
    pokemon: { type: Object, attribute: "pokemon" },
    flipped: { type: Boolean },
  };

  static styles = [sharedStyles, frontStyles, backStyles];

  constructor() {
    super();
    this.flipped = false;
    this.pokemon = {};
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }

  _renderPokedex() {
     window.dispatchEvent(new CustomEvent("render-pokedex", { detail: this.pokemon }));
  }

  render() {
    const { pokemon, flipped } = this;
    const firstType = pokemon?.type?.[0] || "unknown";
    const [c0, c1] = getTypeColors(firstType);

    return html`
      <style>
        :host {
          --gradient-background: linear-gradient(90deg, ${c0} 0%, ${c1} 100%);
        }
      </style>

      <div class="scaff ${flipped ? "flipped" : ""}" id=${pokemon.id || 0}>
        <div class="containerCard">
          <div class="card">
            <pokemon-flip-buttons
              class="buttons-container"
              @pokedex-click=${this._renderPokedex}
              @flip-click=${this.toggleFlip}
            ></pokemon-flip-buttons>
            <div class="image-container">
              <div class="back-container">
                <img class="img-back" src="assets/${firstType}.svg" alt="" />
              </div>
              <img src="${pokemon.img ? pokemon.img : "assets/R.png"}" alt="${pokemon.name}" />
            </div>
            <div class="info-container">
              <h2>${pokemon.name.toUpperCase()}</h2>
              <div class="id-exp-container">
                <span class="poke-id">N° ${pokemon.id}</span>
                <span class="poke-exp">${pokemon.exp} Exp</span>
              </div>
              <div class="type-container">
                ${(pokemon.type || []).map(
                  (t) => html`<pokemon-type-badge type=${t}></pokemon-type-badge>`,
                )}
              </div>
              <div class="character-container">
                <pokemon-stat-item
                  icon="weight-outline"
                  label="Weight"
                  value="${Math.ceil(pokemon.weight * 0.1 * 10) / 10} Kg"
                ></pokemon-stat-item>
                <pokemon-stat-item
                  icon="tapemeasure"
                  label="Height"
                  value="${Math.ceil(pokemon.height * 0.1 * 10) / 10} Mts"
                ></pokemon-stat-item>
              </div>
            </div>
          </div>
        </div>

        <div class="containerCardBack">
          <div class="card">
            <pokemon-flip-buttons
              class="buttons-container"
              @pokedex-click=${this._renderPokedex}
              @flip-click=${this.toggleFlip}
            ></pokemon-flip-buttons>
            <h5>Pokemon Stats</h5>
            <h6>${pokemon.name.toUpperCase()}</h6>
            <pokemon-stats-chart .pokemon=${pokemon} .visible=${flipped}></pokemon-stats-chart>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-card", PokemonCard);
