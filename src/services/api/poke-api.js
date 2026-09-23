const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const TYPE_URL = "https://pokeapi.co/api/v2/type";

export class PokeApi {
  async #request(url) {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`PokeApi request failed with status ${response.status} for ${url}`);
    }
    return response.json();
  }

  async getPokemonCount() {
    return this.#request(BASE_URL);
  }

  async getPokemonPage({ offset, limit }) {
    const list = await this.#request(`${BASE_URL}?offset=${offset}&limit=${limit}`);
    return Promise.all(list.results.map((entry) => this.#request(entry.url)));
  }

  async getPokemon(query) {
    return this.#request(`${BASE_URL}/${String(query).toLowerCase()}`);
  }

  async getPokemonByType(typeName) {
    return this.#request(`${TYPE_URL}/${String(typeName).toLowerCase()}`);
  }

  async getPokemonFullEntry(query) {
    const pokemon = await this.getPokemon(query);
    const species = await this.#request(pokemon.species.url);
    const evolutionChain = await this.#request(species.evolution_chain.url);
    return { pokemon, species, evolutionChain };
  }
}
