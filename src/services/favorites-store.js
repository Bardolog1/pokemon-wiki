const STORAGE_KEY = "pokemon-wiki:favorites";

function readIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage puede fallar (modo privado, cuota); el favorito no persiste pero la app sigue funcionando.
  }
}

/**
 * Singleton de favoritos persistido en localStorage. Emite "change" para sincronizar
 * cards y vista de favoritos sin pasar props.
 */
class FavoritesStore extends EventTarget {
  #ids;

  constructor() {
    super();
    this.#ids = readIds();
  }

  isFavorite(id) {
    return this.#ids.has(id);
  }

  toggle(id) {
    if (this.#ids.has(id)) {
      this.#ids.delete(id);
    } else {
      this.#ids.add(id);
    }
    writeIds(this.#ids);
    this.dispatchEvent(new CustomEvent("change", { detail: { ids: this.getIds() } }));
  }

  getIds() {
    return [...this.#ids];
  }
}

export const favoritesStore = new FavoritesStore();
