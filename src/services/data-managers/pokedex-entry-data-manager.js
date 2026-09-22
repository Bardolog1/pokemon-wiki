import { PokeApi } from '../api/poke-api.js';

export class PokedexEntryDataManager {
  constructor(api = new PokeApi()) {
    this.api = api;
  }

  async getFullEntry({ query }) {
    const numericId = Number(query);

    // 1. Validar límites de la PokeAPI
    if (query !== '' && !isNaN(numericId)) {
      const isValidNational = numericId >= 1 && numericId <= 1025;
      const isValidSpecialForm = numericId >= 10001 && numericId <= 10350;

      if (!isValidNational && !isValidSpecialForm) {
        throw new Error('NotFound');
      }
    }

    // 2-4. PokeApi resuelve internamente pokemon -> especie -> cadena de evolución
    const { pokemon, species, evolutionChain } = await this.api.getPokemonFullEntry(query);
    const evolutions = this.#extractEvolutionLine(evolutionChain.chain);

    // 5. Enviar todo a tu formateador privado
    return this.#formatPokedexEntry(pokemon, species, evolutions);
  }

  // --- Métodos Privados ---

  #formatPokedexEntry(pokemon, species, evolutions) {
    const flavorEntry = species.flavor_text_entries.find(e => e.language.name === 'es')
                     || species.flavor_text_entries.find(e => e.language.name === 'en');

    const description = flavorEntry
      ? flavorEntry.flavor_text.replace(/[\n\f]/g, ' ')
      : 'Sin datos en la Pokédex.';

    const retroImg =
      pokemon.sprites.versions?.['generation-i']?.['red-blue']?.front_transparent ||
      pokemon.sprites.versions?.['generation-ii']?.crystal?.front_transparent ||
      pokemon.sprites.front_default;

    return {
      id: pokemon.id,
      name: pokemon.name,
      img: retroImg,
      type: pokemon.types.map(t => t.type.name),
      description: description,
      evolutions: evolutions,
      moves: pokemon.moves.slice(0, 15).map(m => m.move.name.replace('-', ' ')),
      stats: {
        hp: pokemon.stats[0]?.base_stat || 0,
        attack: pokemon.stats[1]?.base_stat || 0,
        defense: pokemon.stats[2]?.base_stat || 0,
        speed: pokemon.stats[5]?.base_stat || 0,
      }
    };
  }

  #extractEvolutionLine(chain) {
    const evos = [];
    let current = chain;

    while (current) {
      evos.push(current.species.name);
      current = current.evolves_to[0];
    }

    return evos;
  }
}
