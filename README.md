# Pokédex

[![Netlify Status](https://api.netlify.com/api/v1/badges/9d73e7ed-8113-4f35-9641-6b31b9171646/deploy-status)](https://app.netlify.com/sites/pokedex-lit/deploys)

Pokédex web construida con [Lit](https://lit.dev) y la [PokéAPI](https://pokeapi.co). Lista Pokémon paginados y muestra sus estadísticas al hacer clic en cada tarjeta.

**Demo:** https://pokemowiki.netlify.app/

![Vista principal](https://github.com/Bardolog1/pokemon-wiki/assets/64260884/ca4811f3-19fa-46b0-beeb-a64d3cc308d3)
![Detalle de estadísticas](https://github.com/Bardolog1/pokemon-wiki/assets/64260884/f6cceea7-9358-44f2-be24-2ca4ce27d750)

## Stack técnico

- [Lit](https://lit.dev) — Web Components
- [Vite](https://vitejs.dev) — servidor de desarrollo y build
- [Vitest](https://vitest.dev) — tests unitarios
- [Storybook](https://storybook.js.org) — catálogo de componentes aislados
- [Chart.js](https://www.chartjs.org) — gráficos de estadísticas por Pokémon
- [PokéAPI](https://pokeapi.co) — fuente de datos

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Scripts

| Comando                   | Descripción                                                    |
| -------------------------- | ---------------------------------------------------------------- |
| `npm run dev`               | Servidor de desarrollo con recarga en caliente                   |
| `npm run build`             | Build de producción en `dist/`                                   |
| `npm run preview`           | Sirve el build de producción localmente                          |
| `npm run test`              | Corre los tests una vez, con cobertura                           |
| `npm run test:watch`        | Corre los tests en modo watch                                    |
| `npm run storybook`         | Levanta Storybook en `localhost:6006`                             |
| `npm run storybook:build`   | Genera el build estático de Storybook en `storybook-static/`     |
| `npm run analyze`           | Regenera `custom-elements.json` a partir de los componentes      |

## Arquitectura

```
src/
  main.js                     # punto de entrada
  app/
    pokemon-wiki.js           # componente raíz
  components/                 # un directorio por componente, con su story
    pagination/
    pokemon-card/
    pokemon-list/
    banner-title/
    navbar-buttons/
  services/
    api/                      # peticiones crudas a la PokéAPI
    data-managers/            # transforma la respuesta cruda para cada vista
```

La capa de datos tiene dos niveles: `services/api` hace las peticiones HTTP sin transformar nada, y `services/data-managers` consume ese resultado y lo adapta a lo que necesita cada componente visual. Ningún componente llama a `fetch` directamente.

Los componentes de UI están descompuestos por responsabilidad: `pokemon-card` y `pagination` son orquestadores que componen piezas más chicas (`pokemon-type-badge`, `pokemon-stat-item`, `pagination-button`, etc.), cada una documentada con su propia story en Storybook.

## Licencia

MIT — ver [LICENSE](LICENSE).
