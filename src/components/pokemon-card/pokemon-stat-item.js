// src/components/pokemon-card/pokemon-stat-item.js
import { LitElement, html, css } from "lit";

export class PokemonStatItem extends LitElement {
  static properties = {
    icon: { type: String },
    label: { type: String },
    value: { type: String },
  };

  static styles = css`
    .character {
      width: 50%;
    }
    .character .title {
      display: block;
      width: 100%;
      font-size: 1rem;
      text-align: left;
      color: #f2f2f2;
    }
    .character-info {
      width: 80%;
      height: 2rem;
      border-radius: 100px;
      border: 1px solid #f2f2f2;
      margin: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .character-text {
      color: #f2f2f2;
      font-size: 0.9rem;
      font-weight: lighter;
    }
    img {
      width: 1rem;
      height: 1rem;
    }
  `;

  render() {
    return html`
      <div class="character">
        <span class="title">
          <img src="assets/${this.icon}.svg" alt="${this.label}" />
          ${this.label}
        </span>
        <div class="character-info">
          <span class="character-text">${this.value}</span>
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-stat-item", PokemonStatItem);
