import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./app-tour.css";

export function startAppTour(pokemonWikiEl) {
  const root = pokemonWikiEl.renderRoot;

  const navbar = root.querySelector("navbar-buttons");
  const list = root.querySelector("listar-pokemon");
  const firstCard = list?.shadowRoot?.querySelector("pokemon-card");

  function getPokedexApp() {
    return navbar?.shadowRoot?.querySelector("pokedex-app") ?? null;
  }

  function pokedexShadow(selector) {
    return getPokedexApp()?.shadowRoot?.querySelector(selector) ?? null;
  }

  function pokedexDeepShadow(componentSelector, innerSelector) {
    return pokedexShadow(componentSelector)?.shadowRoot?.querySelector(innerSelector) ?? null;
  }

  async function openPokedex() {
    if (!navbar) return;
    navbar.isOpen = true;
    await navbar.updateComplete;
    const pokedexApp = getPokedexApp();
    if (pokedexApp) {
      pokedexApp.isOpen = true;
      pokedexApp.isOn = true;
      await pokedexApp.updateComplete;
    }
  }

  async function closePokedex() {
    if (!navbar) return;
    const pokedexApp = getPokedexApp();
    if (pokedexApp) {
      pokedexApp.isOn = false;
      pokedexApp.isOpen = false;
    }
    navbar.isOpen = false;
    await navbar.updateComplete;
  }

  async function flipCard(flipped) {
    if (!firstCard) return;
    firstCard.flipped = flipped;
    await firstCard.updateComplete;
  }

  function cardShadow(selector) {
    return firstCard?.shadowRoot?.querySelector(selector) ?? null;
  }

  function matchupGroup(index) {
    const matchups = cardShadow("pokemon-type-matchups");
    return matchups?.shadowRoot?.querySelectorAll(".group")?.[index] ?? null;
  }

  async function forceHover(active) {
    if (!firstCard) return;
    firstCard.forceHover = active;
    await firstCard.updateComplete;
  }

  const steps = [
    {
      element: () => root.querySelector("banner-title"),
      popover: {
        title: "¡Bienvenido!",
        description: "Esta es tu Pokédex interactiva. Te muestro rápido cómo funciona.",
      },
    },
    {
      element: () => navbar?.shadowRoot?.querySelector(".pokedex-button"),
      popover: {
        title: "Pokédex retro",
        description:
          "Haz clic aquí para abrir la Pokédex. También puedes arrastrar este ícono y soltarlo sobre cualquier Pokémon para saber más sobre él.",
      },
    },
    {
      element: () => pokedexShadow(".power-btn"),
      popover: {
        title: "Encendido",
        description: "Este botón prende y apaga la Pokédex.",
      },
    },
    {
      element: () => pokedexShadow(".screen-bezel"),
      popover: {
        title: "La pantalla",
        description: "Aquí se muestra la información del Pokémon que busques o navegues.",
      },
    },
    {
      element: () => pokedexDeepShadow("pokedex-numpad", ".grid-buttons"),
      popover: {
        title: "Teclado numérico",
        description: "Escribe el número del Pokémon que quieras buscar.",
      },
    },
    {
      element: () => pokedexDeepShadow("pokedex-numpad", ".white-btns"),
      popover: {
        title: "DEL y GO",
        description: "DEL borra el último número que escribiste. GO busca el Pokémon con el número que escribiste.",
      },
    },
    {
      element: () => pokedexDeepShadow("pokedex-numpad", ".yellow-btn"),
      popover: {
        title: "Reiniciar",
        description: "Limpia la búsqueda actual y vuelve a la pantalla de inicio.",
      },
    },
    {
      element: () => pokedexDeepShadow("pokedex-dpad", ".d-pad"),
      popover: {
        title: "Cruceta direccional",
        description:
          "Izquierda y derecha cambian de pantalla (estadísticas, movimientos, descripción, evoluciones). Arriba y abajo mueven el texto hacia arriba o abajo dentro de la pantalla.",
      },
    },
    {
      element: () => pokedexShadow(".red-bezel-btn"),
      popover: {
        title: "Sonido",
        description: "Reproduce el sonido del Pokémon que estés viendo.",
      },
    },
    {
      element: () => pokedexDeepShadow("pokedex-nav-buttons", ".bottom-controls"),
      popover: {
        title: "Anterior / Siguiente",
        description: "Navega al Pokémon anterior o siguiente sin tener que escribir su número.",
      },
    },
    {
      element: () => root.querySelector("pokemon-type-filter"),
      popover: {
        title: "Filtrar por tipo",
        description:
          'Haz clic en uno o más tipos para mostrar solo esos Pokémon. Con "Ver todos" limpias el filtro.',
      },
    },
    {
      element: () => root.querySelector("page-toolbar")?.shadowRoot?.querySelector("pokemon-search"),
      popover: {
        title: "Buscar",
        description:
          "Haz clic en la lupa y escribe el nombre o el número de un Pokémon. Pulsa Enter para verlo; con Esc cierras la búsqueda.",
      },
    },
    {
      element: () => root.querySelector("page-toolbar")?.shadowRoot?.querySelector(".favorites-toggle"),
      popover: {
        title: "Favoritos",
        description:
          "Marca Pokémon como favoritos desde su carta, y vuelve a verlos aquí cuando quieras, sin importar en qué página estén.",
      },
    },
    {
      element: () => root.querySelector("#paginator"),
      popover: {
        title: "Navegación",
        description: "Recorre la Pokédex por páginas.",
      },
    },
    {
      element: () => firstCard,
      popover: {
        title: "Cada Pokémon es una carta",
        description: "Pasa el cursor por encima para ver toda su información.",
      },
    },
    {
      element: () => cardShadow(".top-toolbar pokemon-pokedex-button"),
      popover: {
        title: "Ícono de pokedex",
        description: "Abre la Pokédex desde aquí para saber más de este Pokémon.",
      },
    },
    {
      element: () => cardShadow(".top-toolbar pokemon-favorite-button"),
      popover: {
        title: "Favorito",
        description: "Marca o desmarca este Pokémon como favorito.",
      },
    },
    {
      element: () => cardShadow(".general-info"),
      popover: {
        title: "Datos generales",
        description: "Nombre, número de la Pokédex, experiencia y tipo del Pokémon.",
      },
    },
    {
      element: () => cardShadow('pokemon-stat-item[icon="weight-outline"]'),
      popover: {
        title: "Peso",
        description: "El peso del Pokémon, en kilogramos.",
      },
    },
    {
      element: () => cardShadow('pokemon-stat-item[icon="tapemeasure"]'),
      popover: {
        title: "Altura",
        description: "La altura del Pokémon, en metros.",
      },
    },
    {
      element: () => matchupGroup(0),
      popover: {
        title: "Debilidades",
        description: "Los tipos de ataque contra los que este Pokémon recibe más daño.",
      },
    },
    {
      element: () => matchupGroup(1),
      popover: {
        title: "Resistencias",
        description: "Los tipos de ataque contra los que este Pokémon recibe menos daño (o es inmune).",
      },
    },
  ];

  const POKEDEX_FIRST_STEP = 2;
  const POKEDEX_LAST_STEP = 9;
  const HOVER_FIRST_STEP = 15;
  const HOVER_LAST_STEP = 19;
  const FLIP_FIRST_STEP = 20;
  const FLIP_LAST_STEP = 21;

  async function prepareForIndex(index) {
    if (index >= POKEDEX_FIRST_STEP && index <= POKEDEX_LAST_STEP) {
      await openPokedex();
    } else {
      await closePokedex();
    }
    await forceHover(index >= HOVER_FIRST_STEP && index <= HOVER_LAST_STEP);
    await flipCard(index >= FLIP_FIRST_STEP && index <= FLIP_LAST_STEP);
  }

  async function cleanup() {
    await closePokedex();
    await flipCard(false);
    await forceHover(false);
  }

  const tourObj = driver({
    showProgress: true,
    steps,
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Listo",
    onNextClick: async () => {
      await prepareForIndex(tourObj.getActiveIndex() + 1);
      tourObj.moveNext();
    },
    onPrevClick: async () => {
      await prepareForIndex(tourObj.getActiveIndex() - 1);
      tourObj.movePrevious();
    },
    onCloseClick: () => {
      tourObj.destroy();
    },
    onDestroyed: () => {
      cleanup();
    },
  });

  tourObj.drive();
}
