import { LitElement, html, css } from 'lit';
import { CardPoke } from './card-poke';
import './loading-poke';



export class ListarPokemon extends LitElement {

  static get properties() {
    return {
      pokemons : {
        type: Array,
         hasChanged(newP, oldP){
          return newP !== oldP;
        }
      },
      visibleContent : {
        type: Boolean,
        attribute: 'visible-content',
        hasChanged(newV, oldV){
          return newV !== oldV;
        },
      }
    };

  }

  constructor() {
    super();
    this.visibleContent = false;

  }

  updated(props) {
    super.updated && super.updated(props);
    if (props.has('pokemons')) {
      this.visibleContent = true;
  }
}

  get dateTemplate() {
    this.visibleContent = true;
    return html`
    ${

      this.pokemons?.map((pokemon) => {
      const card = new CardPoke;
      card.pokemon = pokemon;
      card.render();
      return card;
    })
    }
  `;
  }



  static get styles() {

    return css`
  :host{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;
      overflow-y: scroll;
      scrollbar-width: none;

    }

    :host::-webkit-scrollbar {
      width: 5px; /* Ajusta el ancho del scroll según tu diseño */
    }

    :host::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.3); /* Ajusta el color del thumb del scroll */
      border-radius: 4px; /* Ajusta el radio de borde según tu diseño */
    }

    :host::-webkit-scrollbar-thumb:hover {
      background-color: rgba(0, 0, 0, 0.5); /* Ajusta el color del thumb del scroll en hover */
    }





    @keyframes show{
        0%{
          opacity:0;
          scale: 10%;
        }
        50% {
          opacity:1;
          scale:100%;
        }
        100%{
          opacity:0;
          scale:50%;
        }

    }



    card-poke{
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



    @media (max-width: 1024px) {
      card-poke{
        max-width: calc(50% - 20px);
      }
    }


    @media (max-width: 768px) {
      card-poke{
        max-width: calc(50% - 20px);
      }
    }

    @media (max-width: 480px) {
      card-poke{
        max-width: calc(100% - 20px);
      }
    }



  `;
  }

  render() {
    return html`
    ${
      this.visibleContent ? this.dateTemplate : html`<loading-poke></loading-poke>`
      }

  `;
  }


}
customElements.define('listar-pokemon', ListarPokemon);
