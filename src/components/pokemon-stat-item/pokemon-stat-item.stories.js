import { html } from "lit";
import "./pokemon-stat-item.js";

export default {
  title: "Pokemon Card/Stat Item",
  component: "pokemon-stat-item",
  argTypes: {
    icon: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export const Weight = {
  args: { icon: "weight-outline", label: "Weight", value: "6.9 Kg" },
  render: ({ icon, label, value }) =>
    html`<pokemon-stat-item icon=${icon} label=${label} value=${value}></pokemon-stat-item>`,
};

export const Height = {
  args: { icon: "tapemeasure", label: "Height", value: "0.7 Mts" },
  render: Weight.render,
};
