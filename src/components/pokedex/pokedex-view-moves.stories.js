import { html } from "lit";
import "./pokedex-view-moves.js";
import { withScreenBackground } from "./pokedex-story-helpers.js";

export default {
  title: "Pokedex/Screen Views/Moves",
  component: "pokedex-view-moves",
};

export const WithMoves = {
  render: () =>
    withScreenBackground(html`
      <pokedex-view-moves
        .pokemon=${{ moves: ["scratch", "growl", "flamethrower", "wing attack", "fire spin"] }}
      ></pokedex-view-moves>
    `),
};

export const NoMoves = {
  render: () => withScreenBackground(html`<pokedex-view-moves .pokemon=${{}}></pokedex-view-moves>`),
};
