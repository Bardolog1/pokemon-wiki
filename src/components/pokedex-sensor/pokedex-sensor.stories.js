import { html } from "lit";
import "./pokedex-sensor.js";
import { withDexBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

export default {
  title: "Pokedex/Sensor (lens + LEDs)",
  component: "pokedex-sensor",
};

export const Idle = {
  render: () => withDexBackground(html`<pokedex-sensor></pokedex-sensor>`),
};

export const Blinking = {
  name: "Blinking (voice/cry playing)",
  render: () => withDexBackground(html`<pokedex-sensor blinking></pokedex-sensor>`),
};

export const LoadingSequence = {
  name: "Loading (LED sequence)",
  render: () => withDexBackground(html`<pokedex-sensor loading></pokedex-sensor>`),
};
