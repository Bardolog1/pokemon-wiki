import { LitElement, html, css } from 'lit-element';
import '../API/data-manager'



export class ListarPokemon extends LitElement {

  static  properties= {
    inicio:{type:Number},
    fin:{type:Number},
    pokes:{type:Array},
    visibleContent:{type:Boolean},
    card:{type:Array},

  }

  constructor(){
    super();
    this.pokes = [];
    this.visibleContent=false;
    this.inicio=1;
    this.fin=16;
    this.card=[];

  }

  firstUpdated(){
    this._getPokedex();
    this._getEventLoad();

  }

  // ==== escucha de eventos y disparador de eventos ===//

  _getPokedex(){
    this.addEventListener('poke-send', (res)=>{
      this.pokes.push(res.detail.pokeDex);
     });

  }

  _getEventLoad(){
    this.addEventListener('ok-pokes',()=>{
      console.log('ok-pokes');
      this.visibleContent = true;
     });
  }


  _eventLoad(event, data){
    this.dispatchEvent(new CustomEvent(event ,{
      detail:{data},
      bubbles:true,
      composed:true,
    }));
  }

  // === fin === //



  //== manejo de evento click a card selecionada ===//
  _getElements(element){
    return this.renderRoot.querySelectorAll(element);
  }

  _getSelected(id){
    id=Number(id);
     this.pokes.forEach(pok=>{
      if(pok.id == id){
        this._eventLoad('more-poke',pok)
      }

    })

  }

  _hiddenCards(){
    this.card = this._getElements('.scaff');
    this.card.forEach(element => {
      element.classList.contains("slice")
      ? element.classList.remove("slice"): element.className += " slice";
    });
  }

  alr(e){

    let id = e.target.getAttribute("id");
    this._getSelected(id);

  }

  _flipCard(e){
    let cardFlip = e.target.parentElement.parentElement.parentElement.parentElement;
    if(cardFlip.classList.contains("scaff")){
      if(cardFlip.classList.contains("flip")){
        cardFlip.classList.remove("flip");
      }else{
        cardFlip.classList.add("flip");
      }
    }
    console.log(cardFlip);
  }




  //===== Fin===//

 // ===  templates  === //

 get dateTemplate(){
  return html` ${this.pokes.map( pokemon =>
  html`
    <div class="scaff" id= ${pokemon.id} >

      <div class="containerCard">
        <div id="card" class="card">
              <h2>${pokemon.name.toUpperCase()}</h2>
              <img src="${pokemon.img?pokemon.img:"../assets/R.png"}" alt="${pokemon.name}">
              <p><span>Id</span> ${pokemon.id} | <span>Exp</span> ${pokemon.exp}</p>
              <p><span>Tipo</span><br>${pokemon.type.tip1} | ${pokemon.type.tip2}</p>
              <p><span>Habilidades</span><br>${pokemon.abilities.habi1}<br>${pokemon.abilities.habi2}</p>
              <p @click=${this._flipCard}><span >Evoluciones...</span></p>

            </div>
      </div>

      <div class="containerCardBack">
        <div class="card">
              <h5>Evolutions</h5>
              <div class="evolucion">
                <p class="evol">${pokemon.evolutions.evo1?.toUpperCase()}</p>
                <img src=${pokemon.evolutions.evo1Img} alt="">
              </div>
              <div clas="evolucion">
                <p class="evol">${pokemon.evolutions.evo2?.toUpperCase()}</p>
                <img src=${pokemon.evolutions.evo2Img} alt="">
              </div>
              <div clas="evolucion">
                <p class="evol">${pokemon.evolutions.evo3?.toUpperCase()}</p>
                <img src=${pokemon.evolutions.evo3Img} alt="">
              </div>
              <p @click=${this._flipCard} id="close-card"><span >Info...</span></p>
        </div>
      </div>

    </div>

        `)}

    `

    ;
}

// === FIN === //

// === renderizado === //
static styles = css`
:host{
    display: inline-block;
    background:transparent;
    width: 100%;
    height:100vh;

  }

  data-manager{
    display:none;
  }

  .container{
    position:relative;
    text-align:center;
    position:relative;
    display:inline-block;
    width:100%;
    height:100vh;
  }

  .scaff{
    display:inline-block;
    position: relative;
    min-width:255px;
    min-height:355px;
    margin: 1em;
    overflow: hidden;
    background:transparent;
    border-radius:1em;
    cursor: url(../../../assets/poke1.png), auto;
    transition: 0.5 all;
  }

  .containerCard{
    display:grid;
    place-items:center;
    position: absolute;
    min-width:255px;
    min-height:355px;
    backface-visibility:hidden;
    background:transparent;
    border-radius:1em;
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    text-align:center;
    transform: rotateY(0deg);
    transform-style: preserve-3d;
    transition: 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
    overflow: hidden;
  }

  .containerCard::before{
    content:"";
    position:absolute;
    width:450px;
    height:35px;
    top:0;
    right: 35px;
    transition: 1.9s;
    background: linear-gradient(50deg, #00ff59, #02b3ff);
    transform: rotate(-45deg) translate(0, -100px);
  }

  .containerCard .card{
    display:block;
    place-items:center;
    width:247px;
    height:347px;
    background: transparent;
    border-radius: .8em;
    z-index: 1;
    color: transparent;
    align-content:center;
    transition: 1s ease;

  }

  .containerCard .card img{
    position:absolute;
    max-width:100%;
    max-height:230px;
    transition: 1s ease;
    top:35%;
    right:0px;

  }

  .containerCard .card  p{
    display:none;
    margin-bottom:1px;
    margin-top:10px
  }

  .containerCard .card p span{
    font-weight:600;
    color:#306DB4;
  }

  .containerCard .card h2{
    font-weight:700;
    transition: 1s ease;
  }


   .containerCard:hover{
    overflow: hidden;
    background:linear-gradient(50deg, #2a5a3b, #1e4886);

  }

  .containerCard:hover .card{
    background: #171614;
    overflow: hidden;
  }

  .containerCard:hover img{
    position:relative;
    margin-top:0;
    top:0;
    max-width:150%;
    max-height:100px;
  }

  .containerCard:hover p{
    display:block;
    color:#fff;
  }

  .containerCard:hover h2{
    color:#fff;
  }

  .containerCard:hover::before{
    animation: brightness 1.9s;
  }

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


  .flip >.containerCard{
    transform: rotateY(-180deg);
  }

  .flip >.containerCardBack{
    transform: rotateY(0deg);
  }





  .slice{
    display:none;
  }


  @keyframes brightness {
    100%{
      transform: rotate(-45deg) translate(0, 450px);
    }

  }


`;

render(){
  return html`
    <data-manager pokeInicio=${this.inicio} pokefin=${this.fin}></data-manager>
    <div class="container" id="container">
      ${ this.visibleContent?this.dateTemplate:""}
    </div>

  `;
}

// === FIN === //





}
customElements.define('listar-pokemon', ListarPokemon);
