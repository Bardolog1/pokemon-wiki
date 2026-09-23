import { html } from "lit";
import "./pokemon-favorite-button.js";

export default {
  title: "Pokemon Card/Favorite Button",
  component: "pokemon-favorite-button",
};

// Usa favoritesStore (localStorage) real; el id alto evita chocar con favoritos guardados en el navegador.
export const Default = {
  render: () => html`<pokemon-favorite-button pokemon-id="99999"></pokemon-favorite-button>`,
};
