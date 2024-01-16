import { LitElement } from "lit-element";

const GET = "GET";

const EVENTS = {
  BASE: "request-",
  BASICS: "basics",
  LIST: "list-pokes",
  FIRST_DATA: "pokemon-first-data",
  ERROR: "error",
};

export class ApiRequest extends LitElement {
  static properties = {
    url: { type: String },
    method: { type: String },
  };

  constructor() {
    super();
    this.url = "";
  }

  async executeRequest(type) {
    try {
      const response = await fetch(this.url, { method: GET });
      const data = await response.json();
      this._generateEvents(type, data);
    } catch (error) {
      this._generateErrorEvent(error);
    }
  }

  _generateErrorEvent(error) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.ERROR, {
        detail: { error },
        bubbles: true,
      })
    );
  }

  _generateEvents(type, data) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.BASE.concat(type), {
        detail: { data },
        bubbles: true,
      })
    );
  }

  _getBasicsPokemon(url) {
    this.url = url;
    this.executeRequest(EVENTS.BASICS);
  }

  _getPagePokes(url) {
    this.url = url;
    return this.executeRequest(EVENTS.LIST);
  }

  _getPokemonEndpoint(url) {
    this.url = url;
    return this.executeRequest(EVENTS.FIRST_DATA);
  }
}
customElements.define("api-request", ApiRequest);
