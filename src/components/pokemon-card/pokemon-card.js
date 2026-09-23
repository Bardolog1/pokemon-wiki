// src/components/pokemon-card/pokemon-card.js
import { LitElement, html, css } from "lit";
import "../pokemon-type-badge/pokemon-type-badge.js";
import "../pokemon-stat-item/pokemon-stat-item.js";
import "../pokemon-pokedex-button/pokemon-pokedex-button.js";
import "../pokemon-type-matchups/pokemon-type-matchups.js";
import "../pokemon-favorite-button/pokemon-favorite-button.js";
import { frontStyles, backStyles, sharedStyles } from "./pokemon-card.styles.js";
import { getTypeColors } from "../pokemon-type-badge/pokemon-type-badge.js";

export class PokemonCard extends LitElement {
  static properties = {
    pokemon: { type: Object, attribute: "pokemon" },
    flipped: { type: Boolean },
    forceHover: { type: Boolean },
    dragOver: { type: Boolean, state: true },
    hoverEnabled: { type: Boolean },
  };

  static styles = [sharedStyles, frontStyles, backStyles];

  constructor() {
    super();
    this.flipped = false;
    this.forceHover = false;
    this.pokemon = {};
    this.dragOver = false;
    this.hoverEnabled = true;
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }

  _renderPokedex() {
    window.dispatchEvent(new CustomEvent("render-pokedex", { detail: this.pokemon }));
  }

  _onDragEnter(e) {
    e.preventDefault();
    this.dragOver = true;
  }

  _onDragOver(e) {
    e.preventDefault();
  }

  _onDragLeave() {
    this.dragOver = false;
  }

  _onDrop(e) {
    e.preventDefault();
    this.dragOver = false;
    this._renderPokedex();
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

      <div
        class="scaff ${flipped ? "flipped" : ""} ${this.dragOver ? "drag-over" : ""} ${!this.hoverEnabled ? "hover-disabled" : ""}"
        id=${pokemon.id || 0}
        @click=${this.toggleFlip}
        @dragenter=${this._onDragEnter}
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        <div class="containerCard ${this.forceHover ? "force-hover" : ""}">
          <div class="card">
            <div class="top-toolbar">
              <pokemon-pokedex-button @pokedex-click=${this._renderPokedex}></pokemon-pokedex-button>
              <pokemon-favorite-button pokemon-id=${pokemon.id}></pokemon-favorite-button>
            </div>
            <div class="image-container">
              <div class="back-container">
                <img class="img-back" src="assets/${firstType}.svg" alt="" />
              </div>
              <img src="${pokemon.img ? pokemon.img : "assets/R.png"}" alt="${pokemon.name}" />
            </div>
            <div class="info-container">
              <div class="general-info">
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
            <div class="top-toolbar">
              <pokemon-pokedex-button @pokedex-click=${this._renderPokedex}></pokemon-pokedex-button>
              <pokemon-favorite-button pokemon-id=${pokemon.id}></pokemon-favorite-button>
            </div>
            <h5>Matriz de Tipos</h5>
            <h6>${pokemon.name.toUpperCase()}</h6>
            <pokemon-type-matchups .type=${pokemon.type}></pokemon-type-matchups>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-card", PokemonCard);
