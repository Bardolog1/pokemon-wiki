import { html } from "lit";
import "./pokedex-view-description.js";
import { withScreenBackground } from "../../storybook-helpers/pokedex-story-helpers.js";

export default {
  title: "Pokedex/Screen Views/Description",
  component: "pokedex-view-description",
};

export const WithDescription = {
  render: () =>
    withScreenBackground(html`
      <pokedex-view-description
        .pokemon=${{ description: "Escupe fuego capaz de fundir rocas." }}
      ></pokedex-view-description>
    `),
};

export const Empty = {
  name: "No description available",
  render: () =>
    withScreenBackground(html`<pokedex-view-description .pokemon=${{}}></pokedex-view-description>`),
};
