import { describe, it, expect, vi } from 'vitest';
import { PokemonDataManager } from './pokemon-data-manager.js';

function makeFakeApi(overrides = {}) {
  return {
    getPokemonCount: vi.fn().mockResolvedValue({ count: 1302 }),
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
    getPokemonPage: vi.fn().mockResolvedValue([
      {
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
      },
    ]),
    ...overrides,
  };
}

describe('PokemonDataManager', () => {
  it('getResultsCount returns the numeric count from the API', async () => {
    const dm = new PokemonDataManager(makeFakeApi());

    const count = await dm.getResultsCount();

    expect(count).toBe(1302);
  });

  it('getPokemonPage asks the API for the offset/limit page, transformed', async () => {
    const api = makeFakeApi();
    const dm = new PokemonDataManager(api);

    const list = await dm.getPokemonPage({ page: 1, resultsPerPage: 5 });

    expect(api.getPokemonPage).toHaveBeenCalledWith({ offset: 0, limit: 5 });
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

  it('caches a page so a repeated request does not hit the API again', async () => {
    const api = makeFakeApi();
    const dm = new PokemonDataManager(api);

    const first = await dm.getPokemonPage({ page: 1, resultsPerPage: 5 });
    const second = await dm.getPokemonPage({ page: 1, resultsPerPage: 5 });

    expect(api.getPokemonPage).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
  });

  it('treats different pages/page sizes as separate cache entries', async () => {
    const api = makeFakeApi();
    const dm = new PokemonDataManager(api);

    await dm.getPokemonPage({ page: 1, resultsPerPage: 5 });
    await dm.getPokemonPage({ page: 2, resultsPerPage: 5 });

    expect(api.getPokemonPage).toHaveBeenCalledTimes(2);
    expect(api.getPokemonPage).toHaveBeenNthCalledWith(2, { offset: 5, limit: 5 });
  });

  it('falls back to front_default sprite when no "other" artwork exists', async () => {
    const api = makeFakeApi({
      getPokemonPage: vi.fn().mockResolvedValue([
        {
          id: 2,
          name: 'ivysaur',
          base_experience: 142,
          sprites: { front_default: 'front.png', other: {} },
          types: [],
          stats: [],
          height: 10,
          weight: 130,
        },
      ]),
    });
    const dm = new PokemonDataManager(api);

    const [pokemon] = await dm.getPokemonPage({ page: 1, resultsPerPage: 1 });

    expect(pokemon.img).toBe('front.png');
  });

  it('getPokemonByIds fetches each id directly and transforms the results', async () => {
    const api = makeFakeApi();
    const dm = new PokemonDataManager(api);

    const list = await dm.getPokemonByIds([1]);

    expect(api.getPokemon).toHaveBeenCalledWith(1);
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

  it('getFilteredPokemonPage unions (OR) types, dedupes, and paginates locally', async () => {
    const api = makeFakeApi({
      getPokemonByType: vi.fn((type) => {
        if (type === 'fire') {
          return Promise.resolve({
            pokemon: [
              { pokemon: { name: 'charmander' } },
              { pokemon: { name: 'vulpix' } },
            ],
          });
        }
        return Promise.resolve({
          pokemon: [
            { pokemon: { name: 'vulpix' } },
            { pokemon: { name: 'pidgey' } },
          ],
        });
      }),
      getPokemon: vi.fn((name) => Promise.resolve({
        id: 1,
        name,
        base_experience: 1,
        sprites: { front_default: 'front.png', other: {} },
        types: [],
        stats: [],
        height: 1,
        weight: 1,
      })),
    });
    const dm = new PokemonDataManager(api);

    const { total, pokemons } = await dm.getFilteredPokemonPage({
      types: ['fire', 'flying'],
      page: 1,
      resultsPerPage: 2,
    });

    expect(total).toBe(3);
    expect(pokemons.map((p) => p.name)).toEqual(['charmander', 'vulpix']);
  });

  it('getFilteredPokemonPage caches by type combination, regardless of order', async () => {
    const api = makeFakeApi({
      getPokemonByType: vi.fn().mockResolvedValue({ pokemon: [{ pokemon: { name: 'charmander' } }] }),
      getPokemon: vi.fn().mockResolvedValue({
        id: 4,
        name: 'charmander',
        base_experience: 1,
        sprites: { front_default: 'front.png', other: {} },
        types: [],
        stats: [],
        height: 1,
        weight: 1,
      }),
    });
    const dm = new PokemonDataManager(api);

    await dm.getFilteredPokemonPage({ types: ['fire', 'flying'], page: 1, resultsPerPage: 5 });
    await dm.getFilteredPokemonPage({ types: ['flying', 'fire'], page: 1, resultsPerPage: 5 });

    expect(api.getPokemonByType).toHaveBeenCalledTimes(2);
  });

  it('propagates a rejection from the API layer', async () => {
    const api = makeFakeApi({ getPokemonCount: vi.fn().mockRejectedValue(new Error('boom')) });
    const dm = new PokemonDataManager(api);

    await expect(dm.getResultsCount()).rejects.toThrow('boom');
  });
});
