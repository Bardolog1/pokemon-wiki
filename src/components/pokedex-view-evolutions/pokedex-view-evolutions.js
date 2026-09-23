import { LitElement, html, css } from "lit";

export class PokedexViewEvolutions extends LitElement {
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

    .evo-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 4px;
    }
    .evo-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 8px;
    }
    .evo-stage {
      width: 48px;
      white-space: nowrap;
      font-weight: bold;
      opacity: 0.85;
    }
    .evo-arrow {
      font-weight: bold;
    }
    .evo-name {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
    const evolutions = this.pokemon?.evolutions ?? [];

    return html`
      <div class="screen-header">EVOLUCIONES</div>
      <div class="evo-container">
        ${evolutions.length > 0
          ? evolutions.map(
              (evo, i) => html`
                <div class="evo-row">
                  <span class="evo-stage">${i === 0 ? "BASE" : `EVO ${i}`}</span>
                  <span class="evo-arrow">&gt;</span>
                  <span class="evo-name">${evo.toUpperCase()}</span>
                </div>
              `,
            )
          : html`<div class="evo-row">SIN EVOLUCIONES</div>`}
      </div>
      <div class="nav-hint">&lt; EVOS &gt;</div>
    `;
  }
}
customElements.define("pokedex-view-evolutions", PokedexViewEvolutions);
