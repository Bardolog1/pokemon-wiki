import { html } from "lit";
import "./pokemon-type-filter.js";

export default {
  title: "Pokemon List/Type Filter",
  component: "pokemon-type-filter",
};

export const NoneSelected = {
  render: () =>
    html`<pokemon-type-filter
      .selected=${[]}
      @types-change="${(e) => console.log("types-change:", e.detail)}"
    ></pokemon-type-filter>`,
};

export const SomeSelected = {
  name: "Two types selected (fire, water)",
  render: () =>
    html`<pokemon-type-filter
      .selected=${["fire", "water"]}
      @types-change="${(e) => console.log("types-change:", e.detail)}"
    ></pokemon-type-filter>`,
};
