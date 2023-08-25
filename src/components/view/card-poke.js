import { LitElement, html, css } from 'lit-element';

export class CardPoke extends LitElement {

  static  get properties()  {
    return {
    pokemon: { type: Array, },
    firstType: { type: Array },
    typeColors: { type: Array }
    };
  }

  constructor() {
    super();
    this.pokemon =
    {
      "id": 25,
      "name": "pikachu",
      "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      "exp": 112,
      "type": [
        // "normal",
        "fire",
        // "water",
        // "electric",
        // "grass",
        // "ice",
        // "fighting",
        // "poison",
        // "ground",
        // "flying",
        // "psychic",
        // "bug",
        // "rock",
        // "ghost",
        // "dragon",
        // "dark",
        // "steel",
        // "fairy"
      ],
      "abilities": [
        "static",
        "lightning-rod",
      ],
      "evolutions": [
        {
          "name": "raichu",
          "url": "https://pokeapi.co/api/v2/pokemon/26/",
          "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png",
          "id": 26
        },
        {
          "name": "pikachu",
          "url": "https://pokeapi.co/api/v2/pokemon/25/",
          "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
          "id": 25
        },
        {
          "name": "pichu",
          "url": "https://pokeapi.co/api/v2/pokemon/172/",
          "img": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png",
          "id": 172
        }
      ],
      "stats": {
        "hp": 35,
        "speed": 90,
        "attack": 55,
        "special_attack": 50,
        "defense": 40,
        "special_defense": 50
      },
      "weight":60,
      "height": 4,

    /*
        HP (Hit Points): Máximo de 255.
        Ataque (Attack): Máximo de 190.
        Defensa (Defense): Máximo de 230.
        Ataque Especial (Special Attack): Máximo de 194.
        Defensa Especial (Special Defense): Máximo de 230.
        Velocidad (Speed): Máximo de 180.

        HP (Hit Points): Máximo de 255.
        Ataque (Attack): Máximo de 190.
        Defensa (Defense): Máximo de 250.
        Ataque Especial (Special Attack): Máximo de 194.
        Defensa Especial (Special Defense): Máximo de 250.
        Velocidad (Speed): Máximo de 200.
    */

    };

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

    this.firstType = this.pokemon.type[0]? (this.pokemon.type[0]):"unknown";
    this.typeColors = this.type[this.firstType];

  }

  _flipCard(e) {
    const cardFlip = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
    if (cardFlip.classList.contains("scaff")) {
      if (cardFlip.classList.contains("flip")) {
        cardFlip.classList.remove("flip");
      } else {
        cardFlip.classList.add("flip");
      }
    }
    console.log(cardFlip);
  }

  _renderPokedex(){
    console.log("he abierto la pokedex para el pokemon: ",this.pokemon.name);
  }

