import { PokeApi } from '../api/poke-api.js';

export class PokemonDataManager {
  constructor(api = new PokeApi()) {
    this.api = api;
  }

  async getResultsCount(url) {
    const data = await this.api.getCount(url);
    return Number(data.count);
  }

  async getPokemonPage({ baseUrl, page, resultsPerPage }) {
    const offset = resultsPerPage * page - resultsPerPage;
    const url = `${baseUrl}?offset=${offset}&limit=${resultsPerPage}`;

    const page_ = await this.api.getPage(url);
    const details = await Promise.all(
      page_.results.map((entry) => this.api.getPokemon(entry.url)),
    );

    return details.map((detail) => this.#toPokemon(detail));
  }

  #toPokemon(detail) {
    const img =
      detail.sprites.other?.dream_world?.front_default ||
      detail.sprites.other?.['official-artwork']?.front_default ||
      detail.sprites.other?.home?.front_default ||
      detail.sprites.front_default;

    return {
      id: detail.id,
      name: detail.name,
      exp: detail.base_experience,
      img: img || null,
      type: detail.types.map((type) => type.type.name),
      stats: {
        hp: detail.stats[0]?.base_stat || 0,
        attack: detail.stats[1]?.base_stat || 0,
        defense: detail.stats[2]?.base_stat || 0,
        special_attack: detail.stats[3]?.base_stat || 0,
        special_defense: detail.stats[4]?.base_stat || 0,
        speed: detail.stats[5]?.base_stat || 0,
      },
      height: detail.height,
      weight: detail.weight,
    };
  }
}
