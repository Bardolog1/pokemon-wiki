import { LitElement, html, css } from "lit";

export class PokedexViewMoves extends LitElement {
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

    .moves-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 2px;
    }
    .move-item {
      font-size: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
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
    const moves = this.pokemon?.moves ?? [];

    return html`
      <div class="screen-header">MOVIMIENTOS</div>
      <div class="moves-list">
        ${moves.length > 0
          ? moves.slice(0, 5).map((move) => html`<div class="move-item">&gt; ${move.toUpperCase()}</div>`)
          : html`<div class="move-item">SIN DATOS</div>`}
      </div>
      <div class="nav-hint">&lt; ATAQUES &gt;</div>
    `;
  }
}
customElements.define("pokedex-view-moves", PokedexViewMoves);
