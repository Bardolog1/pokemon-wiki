import { driver } from "driver.js";
import "driver.js/dist/driver.css";

/**
 * Arma y arranca el tour guiado de la app. Recibe el componente raíz
 * (PokemonWiki) para poder alcanzar, vía su renderRoot, tanto sus propios
 * elementos como los que viven dentro del Shadow DOM de sus hijos
 * (navbar-buttons, listar-pokemon > pokemon-card).
 */
export function startAppTour(pokemonWikiEl) {
  const root = pokemonWikiEl.renderRoot;

  const banner = root.querySelector("banner-title");
  const navbar = root.querySelector("navbar-buttons");
  const pokedexBtn = navbar?.shadowRoot?.querySelector(".pokedex-button");
  const favoritesToggle = root.querySelector(".favorites-toggle");
  const paginator = root.querySelector("#paginator");
  const list = root.querySelector("listar-pokemon");
  const firstCard = list?.shadowRoot?.querySelector("pokemon-card");

  const steps = [];

  if (banner) {
    steps.push({
      element: banner,
      popover: {
        title: "¡Bienvenido!",
        description: "Esta es tu Pokédex interactiva. Te muestro rápido cómo funciona.",
      },
    });
  }

  if (pokedexBtn) {
    steps.push({
      element: pokedexBtn,
      popover: {
        title: "Pokédex retro",
        description:
          "Hacé click acá para abrir la Pokédex. También podés arrastrar este ícono y soltarlo sobre cualquier carta para abrirla directo con ese Pokémon.",
      },
    });
  }

  if (favoritesToggle) {
    steps.push({
      element: favoritesToggle,
      popover: {
        title: "Favoritos",
        description:
          "Marcá Pokémon como favoritos desde su carta, y volvé a verlos acá cuando quieras, sin importar en qué página estén.",
      },
    });
  }

  if (paginator) {
    steps.push({
      element: paginator,
      popover: {
        title: "Navegación",
        description: "Recorré la Pokédex por páginas.",
      },
    });
  }

  if (firstCard) {
    steps.push({
      element: firstCard,
      popover: {
        title: "Las cartas",
        description:
          "Pasá el mouse sobre una carta para ver sus datos. Click en la carta para ver sus debilidades y resistencias de tipo. La estrella la marca como favorita, y el ícono de pokedex la abre ya precargada.",
      },
    });
  }

  if (steps.length === 0) return;

  const tour = driver({
    showProgress: true,
    steps,
    nextBtnText: "Siguiente",
    prevBtnText: "Anterior",
    doneBtnText: "Listo",
  });

  tour.drive();
}
