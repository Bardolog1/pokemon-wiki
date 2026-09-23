import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./app-tour.css";

/**
 * Arma y arranca el tour guiado de la app. Recibe el componente raíz
 * (PokemonWiki) para poder alcanzar, vía su renderRoot, tanto sus propios
 * elementos como los que viven dentro del Shadow DOM de sus hijos
 * (navbar-buttons, listar-pokemon > pokemon-card, y la propia pokedex-app
 * dentro de navbar-buttons).
 *
 * Algunos pasos (la pokedex abierta, el reverso de una card) requieren un
 * cambio de estado que solo existe mientras el usuario interactúa: el modal
 * de la pokedex y el flip de la card no están en el DOM/visibles hasta que
 * se activan. Por eso el tour intercepta la navegación (onNextClick) para
 * forzar ese estado ANTES de pedirle a driver.js que resuelva y resalte el
 * elemento del paso siguiente, y usa `element` como función (no como
 * referencia fija) para que se recalcule recién cuando ese elemento ya
 * existe. También cierra la pokedex al salir de esa sección (paso de
 * favoritos), porque de ahí en adelante el tour vuelve a mostrar la página
 * principal y el modal taparía todo.
 */
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

  // El D-pad, el numpad y los botones PREV/NEXT viven en su propio
  // componente (pokedex-dpad, pokedex-numpad, pokedex-nav-buttons), cada
  // uno con su propio shadow root — un nivel más profundo que el resto de
  // pokedexShadow(). componentSelector selecciona ese componente dentro del
  // shadow de pokedex-app; innerSelector busca adentro de SU shadow root.
  function pokedexDeepShadow(componentSelector, innerSelector) {
    return pokedexShadow(componentSelector)?.shadowRoot?.querySelector(innerSelector) ?? null;
  }

  async function openPokedex() {
    if (!navbar) return;
    navbar.isOpen = true;
    await navbar.updateComplete;
    const pokedexApp = getPokedexApp();
    if (pokedexApp) {
      // isOpen = tapa del dispositivo abierta; isOn = encendido. Son dos
      // estados distintos (ver pokedex-app.js) y el tour necesita ambos.
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
    // A partir de acá la pokedex está abierta y encendida (ver
    // stepRequirements[2] = openPokedex).
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
    // A partir de acá se cierra la pokedex (stepRequirements en el índice
    // de este paso = closePokedex) y volvemos a la página principal.
    {
      element: () => root.querySelector("pokemon-type-filter"),
      popover: {
        title: "Filtrar por tipo",
        description:
          'Haz clic en uno o más tipos para mostrar solo esos Pokémon. Con "Ver todos" limpias el filtro.',
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
    // A partir de acá se fuerza el estado hover (rango HOVER_FIRST_STEP..
    // HOVER_LAST_STEP), ya que esta info solo se revela al pasar el mouse.
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
    // A partir de acá se saca el hover forzado y se flippea la card (rango
    // FLIP_FIRST_STEP..FLIP_LAST_STEP).
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
  // Se corrieron +1 por el nuevo paso del filtro por tipo, insertado justo
  // antes del paso de favoritos.
  const HOVER_FIRST_STEP = 14;
  const HOVER_LAST_STEP = 18;
  const FLIP_FIRST_STEP = 19;
  const FLIP_LAST_STEP = 20;

  // Calcula y aplica el estado exacto que le corresponde a un índice de
  // paso, sea que se llegue a él avanzando o retrocediendo — así "Anterior"
  // también deja la pokedex/card como ese paso las necesita, no solo
  // "Siguiente".
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
