import { html } from "lit";
import "./pokedex-dpad.js";
import { withDexBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

export default {
  title: "Pokedex/D-pad",
  component: "pokedex-dpad",
};

export const Default = {
  render: () =>
    withDexBackground(html`
      <pokedex-dpad
        @dpad-click="${(e) => console.log("dpad-click:", e.detail.direction)}"
      ></pokedex-dpad>
    `),
};
