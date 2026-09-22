import { LitElement, html, css } from "lit";
import { getTypeMatchups } from "./type-effectiveness.js";
import { getTypeColors } from "./pokemon-type-badge.js";

export class PokemonTypeMatchups extends LitElement {
  static properties = {
    type: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .group {
      margin-bottom: 0.7rem;
    }

    .group-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--accent-color, #f2f2f2);
      margin-bottom: 0.4rem;
    }

    .group-title .arrow {
      font-size: 0.6rem;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      justify-content: center;
      padding: 0.4rem;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 0.6rem;
    }

    .chip {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
    }

    .chip .badge {
      width: 2.1rem;
      height: 2.1rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }

    .chip img {
      width: 1.2rem;
      height: 1.2rem;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
    }

    .chip .mult {
      font-size: 0.62rem;
      font-weight: 700;
      color: var(--accent-color, #f2f2f2);
    }

    .chip .tooltip {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 50%;
      transform: translateX(-50%) translateY(2px);
      background: #171614;
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #f2f2f2;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: capitalize;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.12s ease, transform 0.12s ease;
      z-index: 10;
    }

    .chip:hover .tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .empty {
      font-size: 0.65rem;
      color: #f2f2f2;
      opacity: 0.5;
      padding: 0.3rem 0;
    }
  `;

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
