import { LitElement, html } from "lit";
import "../pokedex-app/pokedex-app.js";
import { styles } from "./navbar-buttons.styles.js";

export class NavbarButtons extends LitElement {
  static get properties() {
    return {
      isOpen: { type: Boolean }
    };
  }

  static styles = styles;

  constructor() {
    super();
    this.isOpen = false;
    this._handleRenderPokedex = this._handleRenderPokedex.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("render-pokedex", this._handleRenderPokedex);
    this._createDragImage();
  }

  disconnectedCallback() {
    window.removeEventListener("render-pokedex", this._handleRenderPokedex);
    this._dragImageEl?.remove();
    super.disconnectedCallback();
  }

  // Precarga: si no está decodificada, el drag image puede capturarse a medio cargar.
  _createDragImage() {
    const img = document.createElement("img");
    img.src = "assets/NicePng_pokedex-png_2285786.png";
    img.style.cssText = `
      position: fixed;
      top: -9999px;
      left: -9999px;
      width: 130px;
      height: 130px;
      opacity: 1;
    `;
    document.body.appendChild(img);
    this._dragImageEl = img;
  }

  togglePokedex() {
    this.isOpen = !this.isOpen;
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  _handleDragStart(e) {
    e.dataTransfer.setData("text/plain", "pokedex");
    e.dataTransfer.effectAllowed = "copy";

    if (this._dragImageEl) {
      e.dataTransfer.setDragImage(this._dragImageEl, 65, 65);
    }
  }

  async _handleRenderPokedex(e) {
    this.isOpen = true;
    await this.updateComplete;
    const dex = this.renderRoot.querySelector("pokedex-app");
    dex?.openWithPokemon(e.detail);
  }

  render() {
    return html`
      <button
        class="pokedex-button"
        draggable="true"
        @click="${this.togglePokedex}"
        @dragstart="${this._handleDragStart}"
      >
        <i class="icon icon-first"></i>
      </button>

      ${this.isOpen
        ? html`
            <div class="backdrop" @click="${this.togglePokedex}">
              <div class="modal-content" @click="${this.stopPropagation}">
                <pokedex-app></pokedex-app>
              </div>
            </div>
          `
        : ""}
    `;
  }
}

customElements.define("navbar-buttons", NavbarButtons);