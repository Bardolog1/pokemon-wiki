import { html } from "lit";
import "./pokemon-search.js";

export default {
  title: "Toolbar/Search",
  component: "pokemon-search",
};

export const Collapsed = {
  render: () => html`<pokemon-search></pokemon-search>`,
};

export const WithValue = {
  name: "With an active search",
  render: () => html`<pokemon-search value="pikachu"></pokemon-search>`,
};
