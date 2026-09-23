import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokeApi } from './poke-api.js';

function okResponse(body) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) };
}

function errorResponse(status) {
  return { ok: false, status, json: () => Promise.resolve({}) };
}

describe('PokeApi', () => {
  let api;

  beforeEach(() => {
    api = new PokeApi();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getPokemonCount fetches the pokemon endpoint and returns the raw body', async () => {
    globalThis.fetch.mockResolvedValue(okResponse({ count: 1302 }));

    const result = await api.getPokemonCount();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon',
      { method: 'GET' },
    );
    expect(result).toEqual({ count: 1302 });
  });

  it('getPokemonPage fetches the offset/limit page then every listed pokemon, returning raw details', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(
        okResponse({
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
          ],
        }),
      )
      .mockResolvedValueOnce(okResponse({ id: 1, name: 'bulbasaur' }))
      .mockResolvedValueOnce(okResponse({ id: 2, name: 'ivysaur' }));

    const result = await api.getPokemonPage({ offset: 0, limit: 2 });

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      1,
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2',
      { method: 'GET' },
    );
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      'https://pokeapi.co/api/v2/pokemon/1/',
      { method: 'GET' },
    );
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      3,
      'https://pokeapi.co/api/v2/pokemon/2/',
      { method: 'GET' },
    );
    expect(result).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' },
    ]);
  });

  it('getPokemon fetches the detail endpoint by id or name, lowercased', async () => {
    globalThis.fetch.mockResolvedValue(okResponse({ id: 1, name: 'bulbasaur' }));

    const result = await api.getPokemon('Bulbasaur');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur',
      { method: 'GET' },
    );
    expect(result).toEqual({ id: 1, name: 'bulbasaur' });
  });

  it('getPokemonFullEntry chains pokemon -> species -> evolution chain internally', async () => {
    globalThis.fetch
      .mockResolvedValueOnce(
        okResponse({ id: 1, name: 'bulbasaur', species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' } }),
      )
      .mockResolvedValueOnce(
        okResponse({ evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' } }),
      )
      .mockResolvedValueOnce(okResponse({ chain: { species: { name: 'bulbasaur' }, evolves_to: [] } }));

    const result = await api.getPokemonFullEntry('bulbasaur');

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      1,
      'https://pokeapi.co/api/v2/pokemon/bulbasaur',
      { method: 'GET' },
    );
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      'https://pokeapi.co/api/v2/pokemon-species/1/',
      { method: 'GET' },
    );
    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      3,
      'https://pokeapi.co/api/v2/evolution-chain/1/',
      { method: 'GET' },
    );
    expect(result.pokemon.name).toBe('bulbasaur');
    expect(result.species.evolution_chain.url).toBe('https://pokeapi.co/api/v2/evolution-chain/1/');
    expect(result.evolutionChain.chain.species.name).toBe('bulbasaur');
  });

  it('getPokemonByType fetches the type endpoint by name, lowercased', async () => {
    globalThis.fetch.mockResolvedValue(
      okResponse({ pokemon: [{ pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } }] }),
    );

    const result = await api.getPokemonByType('Fire');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/type/fire',
      { method: 'GET' },
    );
    expect(result.pokemon[0].pokemon.name).toBe('charmander');
  });

  it('throws when the response is not ok', async () => {
    globalThis.fetch.mockResolvedValue(errorResponse(404));

    await expect(api.getPokemon('not-a-pokemon')).rejects.toThrow(/404/);
  });

  it('propagates a fetch rejection instead of swallowing it', async () => {
    globalThis.fetch.mockRejectedValue(new Error('network down'));

    await expect(api.getPokemonCount()).rejects.toThrow('network down');
  });
});
