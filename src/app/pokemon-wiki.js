import { LitElement, html, css } from "lit";
import "../components/banner-title/banner-title.js";
import "../components/pokemon-list/pokemon-list.js";
import "../components/pokemon-list/pokemon-type-filter.js";
import "../components/pagination/pagination.js";
import "../components/navbar-buttons/navbar-buttons.js";
import { PokemonDataManager } from "../services/data-managers/pokemon-data-manager.js";
import { favoritesStore } from "../services/favorites-store.js";

const events = [
  "number-click",
  "next-click",
  "back-click",
  "end-click",
  "first-click",
];

export class PokemonWiki extends LitElement {
  static get properties() {
    return {
      elements: {
        type: Number,
        attribute: false,
      },
      visiblePages: {
        type: Number,
        attribute: false,
      },
      currentPage: {
        type: Number,
        attribute: false,
      },
      visibleResults: {
        type: Number,
        attribute: false,
      },
      pages: {
        type: Number,
        attribute: false,
      },
      pokemonList: {
        type: Array,
        attribute: false,
      },
      error: {
        type: String,
        attribute: false,
      },
      favoritesOnly: {
        type: Boolean,
        attribute: false,
      },
      selectedTypes: {
        type: Array,
        attribute: false,
      },
      filteredTotal: {
        type: Number,
        attribute: false,
      },
    };
  }

  constructor() {
    super();
    this.dataManager = new PokemonDataManager();
    this.error = null;
    this.favoritesOnly = false;
    this.selectedTypes = [];
    this.filteredTotal = 0;
    this._onFavoritesChange = () => {
      if (this.favoritesOnly) this._loadFavorites();
    };
    this._init(0, 5, 20, 1);
  }

  connectedCallback() {
    super.connectedCallback();
    favoritesStore.addEventListener("change", this._onFavoritesChange);
  }

  disconnectedCallback() {
    favoritesStore.removeEventListener("change", this._onFavoritesChange);
    super.disconnectedCallback();
  }

  _listenerChangedPage() {
    const paginator = this.renderRoot.querySelector("#paginator");
    events.forEach((event) => {
      paginator.addEventListener(event, (e) => {
        this._getPokemonList(e.detail);
      });
    });
  }

  firstUpdated() {
    this._listenerChangedPage();
  }

  static get styles() {
    return css`
      @font-face {
        font-family: "PokemonFont";
        src: url(../assets/fonts/Pokemon-Solid.ttf) format("truetype");
        font-weight: normal;
        font-style: normal;
      }

      /* La cabecera (banner, favoritos/tour, paginación) ocupa solo el
         alto que su contenido necesita (flex: 0 0 auto); listar-pokemon se
         queda con TODO el resto vía flex: 1, en vez de pelear por
         porcentajes fijos que no dejaban margen para los controles. */
      .container {
        cursor: url(assets/poke2.png), auto;
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        padding-bottom: 0.75rem;
        box-sizing: border-box;
      }

      banner-title {
        width: 100%;
        flex: 0 0 auto;
      }

      pokemon-type-filter {
        width: 100%;
        flex: 0 0 auto;
        margin-top: 0.3rem;
      }

      pokemon-type-filter.hidden {
        display: none;
      }

      .top-bar {
        width: 100%;
        flex: 0 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.4rem 0;
      }

      pagination-nav {
        width: 100%;
        position: relative;
      }

      pagination-nav.hidden {
        display: none;
      }

      .toolbar-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .tour-trigger {
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.6);
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .tour-trigger:hover {
        background: rgba(255, 255, 255, 0.85);
      }

      .favorites-toggle {
        background: rgba(255, 255, 255, 0.6);
        border: none;
        border-radius: 100px;
        padding: 0.5rem 1.2rem;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .favorites-toggle:hover {
        background: rgba(255, 255, 255, 0.85);
      }

      .favorites-toggle.active {
        background: #ffcb04;
      }

      /* Mismo lenguaje visual que .favorites-toggle/.tour-trigger (píldora
         translúcida blanca, texto oscuro) en vez de texto plano blanco con
         sombra — así no se pierde contra el cielo claro del fondo. */
      .page-info {
        display: inline-block;
        background: rgba(255, 255, 255, 0.6);
        color: #1c2e28;
        border-radius: 100px;
        padding: 0.3rem 0.9rem;
        font-size: 0.75rem;
        font-weight: 600;
        margin: 0.1rem 0 0;
      }

      .empty-favorites {
        color: #fff;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
        font-size: 1rem;
      }

      .error {
        color: #fff;
        background: rgba(180, 30, 30, 0.85);
        padding: 0.5rem 1rem;
        border-radius: 6px;
      }

      listar-pokemon {
        width: 100%;
        flex: 1 1 auto;
        min-height: 0;
        position: relative;
      }

      navbar-buttons {
        height: 0px;
        position: relative;
      }
    `;
  }

  async _init(pages, visiblePages, visibleResults, currentPage) {
    try {
      this.pages = pages;
      this.elements = await this.dataManager.getResultsCount();
      this.visiblePages = visiblePages;
      this.visibleResults = visibleResults;
      this.currentPage = currentPage;
      await this._getPokemonList({
        page: this.currentPage,
        results_page: this.visibleResults,
        total: this.elements,
      });
    } catch (error) {
      this.error = error.message;
    }
  }

