import { LitElement, html } from 'lit-element';
import './api-request';


export class DataManager extends LitElement {

  static properties = {
    wiki:{type: Array},
    poke:{type: Array},
    pokeInicio:{type: Number},
    pokefin:{type: Number},
  }

  constructor(){
    super();
    this.wiki=[];
    this.pokeInicio=1;
    this.pokefin=16;
  }

  firstUpdated(){
    this._getEventPoke();
    this._getEventLoad();
  }

//=== metodos de escucha de eventos y disparador de eventos ====//

  _getEventPoke(){
    this.addEventListener('api-poke', (res)=>{
      this._datFormat(res.detail.data);
    });
  }

  _getEventLoad(){
    this.addEventListener('api-poke-ok', ()=>{
      console.log('ok-pokes');
      this._sendPoke('ok-pokes', "OK");
    });
  }

  _sendPoke(event, pokeDex){
    this.dispatchEvent(new CustomEvent(event, {
      detail:{pokeDex},
      bubbles:true,
      composed:true,
    }));
  }

  //===fin ===//

  _datFormat(pokemon){

    let imgDfecto = "../../../assets/R.png";  // establezco una imagen por defecto en caso de no encontrar una en la api

      let poke={
        id: pokemon.id,
        name: pokemon.name,
        img: pokemon.sprites.other.dream_world.front_default
          ? pokemon.sprites.other.dream_world.front_default
          : pokemon.sprites.other['official-artwork'].front_default
          ? pokemon.sprites.other['official-artwork'].front_default
          : pokemon.sprites.other.home.front_default
          ? pokemon.sprites.other.home.front_default
          : pokemon.sprites.front_default,
        exp: pokemon.base_experience,
        type: {
          tip1: pokemon.types[0].type.name,
          tip2: pokemon.types[1] ? pokemon.types[1].type.name : '---',
        },
        abilities: {
          habi1: pokemon.abilities[0]
            ? pokemon.abilities[0].ability.name
            : '---',
          habi2: pokemon.abilities[1]
            ? pokemon.abilities[1].ability.name
            : '---',
        },
        evolutions: {
          evo1: pokemon.evolution
            ? pokemon.evolution[0].name
            : 'Fallo consultando',
          evo1Url: pokemon.evolution
            ? pokemon.evolution[0].url
            : 'Fallo consultando',
          evo1Img: pokemon.evolution
            ? pokemon.evolution[0].img == 'Sin evolucion Disponible'
              ? imgDfecto
              : pokemon.evolution[0].img? pokemon.evolution[0].img:imgDfecto
            : imgDfecto,
          evo1Id: pokemon.evolution
            ? pokemon[0] == 'Sin evolucion Disponible'
              ?"Sin evolucion Disponible"
              :pokemon.evolution[0].id? pokemon.evolution[0].id:'Sin evolucion Disponible'
            :'Sin evolucion Disponible',
          evo2: pokemon.evolution
            ? pokemon.evolution[1].name
            : 'Fallo consultando',
          evo2Url: pokemon.evolution
            ? pokemon.evolution[1].url
            : 'Fallo consultando',

          evo2Img: pokemon.evolution
            ? pokemon.evolution[1].img == 'Sin evolucion Disponible'
              ? imgDfecto
              : pokemon.evolution[1].img? pokemon.evolution[1].img:imgDfecto
            : imgDfecto,
         evo2Id: pokemon.evolution
            ? pokemon[1] == 'Sin evolucion Disponible'
              ?"Sin evolucion Disponible"
              :pokemon.evolution[1].id? pokemon.evolution[1].id:'Sin evolucion Disponible'
            :'Sin evolucion Disponible',
          evo2Url: pokemon.evolution
            ? pokemon.evolution[1].url
            : 'Fallo consultando',
          evo3: pokemon.evolution
            ? pokemon.evolution[2].name
            : 'Fallo consultando',
          evo3Url: pokemon.evolution
            ? pokemon.evolution[2].url
            : 'Fallo consultando',
          evo3Img: pokemon.evolution
            ? pokemon.evolution[2].img == 'Sin evolucion Disponible'
              ? imgDfecto
              : pokemon.evolution[2].img? pokemon.evolution[2].img:imgDfecto
            : imgDfecto,
          evo3Id: pokemon.evolution
            ? pokemon[2] == 'Sin evolucion Disponible'
              ?"Sin evolucion Disponible"
              :pokemon.evolution[2].id? pokemon.evolution[2].id:'Sin evolucion Disponible'
            :'Sin evolucion Disponible',
        },
        stats:{
          hp:pokemon.stats[0].base_stat?pokemon.stats[0].base_stat:"---",
          attack:pokemon.stats[1].base_stat?pokemon.stats[1].base_stat:"---",
          defense:pokemon.stats[2].base_stat?pokemon.stats[2].base_stat:"---",
          special_attack:pokemon.stats[3].base_stat?pokemon.stats[3].base_stat:"---",
          special_defense:pokemon.stats[4].base_stat?pokemon.stats[4].base_stat:"---",
          speed:pokemon.stats[5].base_stat?pokemon.stats[5].base_stat:"---",
        }
      }
    this._sendPoke('poke-send', poke);  // disparo el evento con los datos del pokemon ya con el formato y  depurando solo los datos necesarios
  }

  render() {
    return html`
      <api-request pokeInicio=${this.pokeInicio} pokefin=${this.pokefin}></api-request>
   `;
  }
}
customElements.define('data-manager', DataManager);
