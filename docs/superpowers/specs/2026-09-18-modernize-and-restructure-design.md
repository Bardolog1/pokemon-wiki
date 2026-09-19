# Modernize build tooling and restructure architecture

**Status:** Approved for planning
**Date:** 2026-09-18

## Context

`poke-lit-app` is a Lit 2 + Web Components Pokédex, built with Rollup 2 and
`@web/test-runner`, deployed statically to Netlify. It works, but:

- Tooling is aging (`rollup@2`, `@web/dev-server@0.1`, `@web/test-runner@0.14`)
  and some code imports from `lit-element` directly instead of `lit`, which
  only resolves today via transitive hoisting from the `lit` package.
- All view components live flat in `src/components/view/`, with two of them
  (`card-poke.js` at 686 lines, `paginador-poke.js` at 413 lines) each
  bundling multiple responsibilities: layout, duplicated markup, a charting
  library dependency, and (for the paginator) pure pagination math mixed
  with rendering.
- The "API layer" (`api-request.js`, `data-manager.js`) extends `LitElement`
  and registers itself via `customElements.define` solely to get an
  `EventTarget`, even though neither is ever mounted to the DOM. Everything
  in both classes is already `async`, so the event indirection is
  unnecessary complexity.
- Storybook is referenced in `package.json` scripts but never actually set
  up (no `.storybook/` config exists).
- `custom-elements.json` / `@custom-elements-manifest/analyzer` is kept for
  Storybook integration going forward.

TypeScript adoption is explicitly **out of scope** for this change — will be
evaluated separately once this restructuring lands.

## Goals

1. Replace Rollup + `@web/dev-server` + `@web/test-runner` with **Vite** (dev
   server + production build) and **Vitest** (unit + component tests).
2. Reorganize `src/` into simple layers: `components/`, `services/`,
   `styles/` (only where warranted) instead of the current
   `components/{API,view}` split.
3. Decompose the two oversized components into small, independently
   mountable/demountable Lit components ("lego" components) — each with its
   own Storybook story — eliminating the duplicated markup found during
   evaluation.
4. Replace the event-based pseudo-services (`api-request.js`,
   `data-manager.js`) with a plain async/await, 3-tier data layer:
   `api` (raw fetch, all request variations) → `data-manager` (transforms
   raw API data for what the visual layer needs).
5. Set up Storybook for real, with a story per lego component.
6. Fix all `"lit-element"` imports to import from `"lit"`.

## Non-goals

- TypeScript migration (future, separate change).
- Changing the PokéAPI usage/endpoints or adding new features.
- Redesigning visual styling/UX (colors, layout) — only code structure
  changes; the fixed `icon-end`/`icon-back` SVG mismatch found during
  evaluation is called out below but **not fixed silently** — see Known
  issues.

## Target folder structure

```
src/
  main.js                        # entry point (renamed from pokemon-wiki.js)
  app/
    pokemon-wiki.js              # root component (renamed from PokemonWiki.js)
  components/
    banner-title/
      banner-title.js
      banner-title.stories.js
    navbar-buttons/
      navbar-buttons.js
      navbar-buttons.stories.js
    pokemon-list/
      pokemon-list.js             # renamed from listar-pokemon.js
      pokemon-list.stories.js
    pokemon-card/
      pokemon-card.js              # renamed from card-poke.js, orchestrator only
      pokemon-card.styles.js       # extracted front/back CSS
      pokemon-card.stories.js
      pokemon-type-badge.js
      pokemon-type-badge.stories.js
      pokemon-stat-item.js
      pokemon-stat-item.stories.js
      pokemon-flip-buttons.js
      pokemon-flip-buttons.stories.js
      pokemon-stats-chart.js       # encapsulates Chart.js entirely
      pokemon-stats-chart.stories.js
    pagination/
      pagination.js                 # renamed from paginador-poke.js, orchestrator only
      pagination.utils.js           # calcPages / getLimit / getNumberList — pure functions
      pagination.utils.test.js
      pagination.stories.js
      pagination-button.js
      pagination-button.stories.js
      pagination-numbers.js
      pagination-numbers.stories.js
  services/
    api/
      poke-api.js                  # renamed from api-request.js, plain class, no LitElement/events
      poke-api.test.js
    data-managers/
      pokemon-data-manager.js      # renamed from data-manager.js, plain class, no LitElement/events
      pokemon-data-manager.test.js
```

Naming: kebab-case files, PascalCase classes, custom element tags keep the
`pokemon-`/`pagination-` prefix pattern already in use (`card-poke` →
`pokemon-card`, `paginador-poke` → `pagination`, etc.) for clarity now that
we're in English-oriented, mnemonic names.

## Component decomposition detail

### `pokemon-card` (was `card-poke.js`)

Evaluation found real duplication and mixed concerns, not just size:

- **`pokemon-type-badge`**: renders one type `<span>` with its gradient
  background; owns `getTypeColors`/`getTypeNameForSVG` and the
  `TYPES_COLORS` map. Today this logic lives inline in the card and is
  invoked once per type.
- **`pokemon-stat-item`**: icon + label + value block. Today the
  weight/height blocks are two copy-pasted instances of the same markup
  with only icon/label/value swapped.
- **`pokemon-flip-buttons`**: the pokedex/flip button pair. Today it's
  copy-pasted verbatim between the front and back faces of the card.
- **`pokemon-stats-chart`**: owns the `<canvas>` and all Chart.js setup
  (`toggleFlip`'s chart-construction logic moves here, triggered by a
  `visible`/`pokemon` property change instead of being called imperatively
  from the parent).
