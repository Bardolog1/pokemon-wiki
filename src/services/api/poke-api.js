const GET = 'GET';

export class PokeApi {
  async #request(url) {
    const response = await fetch(url, { method: GET });
    return response.json();
  }

  async getCount(url) {
    return this.#request(url);
  }

  async getPage(url) {
    return this.#request(url);
  }

  async getPokemon(url) {
    return this.#request(url);
  }
}
