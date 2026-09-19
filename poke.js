document.addEventListener("DOMContentLoaded", function () {

    const imgOptions = {};

    const imgObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
  
        const img = entry.target;
        var dataImage = img.getAttribute("data-image");
  
        img.src = dataImage;
        // img.classList.remove("spinner");
        imgObserver.unobserve(img);
      });
    }, imgOptions);
  
    function imgLoaded(img) {
      var imagelink = img.parentNode;
  
      imagelink.className += imagelink.className ? " loaded" : "loaded";
    }
  
    function orderNumber(str) {
      var mySubString = str.substring(
        str.lastIndexOf("s/") + 2,
        str.lastIndexOf("/")
      );
      return mySubString;
    }
    //https://vignette.wikia.nocookie.net/es.pokemon/images/4/43/Bulbasaur.png
    let html = "";

    //funcion de fetch
    const fetchPokemons = async (endpoint) => {
      let data;
  
      try {
        //fetch(endpoint, {mode: 'cors'})
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
          //body: JSON.stringify(todo)
        });
        data = await response.json();
      } catch (error) {
        console.log(error);
      }
      return data.pokemon_species;
    };
  
    async function getPokemons(numero, toggle) {
      let endpoint = `https://pokeapi.co/api/v2/generation/${numero}/`;
      var container = document.getElementById("container");
      container.innerHTML = "";
      let pokemons = [];
  
      pokemons = await fetchPokemons(endpoint);
  
      for (let j = 0; j < pokemons.length; j++) {
        pokemons[j].nr = orderNumber(pokemons[j].url);
      }
      pokemons.sort((a, b) => a.nr - b.nr);
      //console.log(pokemons);
      let html = "";
      let numero3decimals = "";
  
      pokemons.forEach((pokemon) => {
        let numero3decimals = orderNumber(pokemon.url);
        if (numero3decimals < 10) {
          numero3decimals = "0" + numero3decimals;
        }
        if (numero3decimals < 100) {
          numero3decimals = "0" + numero3decimals;
        }
  
        let divitem = document.createElement("li");
        divitem.classList.add("item");
  
        const image = document.querySelector(".image");
  
        var img = new Image();
  
        const toggleurl = toggle
          ? "https://assets.pokemon.com/assets/cms2/img/pokedex/full/"
          : "https://www.serebii.net/pokemongo/pokemon/";
  
        img.src =
          "https://i.gifer.com/origin/28/2860d2d8c3a1e402e0fc8913cd92cd7a_w200.gif";
        const urlImage = `${toggleurl}${numero3decimals}.png`;
        img.setAttribute("data-image", urlImage);
  
        img.setAttribute("class", "pokeimage");
        img.setAttribute("alt", pokemon.name);
  
        divitem.innerHTML = `  <div> ${orderNumber(pokemon.url)} - ${
          pokemon.name
        }</div>`;
        divitem.appendChild(img);
        container.appendChild(divitem);
        imgObserver.observe(img);
      });
      // container.innerHTML+=html;
    }
  
    const URL = "https://pokeapi.co/api/v2/pokemon/?limit=151";
  
    const urlOficialimages =
      "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png";
    //https://pokeapi.co/api/v2/generation/1
    const container = document.getElementById("container");
    const otherImages =
      "https://raw.githubusercontent.com/anchetaWern/pokeapi-json/master/data/v1/media/img/1.png";
    //const imagesPOkemonGo= 'https://www.serebii.net/pokemongo/pokemon/113.png';
    const URL2 = "https://pokeapi.co/api/v2/generation/1/";
    //pokemon_species[name,url];
    //var selection = document.querySelector('input[name="generation"]:checked').value;
    var numero = 1;
  
    getPokemons(numero);
  
    var toggle = false;
    btnAllSchool.addEventListener("click", function () {
      toggle = !toggle;
  
      //console.error("click");
      getPokemons(numero, toggle);
    });
    var geners = [
      "generation-1",
      "generation-2",
      "generation-3",
      "generation-4",
      "generation-5",
      "generation-6",
      "generation-7"
    ];
  
    var filters = document.getElementById("filters");
    var gen = "";
    for (let i = 0; i < geners.length; i++) {
      gen += `
        <input class="radio-gens" type="radio" id=${geners[i]} value=${
        i + 1
      } name="generation" checked>
        <label for=${geners[i]} class="label-gens">${geners[i]} </label>`;
    }
    filters.innerHTML = gen;
  
    filters.addEventListener("click", function (e) {
      let targ = e.target.type;
      if (targ == "radio") {
        //console.log("value:" + e.target.id)
        getPokemons(e.target.value, toggle);
        title.innerHTML = "Pokemon " + e.target.id;
      }
    });
  });
  