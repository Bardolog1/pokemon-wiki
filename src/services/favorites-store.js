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
    // localStorage puede fallar (modo privado, cuota excedida); el favorito
    // no persiste entre sesiones pero la app sigue funcionando igual.
  }
}

/**
 * Store singleton de favoritos, persistido en localStorage. Emite "change"
 * cada vez que se agrega/quita un favorito, para que cualquier componente
 * (cards en distintas páginas, la vista de favoritos) se mantenga sincronizado
 * sin necesidad de pasar props por toda la jerarquía.
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
