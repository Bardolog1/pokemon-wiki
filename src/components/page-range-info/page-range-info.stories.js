import { html } from "lit";
import "./page-range-info.js";

export default {
  title: "Pagination/Range Info",
  component: "page-range-info",
};

export const FirstPage = {
  render: () =>
    html`<page-range-info
      .rangeStart=${1}
      .rangeEnd=${20}
      .total=${1351}
      .currentPage=${1}
      .totalPages=${68}
    ></page-range-info>`,
};

export const LastPartialPage = {
  render: () =>
    html`<page-range-info
      .rangeStart=${101}
      .rangeEnd=${117}
      .total=${117}
      .currentPage=${6}
      .totalPages=${6}
    ></page-range-info>`,
};
