# Modernize Build Tooling & Restructure Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `poke-lit-app` from Rollup/@web/test-runner to Vite/Vitest,
replace the event-based pseudo-services with a plain async/await 3-tier data
layer, decompose the two oversized Lit components into small independently
mountable "lego" components, and set up Storybook with a story per lego
component.

**Architecture:** `src/` moves from `components/{API,view}` to
`app/ (root component) + components/ (per-feature folders) + services/
(api + data-managers)`. Each oversized component becomes an orchestrator
that composes small, single-purpose Lit components. All internal
service/data-manager communication moves from `CustomEvent`s dispatched by
`LitElement`-based pseudo-elements to plain `async`/`await` classes.

**Tech Stack:** Lit 2 (kept), Vite, Vitest, `@open-wc/testing-helpers`,
Storybook (`@storybook/web-components-vite`), Chart.js (kept, now isolated
in `pokemon-stats-chart`).

**Spec:** `docs/superpowers/specs/2026-09-18-modernize-and-restructure-design.md`

## Global Constraints

- TypeScript is out of scope — do not introduce `.ts` files.
- No visual/UX redesign — CSS values move between files unchanged unless a
  task explicitly says otherwise.
- The `icon-end`/`icon-back` SVG mismatch in the paginator is preserved
  as-is when moved (see spec "Known issue") — do not fix it in this plan.
- `poke.js` at the repo root is untouched.
- Custom event contract dispatched by the paginator
  (`first-click`/`back-click`/`next-click`/`end-click`/`number-click`,
  each with `detail: { page, results_page, total }`) must not change —
  `pokemon-wiki.js` (soon `app/pokemon-wiki.js`) listens for these by name.
- Every new/moved Lit component keeps its existing custom-element tag
  behavior unless the spec's folder structure says otherwise (tags:
  `pokemon-card`, `pagination`, `pokemon-list`, `banner-title`,
  `navbar-buttons`, plus new tags `pokemon-type-badge`, `pokemon-stat-item`,
  `pokemon-flip-buttons`, `pokemon-stats-chart`, `pagination-button`,
  `pagination-numbers`).

---

## Task 1: Migrate build & dev server to Vite

**Files:**
- Create: `vite.config.js`
- Modify: `package.json` (scripts + dependencies)
- Delete: `rollup.config.js`, `web-dev-server.config.mjs`
- Modify: `index.html:26` (script `src` path stays `./src/pokemon-wiki.js` for now — folder restructuring happens in Task 6)

**Interfaces:**
- Produces: `npm run dev` (Vite dev server), `npm run build` (Vite build to `dist/`), `npm run preview` (serve `dist/`) — later tasks and the human verifying this plan rely on these three script names.

- [ ] **Step 1: Install Vite, remove Rollup/@web/dev-server packages**

```bash
npm install -D vite@latest
npm uninstall rollup @rollup/plugin-babel @rollup/plugin-node-resolve @open-wc/building-rollup @web/dev-server @web/dev-server-storybook @web/rollup-plugin-html @web/rollup-plugin-import-meta-assets rollup-plugin-copy rollup-plugin-terser rollup-plugin-workbox babel-plugin-template-html-minifier @babel/preset-env
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});
```

- [ ] **Step 3: Delete old build/dev-server configs**

```bash
rm rollup.config.js web-dev-server.config.mjs
```

- [ ] **Step 4: Update `package.json` scripts**

Replace the `scripts` block with:

```json
"scripts": {
  "dev": "vite",
  "start": "vite",
  "build": "rimraf dist && vite build && npm run analyze -- --exclude dist",
  "preview": "vite preview",
  "analyze": "cem analyze --litelement"
}
```

(Keep `rimraf` — it stays a devDependency. Test/Storybook scripts are added in Tasks 2 and 9.)

- [ ] **Step 5: Verify the dev server runs**

Run: `npm run dev`
Expected: Vite starts, prints a local URL, and opening it in a browser
shows the existing (unmodified) Pokédex app working exactly as before —
this is a build-tool swap only, no behavior changed yet.

Stop the dev server after confirming.

- [ ] **Step 6: Verify the production build runs**

Run: `npm run build`
Expected: exits 0, creates `dist/index.html` and bundled assets. Then:

Run: `npm run preview`
Expected: serves `dist/`, app loads and works identically to `npm run dev`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "build: migrate dev server and production build from Rollup to Vite"
```

---

## Task 2: Migrate test runner to Vitest

**Files:**
- Create: `vitest.config.js`
- Create: `src/test-setup.js`
- Modify: `package.json` (scripts + dependencies)
- Delete: `web-test-runner.config.mjs`

**Interfaces:**
- Produces: `npm run test` (single run with coverage), `npm run test:watch` — used by every later task that adds a `*.test.js` file.

- [ ] **Step 1: Install Vitest and browser-testing helpers**

```bash
npm install -D vitest@latest @vitest/coverage-v8@latest happy-dom@latest
npm uninstall @web/test-runner
```

(`@open-wc/testing` is kept — Task 4 onward uses its `fixture`/`html` helpers, which work under Vitest with `happy-dom`.)

- [ ] **Step 2: Create `vitest.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
    include: ['src/**/*.test.js'],
  },
});
```

- [ ] **Step 3: Create `src/test-setup.js`**

```js
// Shared Vitest setup. Kept intentionally minimal — individual test files
// stay self-contained. Extend this only when a cross-file DOM/globals
// concern actually shows up (e.g. custom element re-registration).
```

- [ ] **Step 4: Delete old test-runner config**

```bash
rm web-test-runner.config.mjs
```

- [ ] **Step 5: Update `package.json` scripts**

Add to the `scripts` block from Task 1:

```json
"test": "vitest run --coverage",
"test:watch": "vitest"
```

- [ ] **Step 6: Verify Vitest runs with zero tests**

Run: `npm run test`
Expected: exits 0, reports "No test files found" (this is expected — no
`*.test.js` files exist yet; they're added starting Task 4).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "test: migrate test runner from @web/test-runner to Vitest"
```

---

## Task 3: Fix `lit-element` imports to import from `lit`

**Files:**
- Modify: `src/PokemonWiki.js:1`
- Modify: `src/components/view/card-poke.js:1`
- Modify: `src/components/view/listar-pokemon.js:1`
- Modify: `src/components/view/navbar-buttons.js:1`
- Modify: `src/components/view/paginador-poke.js:1`
- Modify: `src/components/view/banner-title.js:1`
- Modify: `src/components/API/api-request.js:1`
- Modify: `src/components/API/data-manager.js:1`

**Interfaces:**
- None — this is a mechanical import-path fix with no behavior change.

- [ ] **Step 1: Replace the import in every file listed above**

In each file, change:

```js
import { LitElement, html, css } from "lit-element";
```

(or the subset actually imported, e.g. `import { LitElement } from "lit-element";` in `api-request.js`/`data-manager.js`) to import the same named exports from `"lit"` instead. Example for `PokemonWiki.js`:

```js
import { LitElement, html, css } from "lit";
```

- [ ] **Step 2: Verify nothing else imports from `lit-element`**

