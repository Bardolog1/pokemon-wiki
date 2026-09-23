import { html } from "lit";
import "./pagination.js";

export default {
  title: "Pagination/Pagination (composed)",
  component: "pagination-nav",
};

export const Default = {
  render: () => html`
    <pagination-nav
      results="60"
      visible-results="5"
      visible-pages="5"
      current-page="1"
    ></pagination-nav>
  `,
};
