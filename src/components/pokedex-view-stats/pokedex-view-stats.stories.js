import { html } from "lit";
import "./pokedex-view-stats.js";
import { withScreenBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

export default {
  title: "Pokedex/Screen Views/Stats",
  component: "pokedex-view-stats",
};

export const HighStats = {
  name: "High stats (near-legendary)",
  render: () =>
    withScreenBackground(html`
      <pokedex-view-stats
        .pokemon=${{ stats: { hp: 106, attack: 130, defense: 90, speed: 100 } }}
      ></pokedex-view-stats>
    `),
};

export const LowStats = {
  name: "Low stats (early-game)",
  render: () =>
    withScreenBackground(html`
      <pokedex-view-stats
        .pokemon=${{ stats: { hp: 39, attack: 52, defense: 43, speed: 65 } }}
      ></pokedex-view-stats>
    `),
};
