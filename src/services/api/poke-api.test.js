import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokeApi } from './poke-api.js';

describe('PokeApi', () => {
  let api;

  beforeEach(() => {
    api = new PokeApi();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getCount returns the parsed JSON body for the given URL', async () => {
    globalThis.fetch.mockResolvedValue({
      json: () => Promise.resolve({ count: 1302 }),
    });

    const result = await api.getCount('https://pokeapi.co/api/v2/pokemon');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon',
      { method: 'GET' },
    );
    expect(result).toEqual({ count: 1302 });
  });

  it('getPage returns the parsed JSON body for the given URL', async () => {
    globalThis.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: [{ url: 'x' }] }),
    });

    const result = await api.getPage('https://pokeapi.co/api/v2/pokemon?offset=0&limit=5');

    expect(result).toEqual({ results: [{ url: 'x' }] });
  });

  it('getPokemon returns the parsed JSON body for the given URL', async () => {
    globalThis.fetch.mockResolvedValue({
      json: () => Promise.resolve({ id: 1, name: 'bulbasaur' }),
    });

    const result = await api.getPokemon('https://pokeapi.co/api/v2/pokemon/1');

    expect(result).toEqual({ id: 1, name: 'bulbasaur' });
  });

  it('propagates a fetch rejection instead of swallowing it', async () => {
    globalThis.fetch.mockRejectedValue(new Error('network down'));

    await expect(api.getCount('https://pokeapi.co/api/v2/pokemon')).rejects.toThrow('network down');
  });
});
