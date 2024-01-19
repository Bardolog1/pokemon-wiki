import { LitElement, html, css } from "lit-element";
import "../API/data-manager";
import "./card-poke";
import { CardPoke } from "./card-poke";

export class ListarPokemon extends LitElement {
  static get properties() {
    return {
      pokemons: {
        type: Array,
        hasChanged(newP, oldP) {
          return newP !== oldP;
        },
      },
      visibleContent: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.visibleContent = false;
  }
 

  updated(props) {
    super.updated && super.updated(props);
    this._listenRenderPokedexWithPokemon();
  }

  _listenRenderPokedexWithPokemon() {
    const cards = this.renderRoot.querySelectorAll("card-poke");
    console.log(cards);
    cards.forEach((card) => {
      card.addEventListener("render-pokedex", (e) => {
        console.log(e.detail);
      });
    });
  }
  
  get dateTemplate() {
    return html`
      ${this.pokemons?.map((pokemon) => html`<card-poke .pokemon=${pokemon}></card-poke>`)}
    `;
  }

  static get styles() {
    return css`
      :host {
        user-select: none;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: baseline;
        overflow-y: scroll;
        scrollbar-width: none;
      }

      :host::-webkit-scrollbar {
        width: 5px;
      }

      :host::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }

      :host::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }

      @keyframes show {
        0% {
          opacity: 0;
          scale: 10%;
        }
        50% {
          opacity: 1;
          scale: 100%;
        }
        100% {
          opacity: 0;
          scale: 50%;
        }
      }

      card-poke {
        max-width: calc(33.33% - 20px);
        box-sizing: border-box;
        margin: 10px;
        view-timeline-name: --card;
        view-timeline-axis: block;
        animation-timeline: --card;
        animation-name: show;
        animation-range: entry 50% cover 80% exit 100%;
        //animation-fill-mode: both;
      }
    `;
  }

  render() {
    return html` ${this.dateTemplate} `;
  }
}
customElements.define("listar-pokemon", ListarPokemon);
