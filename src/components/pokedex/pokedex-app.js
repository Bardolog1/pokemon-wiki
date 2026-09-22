import { LitElement, html, css } from "lit";
import { styles } from "./pokedex-app.styles.js";
import { PokedexEntryDataManager } from "../../services/data-managers/pokedex-entry-data-manager.js";
import "./pokedex-screen.js";

export class PokedexApp extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    isOn: { type: Boolean },
    searchValue: { type: String },
    pokemon: { type: Object },
    isLoading: { type: Boolean },
    error: { type: Boolean },
    activeView: { type: Number },
    yellowFlash: { type: Boolean },
  };

  static styles = [styles];

  constructor() {
    super();
    this.isOpen = false;
    this.isOn = false;
    this.searchValue = "";
    this.pokemon = null;
    this.isLoading = false;
    this.error = false;
    this.activeView = 0;
    this.yellowFlash = false;

    this.entryDataManager = new PokedexEntryDataManager();
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen && this.isOn) {
      this.isOn = false;
      this.resetSearch();
    }
  }

  togglePower() {
    this.isOn = !this.isOn;
    if (!this.isOn) {
      this.resetSearch();
    }
  }

  // Se invoca desde afuera (navbar-buttons) cuando se pide abrir la pokedex
  // ya precargada con un pokemon puntual (click en el ícono de una card, o
  // soltar el ícono de la pokedex sobre una card).
  openWithPokemon(pokemon) {
    this.isOpen = true;
    this.isOn = true;
    if (pokemon?.id) {
      this.executeSearch(String(pokemon.id));
    }
  }

  triggerYellowFlash() {
    this.yellowFlash = true;
    setTimeout(() => {
      this.yellowFlash = false;
    }, 150);
  }

  handleNumberClick(num) {
    if (!this.isOn) return;
    if (this.searchValue.length < 7) {
      this.searchValue += num.toString();
      this.triggerYellowFlash();
    }
  }

  handleDelete() {
    if (!this.isOn) return;
    if (this.searchValue.length > 0) {
      this.searchValue = this.searchValue.slice(0, -1);
    }
    this.pokemon = null;
    this.error = false;
    this.triggerYellowFlash();
  }

  resetSearch() {
    this.searchValue = "";
    this.pokemon = null;
    this.error = false;
    this.isLoading = false;
    this.activeView = 0;
    if (this.isOn) this.triggerYellowFlash();
  }

  async executeSearch(query) {
    if (!this.isOn || !query) return;

    this.isLoading = true;
    this.error = false;
    this.pokemon = null;
    this.activeView = 0;

    try {
      this.pokemon = await this.entryDataManager.getFullEntry({ query });
      this.searchValue = "";
    } catch (err) {
      this.error = true;
    } finally {
      this.isLoading = false;
    }
  }

  handleSearch() {
    if (!this.isOn || this.searchValue.trim() === "") return;
    this.triggerYellowFlash();
    this.executeSearch(this.searchValue);
  }

  navigateStep(offset) {
    if (!this.isOn || this.isLoading) return;
    this.triggerYellowFlash();

    let currentId = this.pokemon ? this.pokemon.id : parseInt(this.searchValue, 10) || 1;
    let targetId = currentId + offset;

    if (currentId === 1025 && offset > 0) {
      targetId = 10001;
    } else if (currentId === 10001 && offset < 0) {
      targetId = 1025;
    }

    if (targetId < 1) targetId = 1;
    this.executeSearch(targetId.toString());
  }

  navigateInfo(direction) {
    if (!this.pokemon || !this.isOn) return;
    const totalViews = 5;
    if (direction === "right") {
      this.activeView = (this.activeView + 1) % totalViews;
    } else if (direction === "left") {
      this.activeView = (this.activeView - 1 + totalViews) % totalViews;
    }
  }

  handleDpadScroll(direction) {
    if (!this.pokemon || !this.isOn) return;
    const screen = this.renderRoot.querySelector("pokedex-screen");
    if (!screen) return;
    screen.scrollBy(direction === "down" ? 40 : -40);
  }

  get formattedTypes() {
    if (!this.pokemon) return "???";
    if (this.pokemon.types && Array.isArray(this.pokemon.types)) {
      return this.pokemon.types.join("/");
    } else if (this.pokemon.type) {
      return Array.isArray(this.pokemon.type) ? this.pokemon.type.join("/") : String(this.pokemon.type);
    }
    return "???";
  }

  renderSecondaryInfo() {
    if (!this.isOn) return html``;

    if (this.pokemon) {
      const name = this.pokemon.name || "DESC";
      return html`
        <div class="poke-info-mini">
          <div>${String(name).toUpperCase()}</div>
          <div class="type-text">TIPO: ${String(this.formattedTypes).toUpperCase()}</div>
        </div>
      `;
    }

    return html` <div class="typing-number">${this.searchValue || (this.isOn ? "0" : "")}</div> `;
  }

  renderLeftHalf() {
    const displayNum = this.pokemon
      ? `#${String(this.pokemon.id).padStart(3, "0")}`
      : this.searchValue || "---";

    return html`
      <div class="left-half">
        <div class="top-sensor-area">
          <div class="lens-container">
            <div class="main-lens ${this.isLoading ? "blinking" : ""}"></div>
          </div>
          <div class="mini-leds ${this.isLoading ? "loading-sequence" : ""}">
            <div class="led red"></div>
            <div class="led yellow"></div>
            <div class="led green"></div>
          </div>
        </div>

        <div class="screen-bezel">
          <div class="bezel-top-dots">
            <div class="bezel-dot"></div>
            <div class="bezel-dot"></div>
          </div>
          <pokedex-screen
            .pokemon=${this.pokemon}
            .isLoading=${this.isLoading}
            .error=${this.error}
            .activeView=${this.activeView}
            .isOn=${this.isOn}
          ></pokedex-screen>
          <div class="bezel-bottom">
            <div class="red-bezel-btn"></div>
            <div class="speaker-grill">
              <div class="speaker-line"></div>
              <div class="speaker-line"></div>
              <div class="speaker-line"></div>
              <div class="speaker-line"></div>
            </div>
          </div>
        </div>

        <div class="lower-controls">
          <div class="power-btn-container">
            <div class="power-btn" @click="${this.togglePower}">
              ${this.isOpen && !this.isOn ? html`<div class="turn-on-hint">↓ ON</div>` : ""}
            </div>
          </div>

          <div class="mini-green-screen ${this.isOn ? "is-on" : ""}">${this.isOn ? displayNum : ""}</div>

          <div class="d-pad">
            <div class="d-pad-v"></div>
            <div class="d-pad-h"></div>
            <div class="d-pad-center"></div>

            <div class="d-pad-clickable d-pad-left" @click="${() => this.navigateInfo("left")}"></div>
            <div class="d-pad-clickable d-pad-right" @click="${() => this.navigateInfo("right")}"></div>
            <div class="d-pad-clickable d-pad-up" @click="${() => this.handleDpadScroll("up")}"></div>
            <div class="d-pad-clickable d-pad-down" @click="${() => this.handleDpadScroll("down")}"></div>
          </div>
        </div>
      </div>
    `;
  }

  renderRightHalf() {
    const gridNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

    const shellSvgInterior = html`
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

    const shellSvgExterior = html`
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

    return html`
      <div class="right-half ${this.isOpen ? "open" : "closed"}">
        <div class="right-cover-exterior">${shellSvgExterior}</div>

        <div class="right-content">
          <div class="right-shell-svg-container">${shellSvgInterior}</div>

          <div class="inner-components">
            <div class="secondary-screen ${this.isOn ? "is-on" : ""}">${this.renderSecondaryInfo()}</div>

            <div class="grid-buttons">
              ${gridNumbers.map(
                (num) => html`
                  <div class="grid-btn" @click="${() => this.handleNumberClick(num)}">${num}</div>
                `,
              )}
            </div>

            <div class="middle-controls">
              <div class="white-btns">
                <div class="white-btn" @click="${this.handleDelete}" title="Borrar y limpiar búsqueda">DEL</div>
                <div class="white-btn bold-red" @click="${this.handleSearch}" title="Buscar">GO</div>
              </div>
              <div
                class="yellow-btn ${this.yellowFlash ? "flash" : ""}"
                @click="${this.resetSearch}"
                title="Reiniciar búsqueda"
              ></div>
            </div>

            <div class="bottom-controls">
              <div class="dark-green-btn" @click="${() => this.navigateStep(-1)}" title="Pokémon anterior">
                ◄ PREV
              </div>
              <div class="dark-green-btn" @click="${() => this.navigateStep(1)}" title="Pokémon siguiente">
                NEXT ►
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <button class="toggle-cover-btn" @click="${this.toggleOpen}">
        ${this.isOpen ? "▲ CERRAR TAPA ▲" : "▼ ABRIR TAPA ▼"}
      </button>

      <div class="pokedex-container">
        <div class="pokedex">
          ${this.renderLeftHalf()}

          <div class="hinge">
            <div class="hinge-joint"></div>
            <div class="hinge-joint"></div>
            <div class="hinge-joint"></div>
          </div>

          ${this.renderRightHalf()}
        </div>
      </div>
    `;
  }
}
customElements.define("pokedex-app", PokedexApp);
