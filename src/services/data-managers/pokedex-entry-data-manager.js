import { PokeApi } from '../api/poke-api.js';

export class PokedexEntryDataManager {
  #maxCount = null;

  constructor(api = new PokeApi()) {
    this.api = api;
  }

  /**
   * Consulta el total de Pokémon registrados en la API
   */
  async getMaxPokemonCount(baseUrl) {
    if (this.#maxCount) return this.#maxCount;
    try {
      const data = await this.api.getPokemon(`${baseUrl}?limit=1`);
      this.#maxCount = data.count;
      return this.#maxCount;
    } catch (e) {
      return 1025; // Valor de respaldo si falla la consulta inicial
    }
  }

async getFullEntry({ baseUrl, query }) {
    const numericId = Number(query);

    // 1. Validar límites de la PokeAPI
    if (query !== '' && !isNaN(numericId)) {
      const isValidNational = numericId >= 1 && numericId <= 1025;
      const isValidSpecialForm = numericId >= 10001 && numericId <= 10350;

      if (!isValidNational && !isValidSpecialForm) {
        throw new Error('NotFound');
      }
    }

    try {
      // 2. Obtener datos base del Pokémon (sprites, stats, types, moves)
      // Usamos this.api si tiene un método genérico, o fetch directo si baseUrl ya es la ruta correcta
      const pokemonResponse = await fetch(`${baseUrl}/${query.toString().toLowerCase()}`);
      if (!pokemonResponse.ok) throw new Error('NotFound');
      const pokemonData = await pokemonResponse.json();

      // 3. Obtener datos de la Especie (para la descripción en la Pokédex)
      // IMPORTANTE: Usamos la URL que viene dentro de pokemonData para evitar errores de 404 con las formas especiales
      const speciesResponse = await fetch(pokemonData.species.url);
      if (!speciesResponse.ok) throw new Error('NotFound');
      const speciesData = await speciesResponse.json();

      // 4. Obtener datos de Evolución
      const evoResponse = await fetch(speciesData.evolution_chain.url);
      const evoData = await evoResponse.json();
      const evolutions = this.#extractEvolutionLine(evoData.chain);

      // 5. Enviar todo a tu formateador privado
      return this.#formatPokedexEntry(pokemonData, speciesData, evolutions);

    } catch (error) {
      // Propagamos el error para que PokedexApp muestre "NOT FOUND" o el error correspondiente
      throw error;
    }
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
