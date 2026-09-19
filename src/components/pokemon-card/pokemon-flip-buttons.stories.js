import { html } from "lit";
import "./pokemon-flip-buttons.js";

export default {
  title: "Pokemon Card/Flip Buttons",
  component: "pokemon-flip-buttons",
};

export const Default = {
  render: () => html`
    <pokemon-flip-buttons
      @pokedex-click=${() => console.log("pokedex-click")}
      @flip-click=${() => console.log("flip-click")}
    ></pokemon-flip-buttons>
  `,
};
