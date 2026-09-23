import { LitElement, html, css } from "lit";

export class PokedexViewArtwork extends LitElement {
  static properties = {
    pokemon: { type: Object },
  };

  static styles = css`
    .info-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
    }

    .retro-img {
      width: 100%;
      height: 100%;
      max-width: 160px;
      max-height: 115px;
      image-rendering: pixelated;
      object-fit: contain;
      margin: auto;
      transform: scale(1.25);
      filter: drop-shadow(2px 2px 0px rgba(15, 56, 15, 0.3));
    }
  `;

  render() {
    return html`
      <div class="info-layout">
        <img class="retro-img" src="${this.pokemon?.img}" alt="${this.pokemon?.name}" />
      </div>
    `;
  }
}
customElements.define("pokedex-view-artwork", PokedexViewArtwork);
