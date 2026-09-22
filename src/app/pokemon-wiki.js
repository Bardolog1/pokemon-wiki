import { LitElement, html, css } from "lit";
import "../components/banner-title/banner-title.js";
import "../components/pokemon-list/pokemon-list.js";
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
    };
  }

  constructor() {
    super();
    this.dataManager = new PokemonDataManager();
    this.error = null;
    this.favoritesOnly = false;
    this._onFavoritesChange = () => {
      if (this.favoritesOnly) this._loadFavorites();
    };
    this._init(0, 5, 60, 1);
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

      .container {
        cursor: url(assets/poke2.png), auto;
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }

      banner-title {
        width: 100%;
        height: 30%;
        position: relative;
      }

      pagination-nav {
        width: 100%;
        position: relative;
      }

      pagination-nav.hidden {
        display: none;
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
        height: 60%;
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

    try {
      const pokemonList = await this.dataManager.getPokemonPage({
        page: dataPage.page,
        resultsPerPage: dataPage.results_page,
      });
      this.pokemonList = pokemonList;
      this.error = null;
      const list = this.renderRoot.getElementById("list");
      list.pokemons = pokemonList;
    } catch (error) {
      this.error = error.message;
    }
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
      this._loadFavorites();
    } else {
      this._getPokemonList({
        page: this.currentPage,
        results_page: this.visibleResults,
        total: this.elements,
      });
    }
  }

  render() {
    return html`
      <div class="container">
        <banner-title
          logo="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
          title="Pokédex Interactiva"
        ></banner-title>

        <navbar-buttons></navbar-buttons>

        <button
          type="button"
          class="favorites-toggle ${this.favoritesOnly ? "active" : ""}"
          @click="${this.toggleFavoritesOnly}"
          aria-pressed="${this.favoritesOnly}"
        >
          ★ ${this.favoritesOnly ? "Ver todos" : "Mis favoritos"}
        </button>

        <pagination-nav
          id="paginator"
          class="${this.favoritesOnly ? "hidden" : ""}"
          pages="${this.pages}"
          results="${this.elements ? this.elements : 0}"
          visible-pages="${this.visiblePages}"
          current-page="${this.currentPage}"
          visible-results="${this.visibleResults}"
        ></pagination-nav>

        ${this.error ? html`<p class="error">${this.error}</p>` : ""}

        ${this.favoritesOnly && this.pokemonList?.length === 0
          ? html`<p class="empty-favorites">Todavía no marcaste ningún Pokémon como favorito.</p>`
          : ""}

        <listar-pokemon id="list"></listar-pokemon>
      </div>
    `;
  }
}
