import { html } from "lit";
import "./banner-title.js";

export default {
  title: "Layout/Banner Title",
  component: "banner-title",
};

export const Default = {
  render: () => html`
    <banner-title
      title="PokeDex with PokéAPI & Lit"
      logo="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
      logo-2="https://lit.dev/images/logo.svg#flame"
    ></banner-title>
  `,
};
