import { LitElement } from 'lit-element';

export class ApiRequest extends LitElement {

  //popiedaddes que va a usar el componente
  static properties = {
    url: { type: String },
    metod: { type: String },
    pokeFin: { type: Number },
    pokeInicio: { type: Number },
    resp: { type: Array },
  };

  //constructor donde inicializo las propiedades
  constructor() {
    super();
    this.resp = [];
    this.url = 'https://pokeapi.co/api/v2/pokemon/';
    this.metod = 'GET';
  }

  //metodo del ciclo de vida de un webComponent en lit
  // este metodo inicia luego del constructor y despues de tener los valores asignados de las propiedades
  firstUpdated() {
    this.getDataPokemon();
  }


  // metodo para retraso en las consultas y no saturar la api con peticiones
  delay(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n);
    });
  }

  //metodo disparador de eventos
  _sendData(event, data) {
    this.dispatchEvent(
      new CustomEvent(event, {
        detail: { data },
        bubbles: true,
        composed: true,
      })
    );
  }

  //metodo para establecer un ajuste en el inicio y fin de consulta, ya que la api se corta en el index 905 y se reinicia en el 10001
  _ajusteInicioFin() {
    if (this.pokeFin > 905 && this.pokeInicio > 905) {
      this.pokeInicio = this.pokeInicio + 9095;
      this.pokeFin = this.pokeFin + 9095;
      this.pokeFin > 10249 ? (this.pokeFin = 10249) : this.pokeFin;
      this.pokeInicio > 10249 ? (this.pokeInicio = 10249) : this.pokeInicio;
    }
  }

  // otro calculo del index para el ciclo for
  _calcularIndex(ind) {
    return ind > 905 && ind < 10001 ? ind + 9095 : ind == 0 ? (ind = 1) : ind;
  }


  // metodo para las consultas de cada pokemon  tiene anidadas otras consultas para la especie, evoluciones  e imagen por cada pokemon
  async getDataPokemon() {
    this._ajusteInicioFin();
    for (let i = this.pokeInicio; i <= this.pokeFin; i++) {
      await fetch(this.url + this._calcularIndex(i),{method:this.metod})
        .then(response => {
          if (response.ok) return response.json();
          return Promise.reject(response);
        })
        .then(async data => {
          this._consultaEspecies(data);
          await this.delay(1000);
          this._sendData('api-poke', data);   // disparo un evento con los datos del pokemon, el evento lo escucha el data-manager el cual organiza los datos del pokemon
        })
        .catch(error => {
          console.warn('Algo Fallo en la consulta del pokemon:', error);
        });
    }
    this._sendData('api-poke-ok',"Ok");  // disparo un evento que confirma el envio total de los pokemon
  }

  // metodo que hace la peticion por el pokemon que recibe de argumento y consulta su especie
  _consultaEspecies(dataPoke) {
    fetch(dataPoke.species.url, { method: this.metod })
      .then(response => {
        if (response.ok) return response.json();
        return Promise.reject(response);
      })
      .then(data1 => {
        dataPoke.evolution_chain = data1.evolution_chain.url;
        this._consultaEvolucionChain(dataPoke);
        return dataPoke;
      })
      .catch(error => {
        console.warn('Algo Fallo en la consulta de la especie :', error);
      });
  }

  // al obtener la espelcie con el metodo anterior ya solicito la cadena de evolucion con este metodo
  _consultaEvolucionChain(dataPoke) {
    fetch(dataPoke.evolution_chain, { method: this.metod })
      .then(response => {
        if (response.ok) return response.json();
        return Promise.reject(response);
      })
      .then(data2 => {
        dataPoke.evolution = this._manipularEvoluciones(data2);
        dataPoke = this._fetchEvolucionesImg(dataPoke);
      })
      .catch(error => {
        console.warn('Algo Fallo en la consulta de las evoluciones :', error);
      });
  }

  // al obtener la cadena de evolucion inserto los pokemon de evolucion asociados al pokemon en consulta
  _manipularEvoluciones(datoPokemon) {
    let evol = [];

    evol.push({
      name: datoPokemon.chain.species?.name
        ? datoPokemon.chain.species.name
        : 'Sin evolucion Disponible',
      url: datoPokemon.chain.species?.url
        ? datoPokemon.chain.species.url
        : 'Sin evolucion Disponible',
    });

    evol.push({
      name: datoPokemon.chain.evolves_to[0]?.species.name
        ? datoPokemon.chain.evolves_to[0].species.name
        : 'Sin evolucion Disponible',
      url: datoPokemon.chain.evolves_to[0]?.species.url
        ? datoPokemon.chain.evolves_to[0].species.url
        : 'Sin evolucion Disponible',
    });

    evol.push({
      name: datoPokemon.chain.evolves_to[0]?.evolves_to[0]?.species.name
        ? datoPokemon.chain.evolves_to[0].evolves_to[0].species.name
        : 'Sin evolucion Disponible',
      url: datoPokemon.chain.evolves_to[0]?.evolves_to[0]?.species.url
        ? datoPokemon.chain.evolves_to[0].evolves_to[0].species.url
        : 'Sin evolucion Disponible',
    });

    return evol;
  }

  // solicito las imagenes de los pokemon de evolucion por cada pokemon
  _fetchEvolucionesImg(datoPokemon) {
    datoPokemon.evolution.forEach(evol => {
      if (evol.name != 'Sin evolucion Disponible') {
        let id = evol.url.slice(0, -1);
        id = id.substr(id.lastIndexOf('/') + 1);
        evol.id = id;

        fetch(this.url + evol.id, { method: this.metod })
          .then(resp => {
            if(resp.ok) return resp.json();
            return Promise.reject(resp);
          })
          .then(resp => {
            evol.img = resp.sprites.other.dream_world.front_default
              ? resp.sprites.other.dream_world.front_default
              : resp.sprites.other['official-artwork'].front_default
              ? resp.sprites.other['official-artwork'].front_default
              : resp.sprites.other.home.front_default
              ? resp.sprites.other.home.front_default
              : resp.sprites.front_default;
          })
          .catch(error => {
            console.warn('Algo Fallo en la consulta de la evolucion:', error);
          });
      } else {
        evol.img = evol.name;
      }
    });
    return datoPokemon;
  }
}
customElements.define('api-request', ApiRequest);
