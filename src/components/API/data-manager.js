import { LitElement } from "lit-element";
import { ApiRequest } from "./api-request";

const URL = "https://pokeapi.co/api/v2/pokemon";
const EVENTS = {
  BASE: "notify-data-",
  RESULTS_TOTAL: "results-total",
  LIST_OF_POKEMONS: "list-of-pokemons",
};
const TYPE_LISTENERS = {
  BASICS: "request-basics",
  LIST: "request-list-pokes",
  FIRST_DATA: "request-pokemon-first-data",
  ERROR: "request-error",
};

export class DataManager extends LitElement {
  constructor() {
    super();
  }

  async _getCountResults() {
    try {
      const api = new ApiRequest();
      api.addEventListener(TYPE_LISTENERS.BASICS, (event) => {
        this._dmNotifyEvent(EVENTS.RESULTS_TOTAL, event.detail.data.count);
      });

      await api._getBasicsPokemon(URL);
    } catch {
      console.error(error);
    }
  }

  async _getPagesListPoke(dataPages) {
    if (!dataPages) return;

    const { results_page, page } = dataPages;
    const offset = results_page * page - results_page;
    const limit = results_page;
    const url = URL + `?offset=${offset}&limit=${limit}`;

    try {
      const api = new ApiRequest();

      api.addEventListener(TYPE_LISTENERS.LIST, async (event) => {
        const data = event.detail.data;
        const pokemonPromises = data.results.map((element) =>
          this._getPokeFirstDetail(element.url)
        );

        try {
          const pokemonList = await Promise.all(pokemonPromises);
          this._dmNotifyEvent(EVENTS.LIST_OF_POKEMONS, pokemonList);
        } catch (error) {
          console.error(error);
        }
      });

      await api._getPagePokes(url);
    } catch (error) {
      console.error(error);
    }
  }

  async _getPokeFirstDetail(url) {
    return new Promise((resolve, reject) => {
      const api = new ApiRequest();

      api.addEventListener(TYPE_LISTENERS.FIRST_DATA, (event) => {
        const detail = event.detail.data;
        const pokemon = this._constructPokefirst(detail);
        resolve(pokemon);
      });

      api.addEventListener(TYPE_LISTENERS.ERROR, (event) => {
        reject(event.detail.error);
      });

      api._getPokemonEndpoint(url);
    });
  }

  _constructPokefirst(detail) {
    const imgURL =
      detail.sprites.other.dream_world.front_default ||
      detail.sprites.other["official-artwork"].front_default ||
      detail.sprites.other.home.front_default ||
      detail.sprites.front_default;

    return {
      id: detail.id,
      name: detail.name,
      exp: detail.base_experience, //608 max
      img: imgURL || null,
      type: detail.types.map((type) => type.type.name),
      stats: {
        hp: detail.stats[0]?.base_stat || 0, //255 max
        attack: detail.stats[1]?.base_stat || 0, //190 max
        defense: detail.stats[2]?.base_stat || 0, //250 max
        special_attack: detail.stats[3]?.base_stat || 0, //194 max
        special_defense: detail.stats[4]?.base_stat || 0, //250 max
        speed: detail.stats[5]?.base_stat || 0, //180 max
      },
      height: detail.height,
      weight: detail.weight,
    };
  }

  _dmNotifyEvent(type, data) {
    this.dispatchEvent(
      new CustomEvent(`${EVENTS.BASE}${type}`, {
        detail: { data },
        bubbles: true,
        composed: true,
      })
    );
  }
}
customElements.define("data-manager", DataManager);
