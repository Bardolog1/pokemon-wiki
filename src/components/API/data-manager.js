import { LitElement } from 'lit';
import { ApiRequest } from './api-request';


export class DataManager extends LitElement {

  constructor(){
    super();
  }

  async _getCountResults(){
    try{

      const api =  new ApiRequest;

      api.addEventListener('request-basics', event => {
        this._dmNotifyEvent('results-total',event.detail.data.count);
      });

      await api._getBasicsPokemon('https://pokeapi.co/api/v2/pokemon');

    }catch{
      console.error(error);
    }

  }



  async _getPagesListPoke(dataPages) {

    if (!dataPages) return;

    const { results_page, page } = dataPages;
    const offset = (results_page * page) - results_page;
    const limit = results_page;
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    try {
      const api = new ApiRequest();

      api.addEventListener('request-list-pokes', async (event) => {
        const data = event.detail.data;
        const pokemonPromises = data.results.map(element => this._getPokeFirstDetail(element.url));

        try {
          const pokemonList = await Promise.all(pokemonPromises);
          this._dmNotifyEvent('list-of-pokemons', pokemonList);
        } catch (error) {
          console.error(error);
        }
      });

      await api._getPagePokes(url);
    } catch (error) {
      console.error(error);
    }
  }



  async _getPokeFirstDetail(url) {
    return new Promise((resolve, reject) => {
      const api = new ApiRequest();

      api.addEventListener('request-pokemon-first-data', event => {
        const detail = event.detail.data;
        const pokemon = this._constructPokefirst(detail);
        resolve(pokemon);
      });

      api.addEventListener('request-error', event => {
        reject(event.detail.error);
      });

      api._getPokemonEndpoint(url);
    });
  }

  _constructPokefirst(detail) {
    const imgURL = (
      detail.sprites.other.dream_world.front_default ||
      detail.sprites.other['official-artwork'].front_default ||
      detail.sprites.other.home.front_default ||
      detail.sprites.front_default
    );

    return {
      id: detail.id,
      name: detail.name,
      exp: detail.base_experience,
      img: imgURL || null,
      type: detail.types.map(type => type.type.name),
      stats: {
        hp: detail.stats[0]?.base_stat || '---',
        attack: detail.stats[1]?.base_stat || '---',
        defense: detail.stats[2]?.base_stat || '---',
        special_attack: detail.stats[3]?.base_stat || '---',
        special_defense: detail.stats[4]?.base_stat || '---',
        speed: detail.stats[5]?.base_stat || '---',
      },
      height: detail.height,
      weight: detail.weight,
    };
  }

  _dmNotifyEvent(type, data) {
    this.dispatchEvent(new CustomEvent(`notify-data-${type}`, {
      detail: { data },
      bubbles: true,
      composed: true,
    }));
  }

}
customElements.define('data-manager', DataManager);
/*

constructor(){
    super();
    this.wiki=[];
    this.pokeInicio=1;
    this.pokefin=16;
  }


   _getEventPoke(){
    this.addEventListener('api-poke', (res)=>{
      this._datFormat(res.detail.data);
    });
  }



  _sendPoke(event, pokeDex){
    this.dispatchEvent(new CustomEvent(event, {
      detail:{pokeDex},
      bubbles:true,
      composed:true,
    }));
  }


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
        type: pokemon.types.map(type=>{
            return type.type.name;
        })

        ,
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
        },
        height: pokemon.height,
        weight:pokemon.weight,

      }
      console.log(poke.type);
    this._sendPoke('poke-send', poke);  // disparo el evento con los datos del pokemon ya con el formato y  depurando solo los datos necesarios
  }
*/
