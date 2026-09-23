import { html } from "lit";
import "./pagination-button.js";

export default {
  title: "Pagination/Button",
  component: "pagination-button",
  argTypes: {
    icon: { control: "select", options: ["first", "next"] },
    rotate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export const Default = {
  args: { icon: "next", rotate: false, disabled: false },
  render: ({ icon, rotate, disabled }) => html`
    <pagination-button icon=${icon} ?rotate=${rotate} ?disabled=${disabled}></pagination-button>
  `,
};
