import { html } from "lit";

export const DEX_VARS_STYLE = `
  --dex-red: #e32230;
  --dex-border: #222;
  --dex-screen-off: #232323;
  --dex-screen-on: #8bac0f;
  --dex-lens: #28aafa;
  --dex-yellow: #e8c722;
  --dex-green: #51ae5f;
  --dex-dark-green: #2c4a3f;
  --dex-bezel: #dedede;
`;

export function withDexBackground(content) {
  return html`
    <div
      style="${DEX_VARS_STYLE} background: #333; padding: 2rem; display: inline-block; border-radius: 8px;"
    >
      ${content}
    </div>
  `;
}

export function withScreenBackground(content) {
  return html`
    <div
      style="width: 200px; height: 130px; background-color: #8bac0f; color: #0f380f; font-family: 'Press Start 2P', monospace; border: 4px solid #222; border-radius: 8px; padding: 6px; box-sizing: border-box; display: flex; flex-direction: column;"
    >
      ${content}
    </div>
  `;
}
