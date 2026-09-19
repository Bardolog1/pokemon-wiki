import { describe, it, expect, vi } from 'vitest';
import { PokemonDataManager } from './pokemon-data-manager.js';

function makeFakeApi(overrides = {}) {
  return {
    getCount: vi.fn().mockResolvedValue({ count: 1302 }),
    getPage: vi.fn().mockResolvedValue({
      results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    }),
    getPokemon: vi.fn().mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      base_experience: 64,
      sprites: {
        front_default: 'front.png',
        other: {
          dream_world: { front_default: null },
          'official-artwork': { front_default: 'artwork.png' },
          home: { front_default: null },
        },
      },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: [
        { base_stat: 45 },
        { base_stat: 49 },
        { base_stat: 49 },
        { base_stat: 65 },
        { base_stat: 65 },
        { base_stat: 45 },
      ],
      height: 7,
      weight: 69,
    }),
    ...overrides,
  };
}

describe('PokemonDataManager', () => {
  it('getResultsCount returns the numeric count from the API', async () => {
    const dm = new PokemonDataManager(makeFakeApi());

    const count = await dm.getResultsCount('https://pokeapi.co/api/v2/pokemon');

    expect(count).toBe(1302);
  });

  it('getPokemonPage fetches the page then each pokemon detail, transformed', async () => {
    const api = makeFakeApi();
    const dm = new PokemonDataManager(api);

    const list = await dm.getPokemonPage({
      baseUrl: 'https://pokeapi.co/api/v2/pokemon',
      page: 1,
      resultsPerPage: 5,
    });

    expect(api.getPage).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=5',
    );
    expect(list).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        exp: 64,
        img: 'artwork.png',
        type: ['grass', 'poison'],
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          special_attack: 65,
          special_defense: 65,
          speed: 45,
        },
        height: 7,
        weight: 69,
      },
    ]);
  });

  it('falls back to front_default sprite when no "other" artwork exists', async () => {
    const api = makeFakeApi({
      getPokemon: vi.fn().mockResolvedValue({
        id: 2,
        name: 'ivysaur',
        base_experience: 142,
        sprites: { front_default: 'front.png', other: {} },
        types: [],
        stats: [],
        height: 10,
        weight: 130,
      }),
    });
    const dm = new PokemonDataManager(api);

    const [pokemon] = await dm.getPokemonPage({
      baseUrl: 'https://pokeapi.co/api/v2/pokemon',
      page: 1,
      resultsPerPage: 1,
    });

    expect(pokemon.img).toBe('front.png');
  });

  it('propagates a rejection from the API layer', async () => {
    const api = makeFakeApi({ getCount: vi.fn().mockRejectedValue(new Error('boom')) });
    const dm = new PokemonDataManager(api);

    await expect(dm.getResultsCount('https://pokeapi.co/api/v2/pokemon')).rejects.toThrow('boom');
  });
});
