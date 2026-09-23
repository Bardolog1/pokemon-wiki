import { PokeApi } from '../api/poke-api.js';

export class PokemonDataManager {
  constructor(api = new PokeApi()) {
    this.api = api;
    this.pageCache = new Map();
    this.typeFilterCache = new Map();
  }

  async getResultsCount() {
    const data = await this.api.getPokemonCount();
    return Number(data.count);
  }

  async getPokemonPage({ page, resultsPerPage }) {
    const cacheKey = `${page}:${resultsPerPage}`;
    if (this.pageCache.has(cacheKey)) {
      return this.pageCache.get(cacheKey);
    }

    const offset = resultsPerPage * page - resultsPerPage;
    const details = await this.api.getPokemonPage({ offset, limit: resultsPerPage });
    const pokemonList = details.map((detail) => this.#toPokemon(detail));

    this.pageCache.set(cacheKey, pokemonList);
    return pokemonList;
  }

  async getPokemonByIds(ids) {
    const details = await Promise.all(ids.map((id) => this.api.getPokemon(id)));
    return details.map((detail) => this.#toPokemon(detail));
  }

  async searchPokemon(query) {
    try {
      const detail = await this.api.getPokemon(query);
      return this.#toPokemon(detail);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  // /type/{name} no soporta offset/limit: se pagina localmente.
  async getFilteredPokemonPage({ types, page, resultsPerPage }) {
    const cacheKey = types.slice().sort().join(",");
    let names = this.typeFilterCache.get(cacheKey);

    if (!names) {
      const typeResults = await Promise.all(types.map((t) => this.api.getPokemonByType(t)));
      const seen = new Set();
      names = [];
      typeResults.forEach((typeData) => {
        typeData.pokemon.forEach(({ pokemon }) => {
          if (!seen.has(pokemon.name)) {
            seen.add(pokemon.name);
            names.push(pokemon.name);
          }
        });
      });
      this.typeFilterCache.set(cacheKey, names);
    }

    const offset = resultsPerPage * page - resultsPerPage;
    const pageNames = names.slice(offset, offset + resultsPerPage);
    const pokemons = await this.getPokemonByIds(pageNames);

    return { total: names.length, pokemons };
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
