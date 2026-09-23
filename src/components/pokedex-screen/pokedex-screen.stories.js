import { html } from "lit";
import "./pokedex-screen.js";
import { withDexBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

const SAMPLE_ENTRY = {
  id: 6,
  name: "charizard",
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  type: ["fire", "flying"],
  description: "Escupe fuego capaz de fundir rocas. Provoca incendios forestales sin querer.",
  evolutions: ["charmander", "charmeleon", "charizard"],
  moves: ["scratch", "growl", "flamethrower", "wing attack", "fire spin"],
  stats: { hp: 78, attack: 84, defense: 78, special_attack: 109, special_defense: 85, speed: 100 },
};

export default {
  title: "Pokedex/Screen",
  component: "pokedex-screen",
};

export const Off = {
  render: () => withDexBackground(html`<pokedex-screen></pokedex-screen>`),
};

export const SystemReady = {
  name: "On, no search yet",
  render: () => withDexBackground(html`<pokedex-screen isOn></pokedex-screen>`),
};

export const Loading = {
  render: () => withDexBackground(html`<pokedex-screen isOn isLoading></pokedex-screen>`),
};

export const NotFound = {
  name: "Error (not found)",
  render: () => withDexBackground(html`<pokedex-screen isOn error></pokedex-screen>`),
};

export const ArtworkView = {
  name: "Loaded — artwork view",
  render: () =>
    withDexBackground(
      html`<pokedex-screen isOn .pokemon=${SAMPLE_ENTRY} .activeView=${0}></pokedex-screen>`,
    ),
};

export const StatsView = {
  name: "Loaded — stats view",
  render: () =>
    withDexBackground(
      html`<pokedex-screen isOn .pokemon=${SAMPLE_ENTRY} .activeView=${1}></pokedex-screen>`,
    ),
};
