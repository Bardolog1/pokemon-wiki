import { LitElement, html } from "lit";
import "../../components/banner-title/banner-title.js";
import "../../components/pokemon-list/pokemon-list.js";
import "../../components/pokemon-type-filter/pokemon-type-filter.js";
import "../../components/pagination/pagination.js";
import "../../components/page-range-info/page-range-info.js";
import "../../components/navbar-buttons/navbar-buttons.js";
import "../../components/page-toolbar/page-toolbar.js";
import "../../components/favorites-empty/favorites-empty.js";
import { PokemonDataManager } from "../../services/data-managers/pokemon-data-manager.js";
import { favoritesStore } from "../../services/favorites-store.js";
import { computeResultsRange } from "./results-range.js";
import { styles } from "./pokemon-wiki.styles.js";

// Carta fantasma para búsquedas sin resultado; pokemon-card la pinta con "?".
const NOT_FOUND_CARD = { notFound: true, id: 0, name: "Pokémon no encontrado", type: [] };

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
      searchQuery: {
        type: String,
        attribute: false,
      },
      searchNotFound: {
        type: Boolean,
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
    this.searchQuery = "";
    this.searchNotFound = false;
    // Token compartido: solo la última carga de lista gana, así una respuesta lenta no pisa una acción más nueva.
    this._requestId = 0;
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

  static styles = styles;

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
    const requestId = ++this._requestId;

    try {
      let pokemonList;
      let filteredTotal;
      if (this.selectedTypes.length > 0) {
        const { total, pokemons } = await this.dataManager.getFilteredPokemonPage({
          types: this.selectedTypes,
          page: dataPage.page,
          resultsPerPage: dataPage.results_page,
        });
        filteredTotal = total;
        pokemonList = pokemons;
      } else {
        pokemonList = await this.dataManager.getPokemonPage({
          page: dataPage.page,
          resultsPerPage: dataPage.results_page,
        });
      }
      if (requestId !== this._requestId) return;
      if (filteredTotal !== undefined) this.filteredTotal = filteredTotal;
      this.pokemonList = pokemonList;
      this.error = null;
      const list = this.renderRoot.getElementById("list");
      list.pokemons = this.pokemonList;
    } catch (error) {
      this.error = error.message;
    }
  }

  // Filtro por tipo (OR). Excluyente con "Mis favoritos" para no combinar dos fuentes de datos.
  _onTypesChange(e) {
    this.selectedTypes = e.detail;
    this.favoritesOnly = false;
    this._resetSearch();
    this._getPokemonList({
      page: 1,
      results_page: this.visibleResults,
    });
  }

  _resetSearch() {
    this.searchQuery = "";
    this.searchNotFound = false;
  }

  // Reemplaza la lista por el resultado único y apaga favoritos/tipos.
  async _onSearchSubmit(e) {
    const { query, raw } = e.detail;
    // Se guarda el texto original para el input; la consulta normalizada solo va a la API.
    this.searchQuery = raw;
    this.favoritesOnly = false;
    this.selectedTypes = [];
    const requestId = ++this._requestId;
    try {
      const pokemon = await this.dataManager.searchPokemon(query);
      if (requestId !== this._requestId) return;
      this.searchNotFound = pokemon === null;
      this.pokemonList = pokemon ? [pokemon] : [NOT_FOUND_CARD];
      this.error = null;
      this.renderRoot.getElementById("list").pokemons = this.pokemonList;
    } catch (error) {
      if (requestId !== this._requestId) return;
      // Ante un error de red/servidor se sale del modo búsqueda para mantener coherentes lista y paginador.
      this._resetSearch();
      this.error = error.message;
    }
  }

  _onSearchClear() {
    this._resetSearch();
    this._getPokemonList({
      page: this.currentPage,
      results_page: this.visibleResults,
      total: this.elements,
    });
  }

  async _loadFavorites() {
    const requestId = ++this._requestId;
    try {
      const ids = favoritesStore.getIds();
      const pokemonList = ids.length > 0 ? await this.dataManager.getPokemonByIds(ids) : [];
      if (requestId !== this._requestId) return;
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
      this._resetSearch();
      this._loadFavorites();
    } else {
      this._getPokemonList({
        page: this.currentPage,
        results_page: this.visibleResults,
        total: this.elements,
      });
    }
  }

  // Cálculo del rango mostrado en la cabecera — ver results-range.js.
  get _range() {
    return computeResultsRange({
      selectedTypes: this.selectedTypes,
      filteredTotal: this.filteredTotal,
      elements: this.elements,
      currentPage: this.currentPage,
      visibleResults: this.visibleResults,
    });
  }

  // driver.js se carga bajo demanda para no inflar el bundle inicial.
  async _startTour() {
    await this.updateComplete;
    const { startAppTour } = await import("../app-tour/app-tour.js");
    startAppTour(this);
  }

  render() {
    return html`
      <div class="container">
        <banner-title
          logo="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
        ></banner-title>

        <navbar-buttons></navbar-buttons>

        <pokemon-type-filter
          class="${this.favoritesOnly ? "hidden" : ""}"
          .selected="${this.selectedTypes}"
          @types-change="${this._onTypesChange}"
        ></pokemon-type-filter>

        <div class="top-bar">
          <page-toolbar
            .favoritesOnly="${this.favoritesOnly}"
            .searchQuery="${this.searchQuery}"
            @search-submit="${this._onSearchSubmit}"
            @search-clear="${this._onSearchClear}"
            @favorites-toggle-click="${this.toggleFavoritesOnly}"
            @tour-click="${this._startTour}"
          ></page-toolbar>

          <pagination-nav
            id="paginator"
            class="${this.favoritesOnly || this.searchQuery ? "hidden" : ""}"
            pages="${this.pages}"
            results="${this._range.resultsCount}"
            visible-pages="${this.visiblePages}"
            current-page="${this.currentPage}"
            visible-results="${this.visibleResults}"
          ></pagination-nav>

          ${!this.favoritesOnly && !this.searchQuery && this._range.resultsCount > 0
            ? html`
                <page-range-info
                  .rangeStart="${this._range.rangeStart}"
                  .rangeEnd="${this._range.rangeEnd}"
                  .total="${this._range.resultsCount}"
                  .currentPage="${this.currentPage}"
                  .totalPages="${this._range.totalPages}"
                ></page-range-info>
              `
            : ""}

          ${this.error ? html`<p class="error">${this.error}</p>` : ""}


          ${this.favoritesOnly && this.pokemonList?.length === 0
            ? html`<favorites-empty></favorites-empty>`
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
