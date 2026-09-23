import { html } from "lit";
import "./pokemon-favorite-button.js";

export default {
  title: "Pokemon Card/Favorite Button",
  component: "pokemon-favorite-button",
};

// El botón lee/escribe favoritesStore (localStorage) de verdad — usa un id
// alto para no chocar con favoritos reales guardados en tu navegador. Es
// interactivo: haz clic para ver el toggle activo/inactivo en vivo.
export const Default = {
  render: () => html`<pokemon-favorite-button pokemon-id="99999"></pokemon-favorite-button>`,
};
