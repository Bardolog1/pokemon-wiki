import { LitElement, html, css } from "lit";
import "./pokedex-view-artwork.js";
import "./pokedex-view-stats.js";
import "./pokedex-view-moves.js";
import "./pokedex-view-description.js";
import "./pokedex-view-evolutions.js";

const VIEWS = [
  "pokedex-view-artwork",
  "pokedex-view-stats",
  "pokedex-view-moves",
  "pokedex-view-description",
  "pokedex-view-evolutions",
];

export class PokedexScreen extends LitElement {
  static properties = {
    pokemon: { type: Object },
    isLoading: { type: Boolean },
    error: { type: Boolean },
    activeView: { type: Number },
    isOn: { type: Boolean },
  };

  static styles = css`
    .main-screen {
      width: 200px;
      height: 130px;
      background-color: var(--dex-screen-off);
      border: 4px solid var(--dex-border);
      border-radius: 8px;
      font-family: "Press Start 2P", monospace;
      position: relative;
      overflow: hidden;
      padding: 6px;
      box-sizing: border-box;
    }
    .main-screen.is-on {
      background-color: var(--dex-screen-on);
      color: #0f380f;
      box-shadow: inset 0 0 18px rgba(139, 172, 15, 0.8), 0 0 10px rgba(139, 172, 15, 0.4);
      text-shadow: 1px 1px 0px rgba(139, 172, 15, 0.5);
    }

    .scroll-container {
      height: 100%;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      scroll-behavior: smooth;
      display: flex;
      flex-direction: column;
    }
    .scroll-container::-webkit-scrollbar {
      display: none;
    }

    .center-msg {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
      line-height: 1.4;
      font-size: 10px;
      font-weight: bold;
      padding: 4px;
      box-sizing: border-box;
    }
  `;

  updated(changed) {
    super.updated(changed);
    if (changed.has("activeView")) {
      const container = this.renderRoot.querySelector(".scroll-container");
      if (container) container.scrollTop = 0;
    }
  }

  scrollBy(deltaY) {
    const container = this.renderRoot.querySelector(".scroll-container");
    if (container) container.scrollBy({ top: deltaY, behavior: "smooth" });
  }

  #renderActiveView() {
    const tag = VIEWS[this.activeView] ?? VIEWS[0];
    switch (tag) {
      case "pokedex-view-artwork":
        return html`<pokedex-view-artwork .pokemon=${this.pokemon}></pokedex-view-artwork>`;
      case "pokedex-view-stats":
        return html`<pokedex-view-stats .pokemon=${this.pokemon}></pokedex-view-stats>`;
      case "pokedex-view-moves":
        return html`<pokedex-view-moves .pokemon=${this.pokemon}></pokedex-view-moves>`;
      case "pokedex-view-description":
        return html`<pokedex-view-description .pokemon=${this.pokemon}></pokedex-view-description>`;
      case "pokedex-view-evolutions":
        return html`<pokedex-view-evolutions .pokemon=${this.pokemon}></pokedex-view-evolutions>`;
      default:
        return html``;
    }
  }

  render() {
    return html`
      <div class="main-screen ${this.isOn ? "is-on" : ""}">
        <div class="scroll-container">
          ${this.isLoading ? html`<div class="center-msg">BUSCANDO...<br />DATOS...</div>` : ""}
          ${this.error ? html`<div class="center-msg">ERROR:<br />POKÉMON NO<br />ENCONTRADO.</div>` : ""}
          ${!this.pokemon && !this.isLoading && !this.error
            ? html`<div class="center-msg">SYSTEM READY<br />_</div>`
            : ""}
          ${this.pokemon && !this.isLoading && !this.error ? this.#renderActiveView() : ""}
        </div>
      </div>
    `;
  }
}
customElements.define("pokedex-screen", PokedexScreen);
