import { LitElement, html, css } from 'lit-element';

export class CardPoke extends LitElement {

  static  get properties()  {
    return {
    pokemon: {
      type: Object,
      attribute:'pokemon',

    },
    firstType: { type: Array },
    typeColors: { type: Array },
    flipped: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.flipped = false;
    this.pokemon = {};
    this.type = {
        "normal": ["#f48b1fff", "#f3b81aff"],
        "fire": ["#f37021ff", "#f3b81aff"],
        "water": ["#0b87b3ff", "#20afdfff"],
        "electric": ["#f3961fff", "#f3b81aff"],
        "grass": ["#459f46ff", "#57b947ff"],
        "ice": ["#20afdfff", "#66cef6ff"],
        "fighting": ["#8e191bff", "#b81f25ff"],
        "poison": ["#8e191bff", "#b81f25ff"],
        "ground": ["#5b3513ff", "#77421aff"],
        "flying": ["#0b87b3ff", "#20afdfff"],
        "psychic": ["#b11f83ff", "#c03995ff"],
        "bug": ["#459f46ff", "#57b947ff"],
        "rock": ["#917f6cff", "#a69f96ff"],
        "ghost": ["#15110cff", "#403b35ff"],
        "dragon": ["#459f46ff", "#57b947ff"],
        "dark": ["#360928ff", "#712158ff"],
        "steel": ["#352514ff", "#523e28ff"],
        "fairy": ["#f7ac36ff", "#f3b81aff"],
        "unknown": ["#15110cff", "#403b35ff"],
    };
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }

  getTypeColors(type) {
    if (
      this.pokemon?.type?.length > 0 &&
      this.type[type] &&
      this.type[type].length === 2
    ) {
      return this.type[type];
    } else {
      return this.type["unknown"];
    }
  }

  getTypeNameForSVG(type) {
    if (
      Array.isArray(this.pokemon?.type) &&
      this.pokemon.type.length > 0 &&
      Object.keys(this.type).includes(type)
    ) {
      return type;
    } else {
      return "pokemmo";
    }
  }

  renderTypeContainer() {
    if (Array.isArray(this.pokemon?.type)) {
      return this.pokemon.type.map(
            (item) => html`
              <span
                class="type"
                style="background: radial-gradient(circle, ${this.getTypeColors(item)[1]} 0%, ${this.getTypeColors(item)[0]} 100%);"
              >
                ${this.getTypeNameForSVG(item)}
              </span>
            `)

    } else {
      return html`<span class="type" style="background:#000">Invalid</span>`;
    }
  }

  _renderPokedex(){
    console.log("he abierto la pokedex para el pokemon: ",this.pokemon.name);
  }

  static get styles(){

    return css`
      :host{
        height: 100%;
        margin: 0 1rem;

      }

      .scaff{
        display:inline-block;
        position: relative;
        min-width:16rem;
        min-height: 22rem;;
        overflow: inherit;
        background: transparent;
        border-radius:1em;
        cursor: url(assets/poke1.png), auto;
        transition: 0.3 all;
      }



      .containerCard{
        place-items:center;
        position: absolute;
        min-width:100%;
        min-height:100%;
        backface-visibility:hidden;
        border-radius:1em;
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        text-align:center;
        transform: rotateY(0deg);
        transform-style: preserve-3d;
        transition: 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
        overflow:hidden;
      }

      .containerCard::before{
        content:"";
        position:absolute;
        width:450px;
        height:35px;
        top:0;
        right: 35px;
        transition: 0.1s ease-in-out;
        background: transparent;
        transform: rotate(-45deg) translate(0, -100px);
      }

      .containerCard:hover{
        overflow: hidden;
        display:grid;
        background:linear-gradient(50deg, #2a5a3b, #1e4886);
      }

      .containerCard:hover::before{
        background: linear-gradient(50deg, #00ff59, #02b3ff);
        animation: brightness 1.9s;
      }

      .containerCard .card{
        position:relative;
        display:flex;
        flex-direction:column;
        width:15.5rem;
        height:21.5rem;
        background: transparent;
        border-radius: .8em;
        color: transparent;
        transition: 0.1s ease-in-out;
        z-index: 999;
        overflow:hidden;


      }

      .containerCard:hover .card{
        background: #171614;
        overflow: hidden;
      }

      .containerCard .card .buttons-container{
        display:none;
        position:absolute;
        top:0;
        left:10%;
        width:80%;
        height:10%;
        z-index:100;
        transition: 2s ease-in-out;
      }

      .containerCard:hover .buttons-container{
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        align-items:center;
        transition: 2s ease-in-out;
      }

      .containerCard .card .buttons-container .button{
        height: 100%;
        width:10%
      }

      .containerCard .card .buttons-container .button img{
        width:100%;
        height:100%;
      }

      .containerCard:hover .image-container{
        position: relative;
        margin-top: 0px;
        display: block;
        height: 10rem;
      }

      .containerCard:hover .image-container::before{
        content:"";
        width:150%;
        height:250%;
        border-radius: 50%;
        background: var(--gradient-background);
        position: absolute;
        top:-170%;
        left:-25%;
        z-index:1;
      }

      .containerCard:hover .image-container::after{
        content:"";
        width:150%;
        height:250%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);

        position: absolute;
        top:-170%;
        left:-25%;
        z-index:5;
      }

      .containerCard .card img{
        position:absolute;
        max-width:100%;
        height:13rem;
        transition: 0.3s ease-in-out;
        top:35%;
        left:0%;
        z-index:9999;
      }

      .containerCard:hover img{
        position: relative;
        top: 10%;
        transition: all 0.3s ease-in-out 0s;
        z-index: 10;
        height: 9rem;
        width: 9rem;
      }

      .containerCard:hover .back-container{
        width:100%;
        height:80%;
        position:absolute;
        top:0;
        left:0;
        display:flex;
        flex-direction:row;
        justify-content:center;
        align-items:center;
        z-index:9;

      }

      .containerCard .img-back{
        display:none;
      }

      .containerCard:hover .img-back{
        display:block;
        opacity: 0.5;
        width:6rem;
        height:7rem;

      }

      .containerCard .card h2{
        display:block;
        font-weight:500;
        text-align:start;
        width:90%;
        margin: 0.5rem;
        margin-top: 1rem;
        margin-bottom: 0.3rem;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color: #f2f2f2;
        font-size: 1.2rem;
      }

      /*chack */

      .containerCard .card .info-container{
        display :none ;
        flex-direction:column;
        justify-content: space-evenly;
        align-items: center;
      }

      .containerCard:hover .card .info-container{
        display :flex ;
      }

      .containerCard .id-exp-container{
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        width:90%;
        margin: 0 0.5rem 0.5rem;
      }

      .containerCard .card .poke-id{
        width: 50%;
        text-align: left;
        display: inline-block;
        font-size: 0.8rem;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color:#7a7a7a;
      }

      .containerCard .card .poke-exp{
        width: 50%;
        text-align: right;
        display: inline-block;
        font-size: 0.8rem;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color:#7a7a7a;
      }

      .containerCard .type-container{
        width: 90%;
        margin: 0 0.5rem 0.5rem;
        display:flex;
        flex-direction:row;
        justify-content: start;

      }

      .containerCard .card .type{
        display:none;
        width:5rem;
        position:relative;
        height:1.3rem;
        -webkit-border-radius: 100px;
        -webkit-border-top-left-radius: 0;
        -moz-border-radius: 100px;
        -moz-border-radius-topleft: 0;
        border-radius: 100px;
        border-top-left-radius: 0;
        text-transform: capitalize;
        align-items: center;
        padding-top:0.2rem;
        transition: 1s ease;
        color: #fff;
        font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight:400;
        font-size:0.8rem;
      }

      .containerCard:hover .type{
        display:inline-block;
        margin:0.2rem;
        transition: 1s ease;
        align-content:center;
      }

      .containerCard .character-container{
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
        width:90%;
        margin: 0 0.5rem 0.5rem;


      }

      .containerCard .character-container .character{
        width: 50%;
      }

      .containerCard .character-container .character .title{
        display:block;
        width:100%;
        font-size:1rem;
        text-align:left;
        color:#f2f2f2;
      }

      .containerCard .character-container .character-info{
        width:80%;
        height:2rem;
        border-radius:100px;
        border: 1px solid #f2f2f2;
        margin:0.5rem;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
      }

      .containerCard .character-container .character-info .character-text{
        color:#f2f2f2;
        font-size: 0.9rem;
        font-weight: lighter;
      }

      .containerCard .character-container  img{
        width:1rem;
        height:1rem;
      }


    /* ====== / Back card styles / ====== */

      .containerCardBack{
        display:grid;
        place-items:center;
        position: absolute;
        backface-visibility:hidden;
        min-width:255px;
        min-height:355px;
        background:linear-gradient(50deg, #2a5a3b, #1e4886);
        border-radius:1em;
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        text-align:center;
        overflow: hidden;
        transform: rotateY(180deg);
        transform-style: preserve-3d;
        transition: 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);

      }
      .containerCardBack .card{
        display:block;
        place-items:center;
        width:247px;
        height:347px;
        background: #171614;
        border-radius: .8em;
        z-index: 1;
        color: transparent;
        align-content:center;
        transition: 1s ease;
      }
      .containerCardBack h5{
        color : #306DB4;
        font-size:20px;
        margin-bottom:6px;
        margin-top:10px;
      }
      .containerCardBack .card .buttons-container{
        display:none;
        position:absolute;
        top:5%;
        left:10%;
        width:80%;
        height:10%;
        z-index:100;
        transition: 2s ease-in-out;
      }

      .containerCardBack:hover .buttons-container{
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        align-items:center;
        transition: 2s ease-in-out;
      }

      .containerCardBack .card .buttons-container .button{
        height: 100%;
        width:10%
      }

      .containerCardBack .card .buttons-container .button img{
        width:100%;
        height:100%;
      }

    /* ====== / Flip Actions / ====== */

    .scaff.flipped >.containerCard{
        transform: rotateY(-180deg);
      }

      .scaff.flipped >.containerCardBack{
        transform: rotateY(0deg);
      }

      /* ====== / Animations / ====== */

      @keyframes brightness {
        100%{
          transform: rotate(-45deg) translate(0, 450px);
        }

      }


      `;
  }




  render() {
    const { pokemon, flipped } = this;
    this.firstType = this.pokemon?.type?.[0]? this.pokemon?.type?.[0] : "unknown";

    return html`
      <style>
        :host {
          --gradient-background: linear-gradient(90deg, ${this.getTypeColors(this.firstType)[0]} 0%, ${this.getTypeColors(this.firstType)[1]} 100%);
        }
      </style>

      <div class="scaff ${flipped?'flipped':''}" id=${pokemon.id || 0}>
        <div class="containerCard">
          <div class="card">
            <div class="buttons-container" >
              <div class="button button-pokedex" @click=${this._renderPokedex}>
                <img src="assets/pokegenie.svg" alt="pokedex">
              </div>
              <div class="button button-flip" @click=${this.toggleFlip}>
                <img src="assets/phone-flip.svg" alt="flip" >
              </div>
            </div>
            <div class="image-container" >
              <div class="back-container">
                <img class="img-back" src="assets/${this.getTypeNameForSVG(pokemon?.type?.[0])}.svg" alt="" />
              </div>
              <img src="${pokemon.img ? pokemon.img : "assets/R.png"}" alt="${pokemon.name}"/>
            </div>
            <div class="info-container">
              <h2>${pokemon.name.toUpperCase()}</h2>
              <div class="id-exp-container">
                <span class="poke-id">N° ${pokemon.id}</span>
                <span class="poke-exp">${pokemon.exp} Exp</span>
              </div>
              <div class="type-container">
              ${this.renderTypeContainer()}
            </div>
              <div class="character-container">
                <div class="character">
                    <span class="title">
                      <img src="assets/weight-outline.svg"  alt="weight">
                      Weight
                    </span>
                    <div class="character-info">
                      <span class="character-text">
                      ${Math.ceil(pokemon.weight * 0.1 * 10) / 10} Kg
                      </span>
                    </div>
                </div>
                <div class="character">
                  <span class="title">
                    <img src="assets/tapemeasure.svg" alt="height">
                    Height
                  </span>
                  <div class="character-info">
                  <span class="character-text">
                    ${Math.ceil(pokemon.height * 0.1 * 10) / 10} Mts
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="containerCardBack">
          <div class="card">
            <div class="buttons-container" >
              <div class="button button-pokedex" @click=${this._renderPokedex}>
                <img src="assets/pokegenie.svg" alt="pokedex">
              </div>
              <div class="button button-flip" @click=${this.toggleFlip}>
                <img src="assets/phone-flip.svg" alt="flip" >
              </div>
            </div>


            <h5>Stats (Feature)</h5>


          </div>
        </div>

      </div>

    `;
  }

}

customElements.define('card-poke', CardPoke);

