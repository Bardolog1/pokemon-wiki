import { html } from "lit";
import "./pokedex-view-evolutions.js";
import { withScreenBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

export default {
  title: "Pokedex/Screen Views/Evolutions",
  component: "pokedex-view-evolutions",
};

export const ThreeStageLine = {
  render: () =>
    withScreenBackground(html`
      <pokedex-view-evolutions
        .pokemon=${{ evolutions: ["charmander", "charmeleon", "charizard"] }}
      ></pokedex-view-evolutions>
    `),
};

export const NoEvolutions = {
  render: () =>
    withScreenBackground(html`
      <pokedex-view-evolutions .pokemon=${{ evolutions: ["ditto"] }}></pokedex-view-evolutions>
    `),
};
