import { html } from "lit";

// Markup 100% estático (sin bindings a `this`): se define una sola vez a
// nivel de módulo en vez de recrearse en cada render() de pokedex-app.
export const SHELL_SVG_INTERIOR = html`
  <svg viewBox="0 0 340 480" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 0,10 L 150,10 L 190,100 L 325,100 A 15,15 0 0,1 340,115 L 340,465 A 15,15 0 0,1 325,480 L 0,480 Z"
      fill="var(--dex-red)"
      stroke="var(--dex-border)"
      stroke-width="6"
      stroke-linejoin="round"
    />
  </svg>
`;

export const SHELL_SVG_EXTERIOR = html`
  <svg viewBox="0 0 340 480" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 340,10 L 190,10 L 150,100 L 15,100 A 15,15 0 0,0 0,115 L 0,465 A 15,15 0 0,0 15,480 L 340,480 Z"
      fill="var(--dex-red)"
      stroke="var(--dex-border)"
      stroke-width="6"
      stroke-linejoin="round"
    />
  </svg>
`;
