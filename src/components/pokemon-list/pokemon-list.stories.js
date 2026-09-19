import { html } from "lit";
import "./pokemon-list.js";

const SAMPLE_POKEMONS = [
  {
    id: 1, name: "bulbasaur", exp: 64,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    type: ["grass", "poison"],
    stats: { hp: 45, attack: 49, defense: 49, special_attack: 65, special_defense: 65, speed: 45 },
    height: 7, weight: 69,
  },
  {
    id: 4, name: "charmander", exp: 62,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    type: ["fire"],
    stats: { hp: 39, attack: 52, defense: 43, special_attack: 60, special_defense: 50, speed: 65 },
    height: 6, weight: 85,
  },
];

export default {
  title: "Layout/Pokemon List (composed)",
  component: "listar-pokemon",
};

export const Default = {
  render: () => html`<listar-pokemon .pokemons=${SAMPLE_POKEMONS}></listar-pokemon>`,
};
