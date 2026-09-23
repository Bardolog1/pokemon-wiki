import { html } from "lit";
import "./pokemon-pokedex-button.js";

export default {
  title: "Pokemon Card/Pokedex Button",
  component: "pokemon-pokedex-button",
};

export const Default = {
  render: () => html`
    <div style="width: 2rem; height: 2rem;">
      <pokemon-pokedex-button
        @pokedex-click=${() => console.log("pokedex-click")}
      ></pokemon-pokedex-button>
    </div>
  `,
};
