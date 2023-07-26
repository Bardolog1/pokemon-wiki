import { LitElement, html, css } from 'lit-element';
import './listar-pokemon';


export class PaginadorPoke extends LitElement {
  static  styles =  css``;


  static get properties() {
    return {
      first: {type : Number,},
      last:{ type: Number},
      pokeDetail :{type: Array}

    };
  }

  constructor(){
    super();
    this.first = 1;
    this.last =20;
    this.pokeDetail=[];
  }

  firstUpdated(){
    this._verDetalle();
  }

  _verDetalle(){
    this.addEventListener('more-poke',res=>{
      this.pokeDetail= res.detail.data;
      console.log(this.pokeDetail)
    })
  }

  _renderContent() {
    return html`
    <listar-pokemon inicio=${this.first} fin=${this.last}></listar-pokemon>
  `;
}

  render() {
    return html`
      <div class="navbar"></div>
      <div class="controller">
        <div class="back button"></div>
        <div class="actualPage"></div>
        <div class="next button"></div>
      </div>
      <div class="content">
      ${this._renderContent()}
      </div>

    `;
  }
}
customElements.define('paginador-poke', PaginadorPoke);
