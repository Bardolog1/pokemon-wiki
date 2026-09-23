import { LitElement, html, css } from "lit";

export const TYPES_COLORS = {
  normal: ["#f48b1fff", "#f3b81aff"],
  fire: ["#f37021ff", "#f3b81aff"],
  water: ["#0b87b3ff", "#20afdfff"],
  electric: ["#f3961fff", "#f3b81aff"],
  grass: ["#459f46ff", "#57b947ff"],
  ice: ["#20afdfff", "#66cef6ff"],
  fighting: ["#8e191bff", "#b81f25ff"],
  poison: ["#8e191bff", "#b81f25ff"],
  ground: ["#5b3513ff", "#77421aff"],
  flying: ["#0b87b3ff", "#20afdfff"],
  psychic: ["#b11f83ff", "#c03995ff"],
  bug: ["#459f46ff", "#57b947ff"],
  rock: ["#917f6cff", "#a69f96ff"],
  ghost: ["#15110cff", "#403b35ff"],
  dragon: ["#459f46ff", "#57b947ff"],
  dark: ["#360928ff", "#712158ff"],
  steel: ["#352514ff", "#523e28ff"],
  fairy: ["#f7ac36ff", "#f3b81aff"],
  unknown: ["#15110cff", "#403b35ff"],
};

export function getTypeColors(type) {
  return TYPES_COLORS[type] || TYPES_COLORS.unknown;
}

export class PokemonTypeBadge extends LitElement {
  static properties = {
    type: { type: String },
  };

  static styles = css`
    .type {
      display: inline-block;
      width: 5rem;
      position: relative;
      height: 1.3rem;
      border-radius: 100px;
      border-top-left-radius: 0;
      text-transform: capitalize;
      align-items: center;
      padding-top: 0.2rem;
      color: #fff;
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
      font-weight: 400;
      font-size: 0.8rem;
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.type = "";
  }

  get #name() {
    return Object.keys(TYPES_COLORS).includes(this.type) ? this.type : "pokemmo";
  }

  render() {
    const [c0, c1] = getTypeColors(this.type);
    return html`
      <span
        class="type"
        style="background: radial-gradient(circle, ${c1} 0%, ${c0} 100%);"
      >
        ${this.#name}
      </span>
    `;
  }
}
customElements.define("pokemon-type-badge", PokemonTypeBadge);
