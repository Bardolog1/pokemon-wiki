import { html } from "lit";
import "./pokemon-stats-chart.js";

const SAMPLE_POKEMON = {
  id: 1,
  name: "bulbasaur",
  stats: { hp: 45, attack: 49, defense: 49, special_attack: 65, special_defense: 65, speed: 45 },
};

export default {
  title: "Pokemon Card/Stats Chart",
  component: "pokemon-stats-chart",
};

export const Default = {
  render: () => html`
    <div style="width: 300px; height: 300px;">
      <pokemon-stats-chart .pokemon=${SAMPLE_POKEMON} .visible=${true}></pokemon-stats-chart>
    </div>
  `,
};