  static get styles(){

    return css`

  .scaff{
    display:inline-block;
    position: relative;
    min-width:16rem;
    min-height:22rem;
    margin: 1em;
    overflow: inherit;
    background: transparent;
    border-radius:1em;
    cursor: url(../../../assets/poke1.png), auto;
    transition: 0.3 all;
  }

  .scaff:hover{
    overflow: hidden;
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
    position:relative;
    margin-top:0;
    display:block;
    justify-content:center;
    backdrop-filter: blur(5px);
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
    backdrop-filter: blur(10px);
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
    position:relative;
    margin-top:0;
    top:10%;
    max-width:10rem;
    max-height:10rem;
    transition: 0.3s ease-in-out;
    z-index: 10;
    transform: scale(1.1);
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
    opacity: 0.3;
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
  .containerCardBack .evol{
    color:#fff;
    font-size:15px;
    margin:15px;
  }
  .containerCardBack img{
    height: 40px;
    padding:0;
    margin:0;
    margin-bottom:5px;
  }
  .containerCardBack .card p span{

    font-weight:600;
    color:#306DB4;
  }
  .containerCardBack .card .close-card{
    margin-top:0;
  }
  .containerCardBack .card p span:hover{
    font-weight:900;
    color:#ffffff;
    cursor:pointer;
  }


/* ====== / Flip Actions / ====== */

  .flip >.containerCard{
    transform: rotateY(-180deg);
  }

  .flip >.containerCardBack{
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
    return html`
      <style>
        :host {
          --gradient-background: linear-gradient(90deg, ${this.typeColors[0]} 0%, ${this.typeColors[1]} 100%);
        }
      </style>

      <div class="scaff" id= ${this.pokemon.id ? this.pokemon.id : 0} >
        <div class="containerCard">
          <div class="card">
            <div class="buttons-container" @click=${this._renderPokedex}>
              <div class="button button-pokedex">
                <img src="../../../assets/pokegenie.svg" alt="pokedex">
              </div>
              <div class="button button-flip" @click=${this._flipCard}>
                <img src="../../../assets/phone-flip.svg" alt="pokedex" >
              </div>
            </div>
            <div class="image-container" >
              <div class="back-container">
                <img class="img-back" src="../../../assets/${this.pokemon.type[0]? this.pokemon.type[0]:"pokemmo"}.svg" alt="" />
              </div>
              <img src="${this.pokemon.img ? this.pokemon.img : "../assets/R.png"}" alt="${this.pokemon.name}"/>
            </div>
            <div class="info-container">
              <h2>${this.pokemon.name.toUpperCase()}</h2>
              <div class="id-exp-container">
                <span class="poke-id">N° ${this.pokemon.id}</span>
                <span class="poke-exp">${this.pokemon.exp} Exp</span>
              </div>
              <div class="type-container">
                ${this.pokemon.type.length > 0 ?
                  this.pokemon.type.map((item) => html`
                      <span
                        class="type"
                        style="background: radial-gradient(circle, ${this.type[item][1]} 0%, ${this.type[item][0]} 100%);"
                        >
                        ${item}
                      </span>
                  `):
                  html`<span class="type" style="background:#000">Unknown</span>`
                }
              </div>
              <div class="character-container">
                <div class="character">
                    <span class="title">
                      <img src="../../../assets/weight-outline.svg"  alt="weight">
                      Weight
                    </span>
                    <div class="character-info">
                      <span class="character-text">
                        ${this.pokemon.weight * 0.1} Kg
                      </span>
                    </div>
                </div>
                <div class="character">
                  <span class="title">
                    <img src="../../../assets/tapemeasure.svg" alt="height">
                    Height
                  </span>
                  <div class="character-info">
                    <span class="character-text">
                      ${this.pokemon.height * 0.1} Mts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="containerCardBack">
          <div class="card">
            <h5>Evolutions</h5>
            <div class="evolucion">
              <p class="evol">${this.pokemon.evolutions[0].name?.toUpperCase()}</p>
              <img src=${this.pokemon.evolutions[0].img} alt="">
            </div>
            <div clas="evolucion">
              <p class="evol">${this.pokemon.evolutions[1].name?.toUpperCase()}</p>
              <img src=${this.pokemon.evolutions[1].img} alt="">
            </div>
            <div clas="evolucion">
              <p class="evol">${this.pokemon.evolutions[2].name?.toUpperCase()}</p>
              <img src=${this.pokemon.evolutions[2].img} alt="">
            </div>
            <div class="ButtonFlip" @click=${this._flipCard} id="close-card">Info...</div>
          </div>
        </div>

      </div>

    `;
  }


}

customElements.define('card-poke', CardPoke);

/*
            <div class="habilities-container">
              <span class="option">Habilidades </span>
              ${this.pokemon.abilities.map(item => html`<span class="hability"> ${item}</span>`)}
            </div>



          <p class="ButtonFlip" @click=${this._flipCard}>Evoluciones...</p>
          */
