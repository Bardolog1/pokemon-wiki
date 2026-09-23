import { html } from "lit";
import "./favorites-empty.js";

export default {
  title: "Toolbar/Favorites Empty",
  component: "favorites-empty",
};

// Shown in place of the card grid when "Mis favoritos" is active but the
// user has not favorited anything yet.
export const Default = {
  render: () => html`<favorites-empty></favorites-empty>`,
};
