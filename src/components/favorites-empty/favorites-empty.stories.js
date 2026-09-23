import { html } from "lit";
import "./favorites-empty.js";

export default {
  title: "Toolbar/Favorites Empty",
  component: "favorites-empty",
};

// Shown instead of the card grid when "Mis favoritos" is active and empty.
export const Default = {
  render: () => html`<favorites-empty></favorites-empty>`,
};
