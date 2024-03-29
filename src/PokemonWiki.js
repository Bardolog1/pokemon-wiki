import { LitElement, html, css } from "lit-element";
import "./components/view/banner-title";
import "./components/view/listar-pokemon";
import "./components/view/paginador-poke";
import "./components/view/navbar-buttons";
import { DataManager } from "./components/API/data-manager";

const events = [
  "number-click",
  "next-click",
  "back-click",
  "end-click",
  "first-click",
];
const EVENTS_LISTENERS = {
  RESULT: "notify-data-results-total",
  LIST: "notify-data-list-of-pokemons",
};

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
    };
  }

  constructor() {
    super();
    this._getResults(0, 5, 60, 1);
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

      paginador-poke {
        width: 100%;
        position: relative;
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

  _getResults(pages, visiblePages, visibleResults, currentPage) {
    const dm = new DataManager();
    dm._getCountResults();
    dm.addEventListener(EVENTS_LISTENERS.RESULT, (e) => {
      this.pages = pages;
      this.elements = Number(e.detail.data);
      this.visiblePages = visiblePages;
      this.visibleResults = visibleResults;
      this.currentPage = currentPage;
      this._getPokemonList({
        page: this.currentPage,
        results_page: this.visibleResults,
        total: this.elements,
      });
    });
  }

  async _getPokemonList(dataPage) {
    const dm = new DataManager();

    dm.addEventListener(EVENTS_LISTENERS.LIST, (e) => {
      this.pokemonList = e.detail.data;
      const list = this.renderRoot.getElementById("list");
      list.pokemons = e.detail.data;
    });
    await dm._getPagesListPoke(dataPage);
  }

  render() {
    return html`
      <div class="container">
        <banner-title
          logo="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
          title="PokeDex with PokéAPI & Lit"
          logo-2="https://lit.dev/images/logo.svg#flame"
        ></banner-title>

        <navbar-buttons></navbar-buttons>

        <paginador-poke
          id="paginator"
          pages="${this.pages}"
          results="${this.elements ? this.elements : 0}"
          visible-pages="${this.visiblePages}"
          current-page="${this.currentPage}"
          visible-results="${this.visibleResults}"
        ></paginador-poke>

        <listar-pokemon id="list"></listar-pokemon>
      </div>
    `;
  }
}
