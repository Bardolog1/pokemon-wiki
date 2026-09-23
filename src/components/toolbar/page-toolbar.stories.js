import { html } from "lit";
import "./page-toolbar.js";

export default {
  title: "Layout/Page Toolbar",
  component: "page-toolbar",
};

export const ShowingAll = {
  render: () =>
    html`<page-toolbar
      .favoritesOnly=${false}
      @favorites-toggle-click="${() => console.log("favorites-toggle-click")}"
      @tour-click="${() => console.log("tour-click")}"
    ></page-toolbar>`,
};

export const FavoritesActive = {
  render: () =>
    html`<page-toolbar
      .favoritesOnly=${true}
      @favorites-toggle-click="${() => console.log("favorites-toggle-click")}"
      @tour-click="${() => console.log("tour-click")}"
    ></page-toolbar>`,
};
