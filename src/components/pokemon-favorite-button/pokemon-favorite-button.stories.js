import { html } from "lit";
import "./pokemon-favorite-button.js";

export default {
  title: "Pokemon Card/Favorite Button",
  component: "pokemon-favorite-button",
};

export const Default = {
  render: () => html`<pokemon-favorite-button pokemon-id="99999"></pokemon-favorite-button>`,
};
