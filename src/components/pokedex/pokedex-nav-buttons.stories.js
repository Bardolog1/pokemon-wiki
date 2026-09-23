import { html } from "lit";
import "./pokedex-nav-buttons.js";
import { withDexBackground } from "./pokedex-story-helpers.js";

export default {
  title: "Pokedex/Nav Buttons (PREV/NEXT)",
  component: "pokedex-nav-buttons",
};

export const Default = {
  render: () =>
    withDexBackground(html`
      <pokedex-nav-buttons
        @prev-click="${() => console.log("prev-click")}"
        @next-click="${() => console.log("next-click")}"
      ></pokedex-nav-buttons>
    `),
};
