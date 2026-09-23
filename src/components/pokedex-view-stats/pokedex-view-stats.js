import { LitElement, html, css } from "lit";

const STAT_ROWS = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "ATK" },
  { key: "defense", label: "DEF" },
  { key: "speed", label: "SPD" },
];
const BAR_MAX = 130;
const BAR_TOTAL_BLOCKS = 7;

function renderBarBlocks(val = 0) {
  const filled = Math.min(
    BAR_TOTAL_BLOCKS,
    Math.max(1, Math.round((val / BAR_MAX) * BAR_TOTAL_BLOCKS)),
  );
  return Array.from(
    { length: BAR_TOTAL_BLOCKS },
    (_, i) => html`<span class="bar-block ${i < filled ? "filled" : ""}"></span>`,
  );
}

export class PokedexViewStats extends LitElement {
  static properties = {
    pokemon: { type: Object },
  };

  static styles = css`
    .screen-header {
      text-align: center;
      font-size: 9px;
      font-weight: bold;
      border-bottom: 2px dashed #0f380f;
      padding-bottom: 3px;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .stats-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 2px 0;
    }
    .stat-row {
      display: flex;
      align-items: center;
      font-size: 8px;
      line-height: 1;
    }
    .stat-label {
      width: 30px;
      font-weight: bold;
    }
    .stat-val {
      width: 28px;
      text-align: right;
      font-family: "Press Start 2P", monospace;
      margin-right: 8px;
      white-space: pre;
    }
    .stat-bar-container {
      display: flex;
      gap: 2px;
      align-items: center;
    }
    .bar-block {
      width: 7px;
      height: 8px;
      border: 1px solid #0f380f;
      background-color: transparent;
      box-sizing: border-box;
    }
    .bar-block.filled {
      background-color: #0f380f;
    }

    .nav-hint {
      font-size: 8px;
      text-align: center;
      margin-top: auto;
      padding-top: 6px;
      padding-bottom: 2px;
      color: #0f380f;
      opacity: 0.8;
    }
  `;

  render() {
    const stats = this.pokemon?.stats ?? {};

    return html`
      <div class="screen-header">ESTADISTICAS</div>
      <div class="stats-container">
        ${STAT_ROWS.map(
          ({ key, label }) => html`
            <div class="stat-row">
              <span class="stat-label">${label}</span>
              <span class="stat-val">${String(stats[key] ?? 0).padStart(3, " ")}</span>
              <div class="stat-bar-container">${renderBarBlocks(stats[key])}</div>
            </div>
          `,
        )}
      </div>
      <div class="nav-hint">&lt; STATS &gt;</div>
    `;
  }
}
customElements.define("pokedex-view-stats", PokedexViewStats);
