import { html } from "lit";
import "./pokedex-view-artwork.js";
import { withScreenBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

export default {
  title: "Pokedex/Screen Views/Artwork",
  component: "pokedex-view-artwork",
};

export const Default = {
  render: () =>
    withScreenBackground(html`
      <pokedex-view-artwork
        .pokemon=${{
          name: "charizard",
          img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        }}
      ></pokedex-view-artwork>
    `),
};