  async _getPokemonList(dataPage) {
    if (!dataPage) return;
    this.currentPage = dataPage.page;

    try {
      if (this.selectedTypes.length > 0) {
        const { total, pokemons } = await this.dataManager.getFilteredPokemonPage({
          types: this.selectedTypes,
          page: dataPage.page,
          resultsPerPage: dataPage.results_page,
        });
        this.filteredTotal = total;
        this.pokemonList = pokemons;
      } else {
        this.pokemonList = await this.dataManager.getPokemonPage({
          page: dataPage.page,
          resultsPerPage: dataPage.results_page,
        });
      }
      this.error = null;
      const list = this.renderRoot.getElementById("list");
      list.pokemons = this.pokemonList;
    } catch (error) {
      this.error = error.message;
    }
  }

  // Filtro por tipo: lógica OR (unión de tipos seleccionados). Mutuamente
  // excluyente con "Mis favoritos" para no tener que combinar ambas fuentes
  // de datos a la vez.
  _onTypesChange(e) {
    this.selectedTypes = e.detail;
    this.favoritesOnly = false;
    this._getPokemonList({
      page: 1,
      results_page: this.visibleResults,
    });
  }

  async _loadFavorites() {
    try {
      const ids = favoritesStore.getIds();
      const pokemonList = ids.length > 0 ? await this.dataManager.getPokemonByIds(ids) : [];
      this.pokemonList = pokemonList;
      this.error = null;
      const list = this.renderRoot.getElementById("list");
      list.pokemons = pokemonList;
    } catch (error) {
      this.error = error.message;
    }
  }

  toggleFavoritesOnly() {
    this.favoritesOnly = !this.favoritesOnly;
    if (this.favoritesOnly) {
      this.selectedTypes = [];
      this._loadFavorites();
    } else {
      this._getPokemonList({
        page: this.currentPage,
        results_page: this.visibleResults,
        total: this.elements,
      });
    }
  }

  // Mientras un fetch filtrado está en camino, filteredTotal todavía no se
  // actualizó (arranca en 0/valor anterior) — sin este fallback a
  // this.elements, el paginador recibiría un results=0 transitorio que
  // rompe permanentemente visiblePages/currentPage (ver calcPages: el
  // clamp que aplica ese 0 nunca se revierte cuando llegan los datos
  // reales).
  get _resultsCount() {
    if (this.selectedTypes.length > 0) {
      return this.filteredTotal || this.elements || 0;
    }
    return this.elements || 0;
  }

  get _totalPages() {
    if (!this.visibleResults) return 0;
    return Math.ceil(this._resultsCount / this.visibleResults);
  }

  get _rangeStart() {
    if (this._resultsCount === 0) return 0;
    return (this.currentPage - 1) * this.visibleResults + 1;
  }

  get _rangeEnd() {
    return Math.min(this.currentPage * this.visibleResults, this._resultsCount);
  }

  // Carga driver.js recién cuando se pide el tour, para no sumarlo al
  // bundle inicial de gente que nunca lo usa.
  async _startTour() {
    await this.updateComplete;
    const { startAppTour } = await import("./app-tour.js");
    startAppTour(this);
  }

  render() {
    return html`
      <div class="container">
        <banner-title
          logo="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
          title="Pokédex Interactiva"
        ></banner-title>

        <navbar-buttons></navbar-buttons>

        <pokemon-type-filter
          class="${this.favoritesOnly ? "hidden" : ""}"
          .selected="${this.selectedTypes}"
          @types-change="${this._onTypesChange}"
        ></pokemon-type-filter>

        <div class="top-bar">
          <div class="toolbar-row">
            <button
              type="button"
              class="favorites-toggle ${this.favoritesOnly ? "active" : ""}"
              @click="${this.toggleFavoritesOnly}"
              aria-pressed="${this.favoritesOnly}"
            >
              ★ ${this.favoritesOnly ? "Ver todos" : "Mis favoritos"}
            </button>

            <button
              type="button"
              class="tour-trigger"
              @click="${this._startTour}"
              aria-label="Ver tutorial de la app"
              title="Ver tutorial"
            >
              ?
            </button>
          </div>

          <pagination-nav
            id="paginator"
            class="${this.favoritesOnly ? "hidden" : ""}"
            pages="${this.pages}"
            results="${this._resultsCount}"
            visible-pages="${this.visiblePages}"
            current-page="${this.currentPage}"
            visible-results="${this.visibleResults}"
          ></pagination-nav>

          ${!this.favoritesOnly && this._resultsCount > 0
            ? html`
                <p class="page-info">
                  Mostrando ${this._rangeStart}–${this._rangeEnd} de ${this._resultsCount} · Página
                  ${this.currentPage} de ${this._totalPages}
                </p>
              `
            : ""}

          ${this.error ? html`<p class="error">${this.error}</p>` : ""}

          ${this.favoritesOnly && this.pokemonList?.length === 0
            ? html`<p class="empty-favorites">Todavía no marcaste ningún Pokémon como favorito.</p>`
            : ""}

          ${!this.favoritesOnly && this.selectedTypes.length > 0 && this.pokemonList?.length === 0
            ? html`<p class="empty-favorites">No hay Pokémon con ese tipo.</p>`
            : ""}
        </div>

        <listar-pokemon id="list"></listar-pokemon>
      </div>
    `;
  }
}
