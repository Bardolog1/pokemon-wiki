import { LitElement, html, css } from 'lit-element';
import  './components/view/paginador-poke'


export class PokemonWiki extends LitElement {

  static get properties() {
    return {
      apiOk: { type: Boolean },
      loading: { type: Boolean },
      page: { type: Number },
      count: { type: Number },
      first: { type: Number },
      last: { type: Number },
    };
  }

  static get styles(){


    return css`

    :host {
      display:block;
      cursor: url(../assets/poke2.png), auto;
    }

    .container{
      width: 100%;
      height: 40vh;
      position: relative;
      display: grid;
      place-items: center;

    }
  `;

}


render() {
  return html`
  <div class="container">
    <paginador-poke></paginador-poke>
  </div>
    `;
  }
}
