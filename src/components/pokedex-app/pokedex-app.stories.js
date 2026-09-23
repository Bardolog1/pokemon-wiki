import { html } from "lit";
import "./pokedex-app.js";

const SAMPLE_ENTRY = {
  id: 6,
  name: "charizard",
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  type: ["fire", "flying"],
  description: "Escupe fuego capaz de fundir rocas. Provoca incendios forestales sin querer.",
  evolutions: ["charmander", "charmeleon", "charizard"],
  moves: ["scratch", "growl", "flamethrower", "wing attack", "fire spin"],
  stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
};

export default {
  title: "Pokedex/App (composed)",
  component: "pokedex-app",
};

export const Closed = {
  render: () => html`<pokedex-app></pokedex-app>`,
};

// Precarga .pokemon directamente en vez de disparar una búsqueda real
// (executeSearch pega contra la PokeAPI), así la story queda determinística
// y no depende de red.
export const OpenAndLoaded = {
  render: () => html`
    <pokedex-app .isOpen=${true} .isOn=${true} .pokemon=${SAMPLE_ENTRY}></pokedex-app>
  `,
};
