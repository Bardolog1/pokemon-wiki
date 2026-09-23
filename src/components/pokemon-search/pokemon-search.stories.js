import { html } from "lit";
import "./pokemon-search.js";

export default {
  title: "Toolbar/Search",
  component: "pokemon-search",
};

// Collapsed magnifier; click it to expand into the input. Enter submits
// (search-submit); clearing the text or pressing Esc emits search-clear.
export const Collapsed = {
  render: () => html`<pokemon-search></pokemon-search>`,
};

export const WithValue = {
  name: "With an active search",
  render: () => html`<pokemon-search value="pikachu"></pokemon-search>`,
};