Run: `grep -rn "from \"lit-element\"" src/` (or your editor's search)
Expected: no matches.

- [ ] **Step 3: Verify the app still runs**

Run: `npm run dev`, open the app, confirm the Pokédex list, pagination, and
card flip still work exactly as before.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "fix: import from lit instead of the transitive lit-element dependency"
```

---

## Task 4: Rewrite the API layer as a plain async class

**Files:**
- Create: `src/services/api/poke-api.js`
- Create: `src/services/api/poke-api.test.js`
- Delete: `src/components/API/api-request.js`

**Interfaces:**
- Produces: `PokeApi` class with `async getCount(url)`, `async getPage(url)`, `async getPokemon(url)` — each returns the parsed JSON body directly or throws. Task 5's `PokemonDataManager` consumes these three methods.

- [ ] **Step 1: Write the failing tests**

```js
// src/services/api/poke-api.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokeApi } from './poke-api.js';

describe('PokeApi', () => {
  let api;

  beforeEach(() => {
    api = new PokeApi();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getCount returns the parsed JSON body for the given URL', async () => {
    globalThis.fetch.mockResolvedValue({
      json: () => Promise.resolve({ count: 1302 }),
    });

    const result = await api.getCount('https://pokeapi.co/api/v2/pokemon');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon',
      { method: 'GET' },
    );
    expect(result).toEqual({ count: 1302 });
  });

  it('getPage returns the parsed JSON body for the given URL', async () => {
    globalThis.fetch.mockResolvedValue({
      json: () => Promise.resolve({ results: [{ url: 'x' }] }),
    });

    const result = await api.getPage('https://pokeapi.co/api/v2/pokemon?offset=0&limit=5');

    expect(result).toEqual({ results: [{ url: 'x' }] });
  });

  it('getPokemon returns the parsed JSON body for the given URL', async () => {
    globalThis.fetch.mockResolvedValue({
      json: () => Promise.resolve({ id: 1, name: 'bulbasaur' }),
    });

    const result = await api.getPokemon('https://pokeapi.co/api/v2/pokemon/1');

    expect(result).toEqual({ id: 1, name: 'bulbasaur' });
  });

  it('propagates a fetch rejection instead of swallowing it', async () => {
    globalThis.fetch.mockRejectedValue(new Error('network down'));

    await expect(api.getCount('https://pokeapi.co/api/v2/pokemon')).rejects.toThrow('network down');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- poke-api`
Expected: FAIL with "Cannot find module './poke-api.js'" (file doesn't exist yet).

- [ ] **Step 3: Write the implementation**

```js
// src/services/api/poke-api.js
const GET = 'GET';

export class PokeApi {
  async #request(url) {
    const response = await fetch(url, { method: GET });
    return response.json();
  }

  async getCount(url) {
    return this.#request(url);
  }

  async getPage(url) {
    return this.#request(url);
  }

  async getPokemon(url) {
    return this.#request(url);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- poke-api`
Expected: PASS, 4 tests.

- [ ] **Step 5: Delete the old event-based API class**

```bash
rm src/components/API/api-request.js
```

(Nothing imports it directly yet except `data-manager.js`, updated in Task 5.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: replace event-based ApiRequest with plain async PokeApi"
```

---

## Task 5: Rewrite the data manager and wire it into the root component

**Files:**
- Create: `src/services/data-managers/pokemon-data-manager.js`
- Create: `src/services/data-managers/pokemon-data-manager.test.js`
- Modify: `src/PokemonWiki.js:1-138` (constructor, `_getResults`, `_getPokemonList`)
- Delete: `src/components/API/data-manager.js`

**Interfaces:**
- Consumes: `PokeApi` from Task 4 (`getCount`, `getPage`, `getPokemon`).
- Produces: `PokemonDataManager` with `async getResultsCount(url)` returning a `Number`, and `async getPokemonPage({ url, page, resultsPerPage })` returning an `Array` of pokemon objects shaped like `_constructPokefirst`'s current output (`{ id, name, exp, img, type, stats: { hp, attack, defense, special_attack, special_defense, speed }, height, weight }`). `PokemonWiki` (Task 6+ callers) consumes both.

- [ ] **Step 1: Write the failing tests**

```js
// src/services/data-managers/pokemon-data-manager.test.js
import { describe, it, expect, vi } from 'vitest';
import { PokemonDataManager } from './pokemon-data-manager.js';

function makeFakeApi(overrides = {}) {
  return {
    getCount: vi.fn().mockResolvedValue({ count: 1302 }),
    getPage: vi.fn().mockResolvedValue({
      results: [{ url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
    }),
    getPokemon: vi.fn().mockResolvedValue({
      id: 1,
      name: 'bulbasaur',
      base_experience: 64,
      sprites: {
        front_default: 'front.png',
        other: {
          dream_world: { front_default: null },
          'official-artwork': { front_default: 'artwork.png' },
          home: { front_default: null },
        },
      },
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      stats: [
        { base_stat: 45 },
        { base_stat: 49 },
        { base_stat: 49 },
        { base_stat: 65 },
        { base_stat: 65 },
        { base_stat: 45 },
      ],
      height: 7,
      weight: 69,
    }),
    ...overrides,
  };
}

describe('PokemonDataManager', () => {
  it('getResultsCount returns the numeric count from the API', async () => {
    const dm = new PokemonDataManager(makeFakeApi());

    const count = await dm.getResultsCount('https://pokeapi.co/api/v2/pokemon');

    expect(count).toBe(1302);
  });

  it('getPokemonPage fetches the page then each pokemon detail, transformed', async () => {
    const api = makeFakeApi();
    const dm = new PokemonDataManager(api);

    const list = await dm.getPokemonPage({
      baseUrl: 'https://pokeapi.co/api/v2/pokemon',
      page: 1,
      resultsPerPage: 5,
    });

    expect(api.getPage).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=5',
    );
    expect(list).toEqual([
      {
        id: 1,
        name: 'bulbasaur',
        exp: 64,
        img: 'artwork.png',
        type: ['grass', 'poison'],
        stats: {
          hp: 45,
          attack: 49,
          defense: 49,
          special_attack: 65,
          special_defense: 65,
          speed: 45,
        },
        height: 7,
        weight: 69,
      },
    ]);
  });

  it('falls back to front_default sprite when no "other" artwork exists', async () => {
    const api = makeFakeApi({
      getPokemon: vi.fn().mockResolvedValue({
        id: 2,
        name: 'ivysaur',
        base_experience: 142,
        sprites: { front_default: 'front.png', other: {} },
        types: [],
        stats: [],
        height: 10,
        weight: 130,
      }),
    });
    const dm = new PokemonDataManager(api);

    const [pokemon] = await dm.getPokemonPage({
      baseUrl: 'https://pokeapi.co/api/v2/pokemon',
      page: 1,
      resultsPerPage: 1,
    });

    expect(pokemon.img).toBe('front.png');
  });

  it('propagates a rejection from the API layer', async () => {
    const api = makeFakeApi({ getCount: vi.fn().mockRejectedValue(new Error('boom')) });
    const dm = new PokemonDataManager(api);

    await expect(dm.getResultsCount('https://pokeapi.co/api/v2/pokemon')).rejects.toThrow('boom');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- pokemon-data-manager`
Expected: FAIL with "Cannot find module './pokemon-data-manager.js'".

- [ ] **Step 3: Write the implementation**

```js
// src/services/data-managers/pokemon-data-manager.js
import { PokeApi } from '../api/poke-api.js';

export class PokemonDataManager {
  constructor(api = new PokeApi()) {
    this.api = api;
  }

  async getResultsCount(url) {
    const data = await this.api.getCount(url);
    return Number(data.count);
  }

  async getPokemonPage({ baseUrl, page, resultsPerPage }) {
    const offset = resultsPerPage * page - resultsPerPage;
    const url = `${baseUrl}?offset=${offset}&limit=${resultsPerPage}`;

    const page_ = await this.api.getPage(url);
    const details = await Promise.all(
      page_.results.map((entry) => this.api.getPokemon(entry.url)),
    );

    return details.map((detail) => this.#toPokemon(detail));
  }

  #toPokemon(detail) {
    const img =
      detail.sprites.other?.dream_world?.front_default ||
      detail.sprites.other?.['official-artwork']?.front_default ||
      detail.sprites.other?.home?.front_default ||
      detail.sprites.front_default;

    return {
      id: detail.id,
      name: detail.name,
      exp: detail.base_experience,
      img: img || null,
      type: detail.types.map((type) => type.type.name),
      stats: {
        hp: detail.stats[0]?.base_stat || 0,
        attack: detail.stats[1]?.base_stat || 0,
        defense: detail.stats[2]?.base_stat || 0,
        special_attack: detail.stats[3]?.base_stat || 0,
        special_defense: detail.stats[4]?.base_stat || 0,
        speed: detail.stats[5]?.base_stat || 0,
      },
      height: detail.height,
      weight: detail.weight,
    };
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- pokemon-data-manager`
Expected: PASS, 4 tests.

- [ ] **Step 5: Rewire `PokemonWiki.js` to use `PokemonDataManager` directly**

Replace lines 6, 8-18, 50-53, 112-138 of `src/PokemonWiki.js` (the `DataManager` import, the `events`/`EVENTS_LISTENERS` constants, the constructor call, and both `_getResults`/`_getPokemonList` methods) with:

```js
import { PokemonDataManager } from "./services/data-managers/pokemon-data-manager.js";

const POKE_API_BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const events = [
  "number-click",
  "next-click",
  "back-click",
  "end-click",
  "first-click",
];

export class PokemonWiki extends LitElement {
  // ...properties getter stays exactly as-is...

  constructor() {
    super();
    this.dataManager = new PokemonDataManager();
    this.error = null;
    this._init(0, 5, 60, 1);
  }

  async _init(pages, visiblePages, visibleResults, currentPage) {
    try {
      this.pages = pages;
      this.elements = await this.dataManager.getResultsCount(POKE_API_BASE_URL);
      this.visiblePages = visiblePages;
      this.visibleResults = visibleResults;
      this.currentPage = currentPage;
      await this._getPokemonList({
        page: this.currentPage,
        results_page: this.visibleResults,
        total: this.elements,
      });
    } catch (error) {
      this.error = error.message;
    }
  }

  async _getPokemonList(dataPage) {
    if (!dataPage) return;

    try {
      const pokemonList = await this.dataManager.getPokemonPage({
        baseUrl: POKE_API_BASE_URL,
        page: dataPage.page,
        resultsPerPage: dataPage.results_page,
      });
      this.pokemonList = pokemonList;
      this.error = null;
      const list = this.renderRoot.getElementById("list");
      list.pokemons = pokemonList;
    } catch (error) {
      this.error = error.message;
    }
  }
```

Also add `error: { type: String, attribute: false }` to the `properties`
getter, and update `render()` to show `this.error` when set, e.g. right
above the `<listar-pokemon>` element:

```js
${this.error ? html`<p class="error">${this.error}</p>` : ""}
```

- [ ] **Step 6: Delete the old event-based DataManager**

```bash
rm src/components/API/data-manager.js
```

- [ ] **Step 7: Manually verify the app end-to-end**

Run: `npm run dev`, open the app in a browser.
Expected: the Pokémon list loads and paginates exactly as before. To
verify the error path, temporarily change `POKE_API_BASE_URL` to an
invalid URL, reload, confirm the error message renders instead of a blank
screen or console-only error, then revert the change.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: replace event-based DataManager with async PokemonDataManager and surface errors in the UI"
```

---

## Task 6: Restructure folders and rename entry files

**Files:**
- Create: `src/main.js` (new entry point, replaces `src/pokemon-wiki.js`)
- Create: `src/app/pokemon-wiki.js` (replaces `src/PokemonWiki.js`)
- Move: `src/components/view/banner-title.js` → `src/components/banner-title/banner-title.js`
- Move: `src/components/view/navbar-buttons.js` → `src/components/navbar-buttons/navbar-buttons.js`
- Move: `src/components/view/listar-pokemon.js` → `src/components/pokemon-list/pokemon-list.js`
- Modify: `index.html:26`
- Delete: `src/pokemon-wiki.js`, `src/PokemonWiki.js`, `src/components/view/` (once empty — `card-poke.js`/`paginador-poke.js` move in Tasks 7-8), `src/components/API/` (already empty after Task 5)

**Interfaces:**
- Produces: `index.html` now boots via `src/main.js`. Later tasks (7, 8) move `card-poke.js`/`paginador-poke.js` into `src/components/pokemon-card/` and `src/components/pagination/` respectively — this task does not touch those two files.

- [ ] **Step 1: Create the new component folders and move the three simple components**

```bash
mkdir -p src/app src/components/banner-title src/components/navbar-buttons src/components/pokemon-list
git mv src/components/view/banner-title.js src/components/banner-title/banner-title.js
git mv src/components/view/navbar-buttons.js src/components/navbar-buttons/navbar-buttons.js
git mv src/components/view/listar-pokemon.js src/components/pokemon-list/pokemon-list.js
```

- [ ] **Step 2: Fix `pokemon-list.js`'s imports and its manual-instantiation anti-pattern**

`pokemon-list.js` currently imports `card-poke` from `../view/card-poke` and
manually instantiates `new CardPoke()` + calls `.render()` on it inside
`dateTemplate` (dead call — Lit re-renders via its own lifecycle once the
element is in the DOM; the explicit `.render()` call does nothing useful
and obscures what's happening). Since this file is already being edited
for the move, replace the whole `dateTemplate` getter and the `CardPoke`
import with declarative Lit templating instead — this is required anyway
because Task 8 renames `CardPoke`/`card-poke` to `PokemonCard`/`pokemon-card`, so this reference must change regardless:

```js
import { LitElement, html, css } from "lit";
import "../pokemon-card/pokemon-card.js";

export class ListarPokemon extends LitElement {
  static get properties() {
    return {
      pokemons: {
        type: Array,
        hasChanged(newP, oldP) {
          return newP !== oldP;
        },
      },
      visibleContent: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.visibleContent = false;
    this.pokemons = [];
  }

  static get styles() {
    return css`
      /* ...unchanged, copy verbatim from the current file's styles getter... */
    `;
  }

  render() {
    return html`
      ${this.pokemons?.map(
        (pokemon) => html`<pokemon-card .pokemon=${pokemon}></pokemon-card>`,
      )}
    `;
  }
}
customElements.define("listar-pokemon", ListarPokemon);
```

Copy the existing `styles` getter body verbatim (lines 42-93 of the
original file) into the new file's `styles` getter — only the
`card-poke` selector at line 82 needs renaming to `pokemon-card` to match
Task 8's new tag name.

- [ ] **Step 3: Create `src/app/pokemon-wiki.js` from the current `PokemonWiki.js`**

```bash
git mv src/PokemonWiki.js src/app/pokemon-wiki.js
```

Update its imports (paths only — the class body already has the Task 5
rewrite applied):

```js
import { LitElement, html, css } from "lit";
import "../components/banner-title/banner-title.js";
import "../components/pokemon-list/pokemon-list.js";
import "../components/pagination/pagination.js";
import "../components/navbar-buttons/navbar-buttons.js";
import { PokemonDataManager } from "../services/data-managers/pokemon-data-manager.js";
```

(The `pagination` import path anticipates Task 7's rename; since this
plan executes tasks in order, Task 7 lands before this file is ever run
against a real browser again.)

Also update the `paginador-poke` tag references inside its `render()`
template and its `styles` getter (currently `paginador-poke { ... }`) to
`pagination` — matching Task 7's new tag name.

- [ ] **Step 4: Create the new entry point `src/main.js`**

```js
// src/main.js
import { PokemonWiki } from './app/pokemon-wiki.js';

customElements.define('pokemon-wiki', PokemonWiki);
```

```bash
rm src/pokemon-wiki.js
```

- [ ] **Step 5: Update `index.html`**

Change line 26 from:

```html
<script type="module" src="./src/pokemon-wiki.js"></script>
```

to:

```html
<script type="module" src="./src/main.js"></script>
```

- [ ] **Step 6: Remove now-empty legacy folders**

```bash
rmdir src/components/API 2>/dev/null || true
```

(`src/components/view/` still holds `card-poke.js` and `paginador-poke.js`
until Tasks 7-8 move them — do not remove it yet.)

- [ ] **Step 7: Verify the app still runs**

Run: `npm run dev`, open the app.
Expected: identical behavior to before this task — list loads, pagination
buttons present (still the old monolithic component at this point),
banner and navbar render.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: restructure src into app/components/services layers, rename entry point"
```

---

## Task 7: Decompose pagination into lego components

**Files:**
- Create: `src/components/pagination/pagination.utils.js`
- Create: `src/components/pagination/pagination.utils.test.js`
- Create: `src/components/pagination/pagination-button.js`
- Create: `src/components/pagination/pagination-numbers.js`
- Create: `src/components/pagination/pagination.js` (orchestrator, replaces `paginador-poke.js`)
- Delete: `src/components/view/paginador-poke.js`

**Interfaces:**
- Produces: `calcPages({ results, pages, visibleResults, visiblePages, currentPage })` returning `{ pages, visibleResults, visiblePages, currentPage }`; `getNumberList({ currentPage, visiblePages })` returning `{ numbers: number[], limit: number }`. The `pagination.js` orchestrator (this task) and nothing outside it consumes these two functions. `pagination-button` takes properties `icon` (String), `rotate` (Boolean), `disabled` (Boolean) and fires a bubbling `button-click` event with no payload — the orchestrator attaches the specific handler. `pagination-numbers` takes properties `numbers` (Array<Number>), `currentPage` (Number), `limit` (Number) and fires `number-click` with `detail: { page }`.

- [ ] **Step 1: Write the failing tests for the pure pagination math**

```js
// src/components/pagination/pagination.utils.test.js
import { describe, it, expect } from 'vitest';
import { calcPages, getNumberList } from './pagination.utils.js';

describe('calcPages', () => {
  it('derives pages from results and visibleResults when pages is not set', () => {
    const result = calcPages({ results: 60, pages: 0, visibleResults: 5, visiblePages: 5, currentPage: 1 });
    expect(result.pages).toBe(12);
  });

  it('rounds up when results does not divide evenly by visibleResults', () => {
    const result = calcPages({ results: 62, pages: 0, visibleResults: 5, visiblePages: 5, currentPage: 1 });
    expect(result.pages).toBe(13);
  });

  it('derives visibleResults from results and pages when visibleResults is not set', () => {
    const result = calcPages({ results: 60, pages: 12, visibleResults: 0, visiblePages: 5, currentPage: 1 });
    expect(result.visibleResults).toBe(5);
  });

  it('clamps visiblePages down to pages when pages is smaller', () => {
    const result = calcPages({ results: 12, pages: 3, visibleResults: 4, visiblePages: 5, currentPage: 1 });
    expect(result.visiblePages).toBe(3);
  });

  it('clamps currentPage down to pages when currentPage overshoots', () => {
    const result = calcPages({ results: 60, pages: 12, visibleResults: 5, visiblePages: 5, currentPage: 99 });
    expect(result.currentPage).toBe(12);
  });
});

describe('getNumberList', () => {
  it('returns 1..visiblePages when currentPage is within the first window', () => {
    const result = getNumberList({ currentPage: 2, visiblePages: 5 });
    expect(result.numbers).toEqual([1, 2, 3, 4, 5]);
    expect(result.limit).toBe(5);
  });

  it('slides the window forward once currentPage exceeds visiblePages', () => {
    const result = getNumberList({ currentPage: 7, visiblePages: 5 });
    expect(result.numbers).toEqual([3, 4, 5, 6, 7]);
    expect(result.limit).toBe(7);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- pagination.utils`
Expected: FAIL with "Cannot find module './pagination.utils.js'".

- [ ] **Step 3: Write the implementation**

```js
// src/components/pagination/pagination.utils.js
export function calcPages({ results, pages, visibleResults, visiblePages, currentPage }) {
  let nextPages = pages;
  let nextVisibleResults = visibleResults;
  let nextVisiblePages = visiblePages;
  let nextCurrentPage = currentPage;

  if (!nextPages && nextVisibleResults) {
    nextPages = Math.floor(results / nextVisibleResults);
    nextPages = results % nextVisibleResults > 0 ? nextPages + 1 : nextPages;
  }

  if (!nextVisibleResults && nextPages) {
    nextVisibleResults = Math.floor(results / nextPages);
    nextVisibleResults = results % nextPages > 0 ? nextVisibleResults + 1 : nextVisibleResults;
  }

  if (nextPages !== undefined && nextPages < nextVisiblePages) {
    nextVisiblePages = nextPages;
  }

  if (nextPages !== undefined && nextCurrentPage > nextPages) {
    nextCurrentPage = nextPages;
  }

  return {
    pages: nextPages,
    visibleResults: nextVisibleResults,
    visiblePages: nextVisiblePages,
    currentPage: nextCurrentPage,
  };
}

export function getNumberList({ currentPage, visiblePages }) {
  const limit = currentPage > visiblePages ? currentPage : visiblePages;
  const init = currentPage > visiblePages ? currentPage - (visiblePages - 1) : 1;

  const numbers = [];
  for (let i = init; i <= limit; i += 1) {
    numbers.push(i);
  }

  return { numbers, limit };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- pagination.utils`
Expected: PASS, 7 tests.

- [ ] **Step 5: Create `pagination-button.js`**

```js
// src/components/pagination/pagination-button.js
import { LitElement, html, css } from "lit";

export class PaginationButton extends LitElement {
  static properties = {
    icon: { type: String },
    rotate: { type: Boolean },
    disabled: { type: Boolean },
  };

  static styles = css`
    :host {
      user-select: none;
    }

    .pagination-button {
      background: rgba(255, 255, 255, 0.5);
      border: none;
      padding: 8px 12px;
      margin: 0 2px;
      cursor: pointer;
      border-radius: 20%;
      font-size: 14px;
      display: flex;
      align-items: center;
      transition: 0.1s all ease-in-out;
      position: relative;
    }

    .pagination-button:hover {
      background: rgba(200, 200, 200, 0.8);
      transform: scale(1.1);
      transition: 0.1s all ease-in-out;
    }

    .pagination-button:active {
      background: rgba(255, 255, 255, 0.5);
      transition: 0.1s all ease-in-out;
      transform: scale(0.9);
    }

    .pagination-button.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rotate {
      transform: rotate(180deg);
      transition: none;
    }

    .icon {
      width: 16px;
      height: 16px;
      background-size: cover;
      background-image: var(--icon-url);
    }
  `;

  constructor() {
    super();
    this.icon = "";
    this.rotate = false;
    this.disabled = false;
  }

  _onClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("button-click", { bubbles: true }));
  }

  render() {
    return html`
      <button
        class="pagination-button ${this.disabled ? "disabled" : ""}"
        @click=${this._onClick}
        ?disabled=${this.disabled}
        style="--icon-url: url(assets/${this.icon}.svg)"
      >
        <i class="icon ${this.rotate ? "rotate" : ""}"></i>
      </button>
    `;
  }
}
customElements.define("pagination-button", PaginationButton);
```

- [ ] **Step 6: Create `pagination-numbers.js`**

```js
// src/components/pagination/pagination-numbers.js
import { LitElement, html, css } from "lit";

export class PaginationNumbers extends LitElement {
  static properties = {
    numbers: { type: Array },
    currentPage: { type: Number, attribute: "current-page" },
    limit: { type: Number },
  };

  static styles = css`
    :host {
      user-select: none;
    }

    .vertical {
      border-left: 1px solid #fff;
      opacity: 0.5;
      height: 1.5rem;
      margin-left: 4px;
      margin-right: 4px;
    }

    .pagination-numbers {
      display: flex;
      align-items: center;
      margin: 0 5rem;
    }

    .pagination-numbers .number {
      margin: 0 10px;
      padding: 8px;
      border-radius: 20%;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.5);
    }

    .pagination-numbers .number:hover {
      background: rgba(200, 200, 200, 0.8);
      transform: scale(1.1);
      transition: 0.1s all ease-in-out;
    }

    .pagination-numbers .active {
      font-weight: bold;
      margin: 0 2px;
      padding: 8px;
      border-radius: 20%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
  `;

  constructor() {
    super();
    this.numbers = [];
    this.currentPage = 0;
    this.limit = 0;
  }

  _onClickNumber(num) {
    this.dispatchEvent(
      new CustomEvent("number-click", { bubbles: true, detail: { page: num } }),
    );
  }

  render() {
    return html`
      <div class="pagination-numbers">
        ${this.numbers.map((num) => {
          if (num === this.currentPage && num === this.limit) {
            return html`<span class="active">${num}</span>`;
          }
          if (num === this.limit) {
            return html`<span class="number" @click=${() => this._onClickNumber(num)}>${num}</span>`;
          }
          if (num === this.currentPage) {
            return html`
              <span class="active">${num}</span>
              <hr class="vertical" />
            `;
          }
          return html`
            <span class="number" @click=${() => this._onClickNumber(num)}>${num}</span>
            <hr class="vertical" />
          `;
        })}
      </div>
    `;
  }
}
customElements.define("pagination-numbers", PaginationNumbers);
```

- [ ] **Step 7: Create the `pagination.js` orchestrator**

```js
// src/components/pagination/pagination.js
import { LitElement, html, css } from "lit";
import "./pagination-button.js";
import "./pagination-numbers.js";
import { calcPages, getNumberList } from "./pagination.utils.js";

const EVENTS_CLICK = {
  FIRST: "first-click",
  END: "end-click",
  BACK: "back-click",
  NEXT: "next-click",
  NUMBER: "number-click",
};

export class Pagination extends LitElement {
  static styles = css`
    :host {
      user-select: none;
    }
    .pagination-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .pagination-buttons {
      display: flex;
      align-items: center;
    }
  `;

  static get properties() {
    return {
      currentPage: { type: Number, attribute: "current-page" },
      pages: { type: Number },
      results: { type: Number, attribute: "results" },
      visiblePages: { type: Number, attribute: "visible-pages" },
      visibleResults: { type: Number, attribute: "visible-results" },
    };
  }

  constructor() {
    super();
    this.results = 0;
    this.currentPage = 0;
    this.pages = 0;
    this.visiblePages = 0;
    this.visibleResults = 0;
  }

  updated(props) {
    super.updated(props);
    if (
      props.has("results") ||
      props.has("pages") ||
      props.has("visibleResults") ||
      props.has("visiblePages")
    ) {
      const next = calcPages({
        results: this.results,
        pages: this.pages,
        visibleResults: this.visibleResults,
        visiblePages: this.visiblePages,
        currentPage: this.currentPage,
      });
      this.pages = next.pages;
      this.visibleResults = next.visibleResults;
      this.visiblePages = next.visiblePages;
      this.currentPage = next.currentPage;
    }
  }

  get _firstDisabled() {
    return this.currentPage === 1;
  }

  get _endDisabled() {
    return this.pages === this.currentPage;
  }

  _dispatchNav(type, page) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        detail: { page, results_page: this.visibleResults, total: this.results },
      }),
    );
  }

  _onFirst() {
    if (this._firstDisabled) return;
    this.currentPage = 1;
    this._dispatchNav(EVENTS_CLICK.FIRST, this.currentPage);
  }

  _onEnd() {
    if (this._endDisabled) return;
    this.currentPage = this.pages;
    this._dispatchNav(EVENTS_CLICK.END, this.currentPage);
  }

  _onBack() {
    this._dispatchNav(EVENTS_CLICK.BACK, this.currentPage - 1);
    this.currentPage -= 1;
  }

  _onNext() {
    this._dispatchNav(EVENTS_CLICK.NEXT, this.currentPage + 1);
    this.currentPage += 1;
  }

  _onNumberClick(e) {
    const { page } = e.detail;
    this._dispatchNav(EVENTS_CLICK.NUMBER, page);
    this.currentPage = page;
  }

  render() {
    const { numbers, limit } = getNumberList({
      currentPage: this.currentPage,
      visiblePages: this.visiblePages,
    });

    return html`
      <div class="pagination-container">
        <div class="pagination-buttons">
          <pagination-button
            icon="first"
            .disabled=${this._firstDisabled}
            @button-click=${this._onFirst}
          ></pagination-button>
          <pagination-button
            icon="next"
            rotate
            .disabled=${this._firstDisabled}
            @button-click=${this._onBack}
          ></pagination-button>
          <pagination-numbers
            .numbers=${numbers}
            .currentPage=${this.currentPage}
            .limit=${limit}
            @number-click=${this._onNumberClick}
          ></pagination-numbers>
          <pagination-button
            icon="next"
            .disabled=${this._endDisabled}
            @button-click=${this._onNext}
          ></pagination-button>
          <pagination-button
            icon="first"
            rotate
            .disabled=${this._endDisabled}
            @button-click=${this._onEnd}
          ></pagination-button>
        </div>
      </div>
    `;
  }
}
customElements.define("pagination", Pagination);
```

Note: this preserves the original `icon-end`/`icon-back` SVG mismatch
exactly (per the Global Constraints) — `first` and `next` are the two
underlying icons the original CSS mapped to all four buttons
(`icon-first`→`first.svg`, `icon-end`→`first.svg`, `icon-next`→`next.svg`,
`icon-back`→`next.svg`), so the `icon` prop values above intentionally
mirror that: End button uses `icon="first"` and Back button uses
`icon="next"`, matching current (buggy) visual behavior byte-for-byte.

- [ ] **Step 8: Delete the old monolithic paginator**

```bash
rm src/components/view/paginador-poke.js
```

- [ ] **Step 9: Manually verify pagination still works end-to-end**

Run: `npm run dev`, open the app.
Expected: first/back/next/end buttons and page numbers behave identically
to before — same disabled states at the boundaries, same page navigation,
same (buggy) icons on end/back buttons.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: decompose paginador-poke into pagination orchestrator + pagination-button + pagination-numbers"
```

---

## Task 8: Decompose pokemon-card into lego components

**Files:**
- Create: `src/components/pokemon-card/pokemon-type-badge.js`
- Create: `src/components/pokemon-card/pokemon-stat-item.js`
- Create: `src/components/pokemon-card/pokemon-flip-buttons.js`
- Create: `src/components/pokemon-card/pokemon-stats-chart.js`
- Create: `src/components/pokemon-card/pokemon-card.styles.js`
- Create: `src/components/pokemon-card/pokemon-card.js` (orchestrator, replaces `card-poke.js`)
- Delete: `src/components/view/card-poke.js`, `src/components/view/` (now empty — remove the folder)

**Interfaces:**
- Produces: `pokemon-type-badge` (property `type` String, also exports `TYPES_COLORS` and `getTypeColors(type)` as named exports for reuse), `pokemon-stat-item` (properties `icon` String, `label` String, `value` String), `pokemon-flip-buttons` (fires bubbling `pokedex-click` and `flip-click`, no payload), `pokemon-stats-chart` (property `pokemon` Object, property `visible` Boolean — draws/destroys the Chart.js instance when `visible` toggles true). `pokemon-card.js` (this task) is the only consumer of all four.

- [ ] **Step 1: Create `pokemon-type-badge.js`**

```js
// src/components/pokemon-card/pokemon-type-badge.js
import { LitElement, html, css } from "lit";

export const TYPES_COLORS = {
  normal: ["#f48b1fff", "#f3b81aff"],
  fire: ["#f37021ff", "#f3b81aff"],
  water: ["#0b87b3ff", "#20afdfff"],
  electric: ["#f3961fff", "#f3b81aff"],
  grass: ["#459f46ff", "#57b947ff"],
  ice: ["#20afdfff", "#66cef6ff"],
  fighting: ["#8e191bff", "#b81f25ff"],
  poison: ["#8e191bff", "#b81f25ff"],
  ground: ["#5b3513ff", "#77421aff"],
  flying: ["#0b87b3ff", "#20afdfff"],
  psychic: ["#b11f83ff", "#c03995ff"],
  bug: ["#459f46ff", "#57b947ff"],
  rock: ["#917f6cff", "#a69f96ff"],
  ghost: ["#15110cff", "#403b35ff"],
  dragon: ["#459f46ff", "#57b947ff"],
  dark: ["#360928ff", "#712158ff"],
  steel: ["#352514ff", "#523e28ff"],
  fairy: ["#f7ac36ff", "#f3b81aff"],
  unknown: ["#15110cff", "#403b35ff"],
};

export function getTypeColors(type) {
  return TYPES_COLORS[type] || TYPES_COLORS.unknown;
}

export class PokemonTypeBadge extends LitElement {
  static properties = {
    type: { type: String },
  };

  static styles = css`
    .type {
      display: inline-block;
      width: 5rem;
      position: relative;
      height: 1.3rem;
      border-radius: 100px;
      border-top-left-radius: 0;
      text-transform: capitalize;
      align-items: center;
      padding-top: 0.2rem;
      color: #fff;
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
      font-weight: 400;
      font-size: 0.8rem;
      text-align: center;
    }
  `;

  constructor() {
    super();
    this.type = "";
  }

  get #name() {
    return Object.keys(TYPES_COLORS).includes(this.type) ? this.type : "pokemmo";
  }

  render() {
    const [c0, c1] = getTypeColors(this.type);
    return html`
      <span
        class="type"
        style="background: radial-gradient(circle, ${c1} 0%, ${c0} 100%);"
      >
        ${this.#name}
      </span>
    `;
  }
}
customElements.define("pokemon-type-badge", PokemonTypeBadge);
```

- [ ] **Step 2: Create `pokemon-stat-item.js`**

```js
// src/components/pokemon-card/pokemon-stat-item.js
import { LitElement, html, css } from "lit";

export class PokemonStatItem extends LitElement {
  static properties = {
    icon: { type: String },
    label: { type: String },
    value: { type: String },
  };

  static styles = css`
    .character {
      width: 50%;
    }
    .character .title {
      display: block;
      width: 100%;
      font-size: 1rem;
      text-align: left;
      color: #f2f2f2;
    }
    .character-info {
      width: 80%;
      height: 2rem;
      border-radius: 100px;
      border: 1px solid #f2f2f2;
      margin: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .character-text {
      color: #f2f2f2;
      font-size: 0.9rem;
      font-weight: lighter;
    }
    img {
      width: 1rem;
      height: 1rem;
    }
  `;

  render() {
    return html`
      <div class="character">
        <span class="title">
          <img src="assets/${this.icon}.svg" alt="${this.label}" />
          ${this.label}
        </span>
        <div class="character-info">
          <span class="character-text">${this.value}</span>
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-stat-item", PokemonStatItem);
```

- [ ] **Step 3: Create `pokemon-flip-buttons.js`**

```js
// src/components/pokemon-card/pokemon-flip-buttons.js
import { LitElement, html, css } from "lit";

export class PokemonFlipButtons extends LitElement {
  static styles = css`
    .buttons-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
    }
    .button {
      height: 100%;
      width: 10%;
    }
    .button img {
      width: 100%;
      height: 100%;
    }
  `;

  render() {
    return html`
      <div class="buttons-container">
        <div
          class="button button-pokedex"
          @click=${() => this.dispatchEvent(new CustomEvent("pokedex-click", { bubbles: true }))}
        >
          <img src="assets/pokegenie.svg" alt="pokedex" />
        </div>
        <div
          class="button button-flip"
          @click=${() => this.dispatchEvent(new CustomEvent("flip-click", { bubbles: true }))}
        >
          <img src="assets/phone-flip.svg" alt="flip" />
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-flip-buttons", PokemonFlipButtons);
```

- [ ] **Step 4: Create `pokemon-stats-chart.js`**

```js
// src/components/pokemon-card/pokemon-stats-chart.js
import { LitElement, html, css } from "lit";
import Chart from "chart.js/auto";

export class PokemonStatsChart extends LitElement {
  static properties = {
    pokemon: { type: Object },
    visible: { type: Boolean },
  };

  static styles = css`
    canvas {
      margin-top: 5%;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.pokemon = {};
    this.visible = false;
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has("visible") && this.visible) {
      this.#draw();
    }
  }

  #draw() {
    if (!this.pokemon?.stats) return;
    const canvas = this.renderRoot.getElementById(`${this.pokemon.id}-chart`);
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(canvas.getContext("2d"), {
      type: "polarArea",
      data: {
        labels: ["HP", "Attack", "Defense", "S. Attack", "S. Defense", "Speed"],
        datasets: [
          {
            borderColor: "#000",
            data: [
              this.pokemon.stats.hp,
              this.pokemon.stats.attack,
              this.pokemon.stats.defense,
              this.pokemon.stats.special_attack,
              this.pokemon.stats.special_defense,
              this.pokemon.stats.speed,
            ],
            backgroundColor: [
              "rgb(255, 99, 132,0.5)",
              "rgb(54, 162, 235,0.5)",
              "rgb(255, 205, 86, 0.5)",
              "rgb(25, 205, 86, 0.5)",
              "rgb(153, 102, 255, 0.5)",
              "rgb(255, 159, 64, 0.5)",
            ],
            borderColor: [
              "rgb(255, 99, 132,1)",
              "rgb(54, 162, 235,1)",
              "rgb(255, 205, 86, 1)",
              "rgb(25, 205, 86, 1)",
              "rgb(153, 102, 255, 1)",
              "rgb(255, 159, 64, 1)",
            ],
            hoverOffset: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: true, labels: { color: "rgb(255, 255, 255, 0.5)" } },
        },
        scales: { r: { suggestedMax: 100, display: false } },
      },
    });
  }

  render() {
    return html`<canvas id="${this.pokemon.id}-chart"></canvas>`;
  }
}
customElements.define("pokemon-stats-chart", PokemonStatsChart);
```

- [ ] **Step 5: Create `pokemon-card.styles.js`**

Move the entire `static get styles()` template literal body from the
current `src/components/view/card-poke.js` (lines 178-586) into a new
file, exported as three named `css` template results — split at the
`/* ====== / Back card styles / ====== */` comment (line 487) already
present in the source:

```js
// src/components/pokemon-card/pokemon-card.styles.js
import { css } from "lit";

// Copy card-poke.js lines 179-486 verbatim here (the .scaff/.containerCard
// front-face rules through .containerCard .character-container img),
// EXCEPT: drop the .containerCard .card .type / .containerCard:hover .type
// rules (now inside pokemon-type-badge.js) and drop the
// .containerCard .character-container .character* rules (now inside
// pokemon-stat-item.js). Keep .containerCard .character-container itself
// (the flex row wrapper) and .containerCard .card .buttons-container (the
// wrapper pokemon-flip-buttons is placed into).
export const frontStyles = css`
  /* ... */
`;

// Copy card-poke.js lines 489-567 verbatim here (.containerCardBack
// through .containerCardBack .card .buttons-container .button img).
export const backStyles = css`
  /* ... */
`;

export const sharedStyles = css`
  :host {
    user-select: none;
    height: 100%;
    margin: 0 1rem;
  }

  .scaff {
    display: inline-block;
    position: relative;
    min-width: 16rem;
    min-height: 22rem;
    overflow: inherit;
    background: transparent;
    border-radius: 1em;
    cursor: url(assets/poke1.png), auto;
    transition: 0.3 all;
  }

  .scaff.flipped > .containerCard {
    transform: rotateY(-180deg);
  }

  .scaff.flipped > .containerCardBack {
    transform: rotateY(0deg);
  }

  @keyframes brightness {
    100% {
      transform: rotate(-45deg) translate(0, 450px);
    }
  }
`;
```

- [ ] **Step 6: Create the `pokemon-card.js` orchestrator**

```js
// src/components/pokemon-card/pokemon-card.js
import { LitElement, html, css } from "lit";
import "./pokemon-type-badge.js";
import "./pokemon-stat-item.js";
import "./pokemon-flip-buttons.js";
import "./pokemon-stats-chart.js";
import { frontStyles, backStyles, sharedStyles } from "./pokemon-card.styles.js";
import { getTypeColors } from "./pokemon-type-badge.js";

export class PokemonCard extends LitElement {
  static properties = {
    pokemon: { type: Object, attribute: "pokemon" },
    flipped: { type: Boolean },
  };

  static styles = [sharedStyles, frontStyles, backStyles];

  constructor() {
    super();
    this.flipped = false;
    this.pokemon = {};
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }

  _renderPokedex() {
    window.dispatchEvent(new CustomEvent("render-pokedex", { detail: this.pokemon }));
  }

  render() {
    const { pokemon, flipped } = this;
    const firstType = pokemon?.type?.[0] || "unknown";
    const [c0, c1] = getTypeColors(firstType);

    return html`
      <style>
        :host {
          --gradient-background: linear-gradient(90deg, ${c0} 0%, ${c1} 100%);
        }
      </style>

      <div class="scaff ${flipped ? "flipped" : ""}" id=${pokemon.id || 0}>
        <div class="containerCard">
          <div class="card">
            <pokemon-flip-buttons
              @pokedex-click=${this._renderPokedex}
              @flip-click=${this.toggleFlip}
            ></pokemon-flip-buttons>
            <div class="image-container">
              <div class="back-container">
                <img class="img-back" src="assets/${firstType}.svg" alt="" />
              </div>
              <img src="${pokemon.img ? pokemon.img : "assets/R.png"}" alt="${pokemon.name}" />
            </div>
            <div class="info-container">
              <h2>${pokemon.name.toUpperCase()}</h2>
              <div class="id-exp-container">
                <span class="poke-id">N° ${pokemon.id}</span>
                <span class="poke-exp">${pokemon.exp} Exp</span>
              </div>
              <div class="type-container">
                ${(pokemon.type || []).map(
                  (t) => html`<pokemon-type-badge type=${t}></pokemon-type-badge>`,
                )}
              </div>
              <div class="character-container">
                <pokemon-stat-item
                  icon="weight-outline"
                  label="Weight"
                  value="${Math.ceil(pokemon.weight * 0.1 * 10) / 10} Kg"
                ></pokemon-stat-item>
                <pokemon-stat-item
                  icon="tapemeasure"
                  label="Height"
                  value="${Math.ceil(pokemon.height * 0.1 * 10) / 10} Mts"
                ></pokemon-stat-item>
              </div>
            </div>
          </div>
        </div>

        <div class="containerCardBack">
          <div class="card">
            <pokemon-flip-buttons
              @pokedex-click=${this._renderPokedex}
              @flip-click=${this.toggleFlip}
            ></pokemon-flip-buttons>
            <h5>Pokemon Stats</h5>
            <h6>${pokemon.name.toUpperCase()}</h6>
            <pokemon-stats-chart .pokemon=${pokemon} .visible=${flipped}></pokemon-stats-chart>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("pokemon-card", PokemonCard);
```

- [ ] **Step 7: Delete the old monolithic card and its parent folder**

```bash
rm src/components/view/card-poke.js
rmdir src/components/view
```

- [ ] **Step 8: Manually verify the card end-to-end**

Run: `npm run dev`, open the app.
Expected: cards render with correct type badges and colors, weight/height
stat items show correct values, clicking flip shows the back with the
stats chart rendered (verify the polar chart actually draws — this is the
one behavior most likely to regress since chart creation now happens
inside a child component reacting to a property change instead of an
imperative call), clicking the pokedex icon dispatches `render-pokedex` on
`window` (check via browser devtools console:
`window.addEventListener('render-pokedex', console.log)` before clicking).

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "refactor: decompose card-poke into pokemon-card orchestrator + type-badge + stat-item + flip-buttons + stats-chart"
```

---

## Task 9: Set up Storybook

**Files:**
- Create: `.storybook/main.js`
- Create: `.storybook/preview.js`
- Modify: `package.json` (scripts + dependencies)

**Interfaces:**
- Produces: `npm run storybook` (dev), `npm run storybook:build` — Task 10's `.stories.js` files are discovered by the glob configured here.

- [ ] **Step 1: Install Storybook for Web Components + Vite**

```bash
npx storybook@latest init --type web_components --builder vite --yes
```

(This scaffolds `.storybook/main.js`, `.storybook/preview.js`, and adds the
required `@storybook/*` devDependencies and scripts automatically. If the
CLI's generated scripts differ from below, reconcile by hand in Step 3.)

- [ ] **Step 2: Point Storybook's story glob at colocated `.stories.js` files**

Edit `.storybook/main.js`'s `stories` array to:

```js
stories: ['../src/**/*.stories.js'],
```

- [ ] **Step 3: Confirm/normalize `package.json` scripts**

Ensure these two exist (the CLI may have already added them with matching
names — if so, leave as-is):

```json
"storybook": "storybook dev -p 6006",
"storybook:build": "storybook build"
```

- [ ] **Step 4: Verify Storybook starts with zero stories**

Run: `npm run storybook`
Expected: Storybook UI opens at `localhost:6006` with no stories listed
(none exist yet — added in Task 10). No errors in the terminal or browser
console.

Stop Storybook after confirming.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: set up Storybook with the Vite builder for web components"
```

---

## Task 10: Write Storybook stories for every lego component

**Files:**
- Create: `src/components/pokemon-card/pokemon-type-badge.stories.js`
- Create: `src/components/pokemon-card/pokemon-stat-item.stories.js`
- Create: `src/components/pokemon-card/pokemon-flip-buttons.stories.js`
- Create: `src/components/pokemon-card/pokemon-stats-chart.stories.js`
- Create: `src/components/pokemon-card/pokemon-card.stories.js`
- Create: `src/components/pagination/pagination-button.stories.js`
- Create: `src/components/pagination/pagination-numbers.stories.js`
- Create: `src/components/pagination/pagination.stories.js`
- Create: `src/components/banner-title/banner-title.stories.js`
- Create: `src/components/navbar-buttons/navbar-buttons.stories.js`
- Create: `src/components/pokemon-list/pokemon-list.stories.js`

**Interfaces:**
- None — stories are leaf consumers of components already built in Tasks 6-8.

- [ ] **Step 1: `pokemon-type-badge.stories.js`**

```js
import { html } from "lit";
import "./pokemon-type-badge.js";

export default {
  title: "Pokemon Card/Type Badge",
  component: "pokemon-type-badge",
  argTypes: {
    type: {
      control: "select",
      options: [
        "normal", "fire", "water", "electric", "grass", "ice", "fighting",
        "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
        "dragon", "dark", "steel", "fairy", "unknown",
      ],
    },
  },
};

export const Default = {
  args: { type: "fire" },
  render: ({ type }) => html`<pokemon-type-badge .type=${type}></pokemon-type-badge>`,
};
```

- [ ] **Step 2: `pokemon-stat-item.stories.js`**

```js
import { html } from "lit";
import "./pokemon-stat-item.js";

export default {
  title: "Pokemon Card/Stat Item",
  component: "pokemon-stat-item",
  argTypes: {
    icon: { control: "text" },
    label: { control: "text" },
    value: { control: "text" },
  },
};

export const Weight = {
  args: { icon: "weight-outline", label: "Weight", value: "6.9 Kg" },
  render: ({ icon, label, value }) =>
    html`<pokemon-stat-item icon=${icon} label=${label} value=${value}></pokemon-stat-item>`,
};

export const Height = {
  args: { icon: "tapemeasure", label: "Height", value: "0.7 Mts" },
  render: Weight.render,
};
```

- [ ] **Step 3: `pokemon-flip-buttons.stories.js`**

```js
import { html } from "lit";
import "./pokemon-flip-buttons.js";

export default {
  title: "Pokemon Card/Flip Buttons",
  component: "pokemon-flip-buttons",
};

export const Default = {
  render: () => html`
    <pokemon-flip-buttons
      @pokedex-click=${() => console.log("pokedex-click")}
      @flip-click=${() => console.log("flip-click")}
    ></pokemon-flip-buttons>
  `,
};
```

- [ ] **Step 4: `pokemon-stats-chart.stories.js`**

```js
import { html } from "lit";
import "./pokemon-stats-chart.js";

const SAMPLE_POKEMON = {
  id: 1,
  name: "bulbasaur",
  stats: { hp: 45, attack: 49, defense: 49, special_attack: 65, special_defense: 65, speed: 45 },
};

export default {
  title: "Pokemon Card/Stats Chart",
  component: "pokemon-stats-chart",
};

export const Default = {
  render: () => html`
    <div style="width: 300px; height: 300px;">
      <pokemon-stats-chart .pokemon=${SAMPLE_POKEMON} .visible=${true}></pokemon-stats-chart>
    </div>
  `,
};
```

- [ ] **Step 5: `pokemon-card.stories.js`**

```js
import { html } from "lit";
import "./pokemon-card.js";

const SAMPLE_POKEMON = {
  id: 1,
  name: "bulbasaur",
  exp: 64,
  img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  type: ["grass", "poison"],
  stats: { hp: 45, attack: 49, defense: 49, special_attack: 65, special_defense: 65, speed: 45 },
  height: 7,
  weight: 69,
};

export default {
  title: "Pokemon Card/Card (composed)",
  component: "pokemon-card",
};

export const Default = {
  render: () => html`<pokemon-card .pokemon=${SAMPLE_POKEMON}></pokemon-card>`,
};
```

- [ ] **Step 6: `pagination-button.stories.js`**

```js
import { html } from "lit";
import "./pagination-button.js";

export default {
  title: "Pagination/Button",
  component: "pagination-button",
  argTypes: {
    icon: { control: "select", options: ["first", "next"] },
    rotate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export const Default = {
  args: { icon: "next", rotate: false, disabled: false },
  render: ({ icon, rotate, disabled }) => html`
    <pagination-button icon=${icon} ?rotate=${rotate} ?disabled=${disabled}></pagination-button>
  `,
};
```

- [ ] **Step 7: `pagination-numbers.stories.js`**

```js
import { html } from "lit";
import "./pagination-numbers.js";

export default {
  title: "Pagination/Numbers",
  component: "pagination-numbers",
};

export const Default = {
  render: () => html`
    <pagination-numbers
      .numbers=${[1, 2, 3, 4, 5]}
      .currentPage=${3}
      .limit=${5}
    ></pagination-numbers>
  `,
};
```

- [ ] **Step 8: `pagination.stories.js`**

```js
import { html } from "lit";
import "./pagination.js";

export default {
  title: "Pagination/Pagination (composed)",
  component: "pagination",
};

export const Default = {
  render: () => html`
    <pagination
      results="60"
      visible-results="5"
      visible-pages="5"
      current-page="1"
    ></pagination>
  `,
};
```

- [ ] **Step 9: `banner-title.stories.js`**

```js
import { html } from "lit";
import "./banner-title.js";

export default {
  title: "Layout/Banner Title",
  component: "banner-title",
};

export const Default = {
  render: () => html`
    <banner-title
      title="PokeDex with PokéAPI & Lit"
      logo="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
      logo-2="https://lit.dev/images/logo.svg#flame"
    ></banner-title>
  `,
};
```

- [ ] **Step 10: `navbar-buttons.stories.js`**

```js
import { html } from "lit";
import "./navbar-buttons.js";

export default {
  title: "Layout/Navbar Buttons",
  component: "navbar-buttons",
};

export const Default = {
  render: () => html`<navbar-buttons></navbar-buttons>`,
};
```

- [ ] **Step 11: `pokemon-list.stories.js`**

```js
import { html } from "lit";
import "./pokemon-list.js";

const SAMPLE_POKEMONS = [
  {
    id: 1, name: "bulbasaur", exp: 64,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    type: ["grass", "poison"],
    stats: { hp: 45, attack: 49, defense: 49, special_attack: 65, special_defense: 65, speed: 45 },
    height: 7, weight: 69,
  },
  {
    id: 4, name: "charmander", exp: 62,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    type: ["fire"],
    stats: { hp: 39, attack: 52, defense: 43, special_attack: 60, special_defense: 50, speed: 65 },
    height: 6, weight: 85,
  },
];

export default {
  title: "Layout/Pokemon List (composed)",
  component: "listar-pokemon",
};

export const Default = {
  render: () => html`<listar-pokemon .pokemons=${SAMPLE_POKEMONS}></listar-pokemon>`,
};
```

- [ ] **Step 12: Verify all stories render**

Run: `npm run storybook`
Expected: every story above appears in the sidebar under its `title`, each
renders without console errors, and controls (where defined) update the
rendered component live.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "docs: add Storybook stories for every lego component"
```

---

## Task 11: Final verification and cleanup

**Files:**
- Modify: `package.json` (final script/dependency sanity check)
- Modify: `README.md` (only if the `npm start`/dev instructions changed — they haven't: `npm start` still works via Task 1's script)

**Interfaces:**
- None — this task verifies the whole plan's output, no new interfaces.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests from Tasks 4, 5, 7 pass (15 tests total: 4 in
`poke-api.test.js`, 4 in `pokemon-data-manager.test.js`, 7 in
`pagination.utils.test.js`).

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: exits 0, `dist/` contains the built app.

Run: `npm run preview`
Expected: app works identically to `npm run dev` — full manual walkthrough:
list loads, paginate through at least 2 pages, flip a card and confirm the
stats chart renders, click the pokedex icon and confirm `render-pokedex`
still dispatches (devtools console check as in Task 8).

- [ ] **Step 3: Run the Storybook build**

Run: `npm run storybook:build`
Expected: exits 0, produces a `storybook-static/` (or configured output)
directory with no errors.

- [ ] **Step 4: Confirm no dangling references to deleted files**

Run: `grep -rn "lit-element\|card-poke\|paginador-poke\|data-manager\.js\|api-request\.js\|PokemonWiki\.js" src/ index.html package.json`
Expected: no matches (aside from this plan/spec's own historical
descriptions, which live outside `src/`).

- [ ] **Step 5: Add `storybook-static/` and `dist/` to `.gitignore` if not already present**

Check `.gitignore`; add any missing build output directories.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass for Vite/Vitest migration and architecture restructuring"
```
