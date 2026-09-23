import { html } from "lit";
import "./pokemon-type-badge.js";

export default {
  title: "Pokemon Card/Type Badge",
  component: "pokemon-type-badge",
  argTypes: {
    type: {
      control: "select",
      options: [
        "normal", "fire", "water", "electric", "grass", "ice", "fighting",
        "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
        "dragon", "dark", "steel", "fairy", "unknown",
      ],
    },
  },
};

export const Default = {
  args: { type: "fire" },
  render: ({ type }) => html`<pokemon-type-badge .type=${type}></pokemon-type-badge>`,
};
