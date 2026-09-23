import { LitElement, html } from "lit";
import { getTypeMatchups } from "./type-effectiveness.js";
import { getTypeColors } from "../pokemon-type-badge/pokemon-type-badge.js";
import { styles } from "./pokemon-type-matchups.styles.js";

export class PokemonTypeMatchups extends LitElement {
  static properties = {
    type: { type: Array },
  };

  static styles = styles;

  #renderChip({ type, multiplier }, accentColor) {
    const [c0, c1] = getTypeColors(type);
    return html`
      <span class="chip">
        <span class="tooltip">${type}</span>
        <span class="badge" style="background: radial-gradient(circle, ${c1} 0%, ${c0} 100%);">
          <img src="assets/${type}.svg" alt="${type}" />
        </span>
        <span class="mult" style="--accent-color: ${accentColor};">×${multiplier}</span>
      </span>
    `;
  }

  render() {
    const { weaknesses, resistances } = getTypeMatchups(this.type);
    const weakColor = "#ff8a7a";
    const resistColor = "#7affa0";

    return html`
      <div class="group" style="--accent-color: ${weakColor};">
        <span class="group-title"><span class="arrow">▲</span> Débil</span>
        <div class="chips">
          ${weaknesses.length === 0
            ? html`<span class="empty">Ninguna</span>`
            : weaknesses.map((w) => this.#renderChip(w, weakColor))}
        </div>
      </div>

      <div class="group" style="--accent-color: ${resistColor};">
        <span class="group-title"><span class="arrow">▼</span> Resiste</span>
        <div class="chips">
          ${resistances.length === 0
            ? html`<span class="empty">Ninguna</span>`
            : resistances.map((r) => this.#renderChip(r, resistColor))}
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-type-matchups", PokemonTypeMatchups);
