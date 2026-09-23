import { html } from "lit";
import "./pokedex-numpad.js";
import { withDexBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

function renderNumpad(yellowFlash = false) {
  return withDexBackground(html`
    <pokedex-numpad
      ?yellowFlash="${yellowFlash}"
      @digit-click="${(e) => console.log("digit-click:", e.detail.digit)}"
      @delete-click="${() => console.log("delete-click")}"
      @search-click="${() => console.log("search-click")}"
      @reset-click="${() => console.log("reset-click")}"
    ></pokedex-numpad>
  `);
}

export default {
  title: "Pokedex/Numpad (grid + DEL/GO + reset)",
  component: "pokedex-numpad",
};

export const Default = {
  render: () => renderNumpad(),
};

export const YellowFlash = {
  name: "Yellow button flashing (reset feedback)",
  render: () => renderNumpad(true),
};
