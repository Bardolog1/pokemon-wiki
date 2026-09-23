import { html } from "lit";
import "./pagination-numbers.js";

export default {
  title: "Pagination/Numbers",
  component: "pagination-numbers",
};

export const Default = {
  render: () => html`
    <pagination-numbers
      .numbers=${[1, 2, 3, 4, 5]}
      .currentPage=${3}
      .limit=${5}
    ></pagination-numbers>
  `,
};
