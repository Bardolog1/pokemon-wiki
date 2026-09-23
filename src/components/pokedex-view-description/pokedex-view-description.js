import { LitElement, html, css } from "lit";

export class PokedexViewDescription extends LitElement {
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

    .dex-description {
      margin-top: 4px;
      font-size: 8px;
      line-height: 1.4;
      text-transform: uppercase;
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
    return html`
      <div class="screen-header">DATOS DEX</div>
      <div class="dex-description">${this.pokemon?.description || "Sin descripción."}</div>
      <div class="nav-hint">&lt; DESC &gt;</div>
    `;
  }
}
customElements.define("pokedex-view-description", PokedexViewDescription);
