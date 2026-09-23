import { html } from "lit";
import "./pokemon-type-matchups.js";

export default {
  title: "Pokemon Card/Type Matchups (back of card)",
  component: "pokemon-type-matchups",
};

export const SingleType = {
  name: "Single type (water)",
  render: () => html`<pokemon-type-matchups .type=${["water"]}></pokemon-type-matchups>`,
};

export const DualType = {
  name: "Dual type (fire/flying)",
  render: () => html`<pokemon-type-matchups .type=${["fire", "flying"]}></pokemon-type-matchups>`,
};

export const ManyResistances = {
  name: "Many resistances (steel/fairy)",
  render: () => html`<pokemon-type-matchups .type=${["steel", "fairy"]}></pokemon-type-matchups>`,
};
