import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
          "Hacé click acá para abrir la Pokédex. También podés arrastrar este ícono y soltarlo sobre cualquier carta para abrirla directo con ese Pokémon.",
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
        description: "Acá se muestra la información del Pokémon que busques o navegues.",
      },
    },
    {
      element: () => pokedexShadow(".grid-buttons"),
      popover: {
        title: "Teclado numérico",
        description: "Escribí el número del Pokémon que querés buscar (hasta 7 dígitos).",
      },
    },
    {
      element: () => pokedexShadow(".middle-controls .white-btns"),
      popover: {
        title: "DEL y GO",
        description: "DEL borra el último dígito. GO ejecuta la búsqueda con lo que escribiste.",
      },
    },
    {
      element: () => pokedexShadow(".yellow-btn"),
      popover: {
        title: "Reiniciar",
        description: "Limpia la búsqueda actual y vuelve a la pantalla de inicio.",
      },
    },
    {
      element: () => pokedexShadow(".d-pad"),
      popover: {
        title: "D-pad",
        description:
          "Izquierda/derecha cambia entre las vistas del Pokémon (stats, movimientos, descripción, evoluciones). Arriba/abajo hace scroll dentro de la pantalla.",
      },
    },
    {
      element: () => pokedexShadow(".red-bezel-btn"),
      popover: {
        title: "Sonido",
        description: "Reproduce el grito del Pokémon que estés viendo.",
      },
    },
    {
      element: () => pokedexShadow(".bottom-controls"),
      popover: {
        title: "Anterior / Siguiente",
        description: "Navegá al Pokémon anterior o siguiente sin tener que escribir su número.",
      },
    },
    // A partir de acá se cierra la pokedex (stepRequirements en el índice
    // de este paso = closePokedex) y volvemos a la página principal.
    {
      element: () => root.querySelector(".favorites-toggle"),
      popover: {
        title: "Favoritos",
        description:
          "Marcá Pokémon como favoritos desde su carta, y volvé a verlos acá cuando quieras, sin importar en qué página estén.",
      },
    },
    {
      element: () => root.querySelector("#paginator"),
      popover: {
        title: "Navegación",
        description: "Recorré la Pokédex por páginas.",
      },
    },
    {
      element: () => firstCard,
      popover: {
        title: "El frente de la carta",
        description: "Así se ve cada Pokémon en la lista, solo la imagen.",
      },
    },
    // A partir de acá se fuerza el estado hover (stepRequirements en este
    // índice), ya que la info solo se revela al pasar el mouse.
    {
      element: () => firstCard,
      popover: {
        title: "Con el mouse encima",
        description:
          "Al pasar el mouse se revela nombre, tipo, peso y altura. La estrella marca como favorita, y el ícono de pokedex la abre ya precargada.",
      },
    },
    // Última: se saca el hover forzado y se flippea la card.
    {
      element: () => firstCard,
      popover: {
        title: "El reverso: Matriz de Tipos",
        description:
          "Hacé click en cualquier parte de la carta para darla vuelta y ver contra qué tipos es débil y a cuáles resiste.",
      },
    },
  ];

  const POKEDEX_FIRST_STEP = 2;
  const POKEDEX_LAST_STEP = 9;
  const HOVER_STEP = 13;
  const FLIP_STEP = 14;

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
    await forceHover(index === HOVER_STEP);
    await flipCard(index === FLIP_STEP);
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
