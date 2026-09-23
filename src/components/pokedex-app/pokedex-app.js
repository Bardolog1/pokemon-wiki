import { LitElement, html, css } from "lit";
import { styles } from "./pokedex-app.styles.js";
import { PokedexEntryDataManager } from "../../services/data-managers/pokedex-entry-data-manager.js";
import { speakPokemonEntry } from "./pokedex-voice.js";
import { SHELL_SVG_INTERIOR, SHELL_SVG_EXTERIOR } from "./pokedex-app.shell.js";
import "../pokedex-screen/pokedex-screen.js";
import "../pokedex-sensor/pokedex-sensor.js";
import "../pokedex-dpad/pokedex-dpad.js";
import "../pokedex-numpad/pokedex-numpad.js";
import "../pokedex-nav-buttons/pokedex-nav-buttons.js";

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
    isPlayingCry: { type: Boolean },
    isSpeaking: { type: Boolean },
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
    this.isPlayingCry = false;
    this.isSpeaking = false;

    this.entryDataManager = new PokedexEntryDataManager();
  }

  disconnectedCallback() {
    window.speechSynthesis?.cancel();
    super.disconnectedCallback();
  }

  // Narra la entrada actual (ver pokedex-voice.js). Actualmente no se invoca.
  speakEntry() {
    if (!this.isOn || !this.pokemon) return;
    this.isSpeaking = true;
    speakPokemonEntry(this.pokemon, {
      onEnd: () => {
        this.isSpeaking = false;
      },
    });
  }

  // Botón rojo bajo la pantalla; mientras suena, el lente azul parpadea (animación "blinking").
  playCry() {
    if (!this.isOn || !this.pokemon?.cry || this.isPlayingCry) return;

    const audio = new Audio(this.pokemon.cry);
    this.isPlayingCry = true;
    const stop = () => {
      this.isPlayingCry = false;
    };
    audio.addEventListener("ended", stop);
    audio.addEventListener("error", stop);
    audio.play().catch(stop);
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

  // Abre la Pokédex ya cargada con un Pokémon puntual (la invoca navbar-buttons).
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
    window.speechSynthesis?.cancel();
    this.isSpeaking = false;
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
      // Narración por voz desactivada.
      // this.speakEntry();
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

  // pokedex-dpad no interpreta direcciones: izq/der cambian de vista, arriba/abajo hacen scroll.
  onDpadClick(e) {
    const { direction } = e.detail;
    if (direction === "left" || direction === "right") {
      this.navigateInfo(direction);
    } else {
      this.handleDpadScroll(direction);
    }
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
        <pokedex-sensor
          .blinking=${this.isLoading || this.isPlayingCry || this.isSpeaking}
          .loading=${this.isLoading}
        ></pokedex-sensor>

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
            <button
              type="button"
              class="red-bezel-btn"
              @click="${this.playCry}"
              title="Reproducir sonido del Pokémon"
              aria-label="Reproducir sonido del Pokémon"
            ></button>
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
            <button
              type="button"
              class="power-btn"
              @click="${this.togglePower}"
              aria-label="${this.isOn ? "Apagar la Pokédex" : "Encender la Pokédex"}"
              aria-pressed="${this.isOn}"
            >
              ${this.isOpen && !this.isOn ? html`<div class="turn-on-hint">↓ ON</div>` : ""}
            </button>
          </div>

          <div class="mini-green-screen ${this.isOn ? "is-on" : ""}">${this.isOn ? displayNum : ""}</div>

          <pokedex-dpad @dpad-click="${this.onDpadClick}"></pokedex-dpad>
        </div>
      </div>
    `;
  }

  renderRightHalf() {
    return html`
      <div class="right-half ${this.isOpen ? "open" : "closed"}">
        <div class="right-cover-exterior">${SHELL_SVG_EXTERIOR}</div>

        <div class="right-content">
          <div class="right-shell-svg-container">${SHELL_SVG_INTERIOR}</div>

          <div class="inner-components">
            <div class="secondary-screen ${this.isOn ? "is-on" : ""}">${this.renderSecondaryInfo()}</div>

            <pokedex-numpad
              .yellowFlash=${this.yellowFlash}
              @digit-click="${(e) => this.handleNumberClick(e.detail.digit)}"
              @delete-click="${this.handleDelete}"
              @search-click="${this.handleSearch}"
              @reset-click="${this.resetSearch}"
            ></pokedex-numpad>

            <pokedex-nav-buttons
              @prev-click="${() => this.navigateStep(-1)}"
              @next-click="${() => this.navigateStep(1)}"
            ></pokedex-nav-buttons>
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
