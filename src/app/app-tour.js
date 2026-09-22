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
 * existe.
 */
export function startAppTour(pokemonWikiEl) {
  const root = pokemonWikiEl.renderRoot;

  const navbar = root.querySelector("navbar-buttons");
  const list = root.querySelector("listar-pokemon");
  const firstCard = list?.shadowRoot?.querySelector("pokemon-card");

  function getPokedexApp() {
    return navbar?.shadowRoot?.querySelector("pokedex-app") ?? null;
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

  // Qué estado necesita cada índice de paso antes de poder mostrarse.
  // (índice -> función async que deja el DOM listo para ese paso)
  const stepRequirements = {
    2: openPokedex,
    3: openPokedex,
    7: () => flipCard(true),
  };

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
    {
      element: () => getPokedexApp()?.shadowRoot?.querySelector(".screen-bezel"),
      popover: {
        title: "La pantalla",
        description:
          "Escribí un número o nombre con el teclado y tocá GO para buscar. Usá PREV/NEXT para ir al Pokémon anterior o siguiente sin escribir nada.",
      },
    },
    {
      element: () => getPokedexApp()?.shadowRoot?.querySelector(".red-bezel-btn"),
      popover: {
        title: "Sonido y navegación",
        description:
          "El punto rojo reproduce el grito del Pokémon actual. El D-pad de la izquierda cambia entre las vistas (stats, movimientos, descripción, evoluciones) y hace scroll dentro de la pantalla.",
      },
    },
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
        description:
          "Pasá el mouse para ver nombre, tipo, peso y altura. La estrella la marca como favorita, y el ícono de pokedex la abre ya precargada.",
      },
    },
    {
      element: () => firstCard,
      popover: {
        title: "El reverso: Matriz de Tipos",
        description:
          "Hacé click en cualquier parte de la carta para darla vuelta y ver contra qué tipos es débil y a cuáles resiste.",
      },
    },
  ];

  async function cleanup() {
    await closePokedex();
    await flipCard(false);
  }

  const tourObj = driver({
    showProgress: true,
    steps,
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Listo",
    onNextClick: async () => {
      const nextIndex = tourObj.getActiveIndex() + 1;
      const prepare = stepRequirements[nextIndex];
      if (prepare) await prepare();
      tourObj.moveNext();
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