- `pokemon-card` becomes the orchestrator: holds `flipped` state, renders
  front/back faces, composes the four components above, still receives the
  raw `pokemon` object as a property.
- CSS: front-face and back-face rules split into named exports inside
  `pokemon-card.styles.js`, imported into `pokemon-card.js`. Per-component
  CSS (badge, stat-item, buttons, chart) lives inside each new component
  since each is now small enough to keep styles co-located.

### `pagination` (was `paginador-poke.js`)

- **`pagination.utils.js`**: pure functions extracted from `calcPages`,
  `_getLimit`, `_getNumberList`'s number-generation logic — no DOM, no
  `this`, plain inputs/outputs. Unit-tested directly in Vitest.
- **`pagination-button`**: one button (icon, click handler, disabled state)
  as a reusable component; the orchestrator renders four instances
  (first/back/next/end).
- **`pagination-numbers`**: the number list + active-number rendering,
  receives the computed number list and current page as properties.
- `pagination` becomes the orchestrator: owns `currentPage`/`pages`/etc.
  state, calls `pagination.utils.js` functions, composes the two components
  above, dispatches the same `first-click`/`back-click`/`next-click`/
  `end-click`/`number-click` events consumers already listen for (no
  breaking change to `PokemonWiki`'s event contract).

### Known issue (not silently fixed)

`icon-end` currently uses `first.svg` and `icon-back` uses `next.svg` — both
appear swapped/wrong. This will be preserved as-is during the mechanical
move (moving a bug is not fixing it silently), and flagged to the user
separately for an explicit yes/no once the structural change lands.

## Data layer

Replace the `LitElement`-based event pseudo-services with plain classes:

```js
// services/api/poke-api.js
export class PokeApi {
  async getCount() { ... }               // was _getBasicsPokemon
  async getPage(offset, limit) { ... }   // was _getPagePokes
  async getPokemon(url) { ... }          // was _getPokemonEndpoint
}
```

```js
// services/data-managers/pokemon-data-manager.js
export class PokemonDataManager {
  constructor(api = new PokeApi()) { this.api = api; }
  async getResultsCount() { ... }
  async getPokemonPage({ page, resultsPerPage }) { ... } // returns transformed list
}
```

No `CustomEvent`s, no `customElements.define`, no `LitElement` inheritance —
plain `async`/`await` with return values and thrown errors. This is directly
testable in Vitest without DOM fixtures.

One data manager for now (`pokemon-data-manager.js`), matching the single
consumption pattern that exists today (list + per-item detail combined into
one shape for the card). A second data manager is added later only if a
new visual consumer needs a genuinely different transformation — not
speculatively now.

`pokemon-wiki.js` (the root component) updates to call
`PokemonDataManager` directly with `await`, replacing its current
`addEventListener` dance.

### Error handling

Today errors are swallowed (`console.error` only, one branch even
references an undefined `error` variable — a real bug: `catch { console.error(error) }`
with no bound `error` in the `catch` clause). With the async/await rewrite,
`PokemonDataManager` methods propagate errors normally; `pokemon-wiki.js`
wraps its calls in `try/catch` and can surface a minimal error state (exact
UI treatment left to implementation, e.g. a simple message in place of the
list) instead of failing silently.

## Testing strategy (Vitest)

- **Pure logic** (`pagination.utils.js`, `pokemon-data-manager.js`,
  `poke-api.js`): plain Vitest unit tests, no DOM.
- **Lit components**: Vitest with `@open-wc/testing-helpers` fixtures
  (`happy-dom` or browser mode, decided during implementation based on what
  works cleanly with Lit's shadow DOM in Vitest) — one test file per lego
  component, colocated (`*.test.js` next to the component).
- Existing `web-test-runner.config.mjs` and its config are removed once
  Vitest coverage replaces it.

## Storybook

- Real Storybook setup (currently only referenced in scripts, never
  configured) using the Web Components framework integration compatible
  with Vite.
- One `.stories.js` per lego component (see folder structure above), with
  controls for its properties, so each piece can be viewed and interacted
  with in isolation — this is the primary deliverable of the "lego app"
  goal alongside the decomposition itself.
- `pokemon-card` and `pagination` (the orchestrators) also get a story
  composing their children, to verify the assembled result still works.

## Build tooling migration

- Remove: `rollup.config.js`, `web-dev-server.config.mjs`,
  `web-test-runner.config.mjs`, and the associated devDependencies
  (`rollup*`, `@web/dev-server*`, `@web/test-runner*`,
  `@open-wc/building-rollup`, `@rollup/plugin-*`, `babel-plugin-template-html-minifier`,
  `@babel/preset-env`).
- Add: `vite`, `vitest`, storybook's Vite + web-components builder packages,
  keep `@open-wc/testing-helpers` and `@custom-elements-manifest/analyzer`
  (Storybook needs the manifest).
- `package.json` scripts become: `dev` (was `start`), `build`, `preview`
  (was `start:build`), `test`, `test:watch`, `storybook`,
  `storybook:build`, `analyze`.
- `index.html` stays as Vite's entry HTML (Vite convention), pointing at
  `src/main.js` as a `type="module"` script.
- Netlify deploy config updated only if the build output directory/command
  changes (Vite defaults to `dist/`, matching current Netlify expectations —
  verify during implementation).

## Out of scope / left as-is

- `poke.js` (untracked file at repo root) — not part of the current app
  (not imported anywhere found), left untouched; ask the user separately if
  it should be deleted or integrated.
- TypeScript.
- Visual/UX redesign.
