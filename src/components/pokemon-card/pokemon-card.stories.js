import { html } from "lit";
import "./pokemon-card.js";

const SAMPLE_POKEMON = {
  id: 1,
  name: "bulbasaur",
  exp: 64,
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  type: ["grass", "poison"],
  stats: { hp: 45, attack: 49, defense: 49, special_attack: 65, special_defense: 65, speed: 45 },
  height: 7,
  weight: 69,
};

export default {
  title: "Pokemon Card/Card (composed)",
  component: "pokemon-card",
};

export const Default = {
  render: () => html`<pokemon-card .pokemon=${SAMPLE_POKEMON}></pokemon-card>`,
};
