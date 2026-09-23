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
    };
  }

  constructor() {
    super();
    this._hoverObserver = null;
  }

  disconnectedCallback() {
    this._hoverObserver?.disconnect();
    super.disconnectedCallback();
  }

  // Con el alto del contenedor sin ser múltiplo exacto del alto de fila, la
  // fila siguiente siempre asoma unos pocos px en el borde inferior — lo
  // suficiente para que el cursor le dispare el :hover y se vea su info
  // recortada a la mitad. Este observer apaga el :hover (hoverEnabled=false,
  // ver pokemon-card) en cualquier card que no esté casi completamente
  // dentro del área visible (threshold 0.9 = 90% visible).
  updated(props) {
    super.updated?.(props);
    if (props.has("pokemons") && this.pokemons?.length) {
      // Cada página es un array de pokemons nuevo, pero el scroll físico
      // del contenedor no se reinicia solo — sin esto, cambiar de página
      // deja la vista donde quedó la anterior (ej. en la última fila).
      this.scrollTop = 0;
      this._hoverObserver?.disconnect();
      const grid = this.renderRoot.querySelector(".cards-grid");
      this._hoverObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.hoverEnabled = entry.isIntersecting;
          });
        },
        { root: this, threshold: 0.9 },
      );
      grid.querySelectorAll("pokemon-card").forEach((card) => {
        this._hoverObserver.observe(card);
      });
    }
  }

  static get styles() {
    return css`
      /* :host es SOLO el scroll container (una columna). El grid real de
         cards vive en .cards-grid, adentro. Así, "margin-top: auto" en
         .cards-grid empuja las filas contra el borde inferior nada más
         cuando sobra alto (una sola fila corta) — con muchas filas que
         desbordan, ese margen automático colapsa a 0 solo y el scroll
         queda normal, de arriba hacia abajo. "align-content: flex-end"
         directo en :host rompía esto: con overflow, anclaba la ÚLTIMA fila
         abajo y dejaba las anteriores fuera del área scrolleable. */
      :host {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        scrollbar-width: none;
        /* Cada gesto de scroll queda "enganchado" a una fila completa en
           vez de poder quedar a mitad de camino (cards cortadas arriba o
           abajo). "mandatory" obliga a asentar siempre en un punto de
           snap; "scroll-snap-stop: always" en cada card evita que un
           scroll rápido salte de largo varias filas sin detenerse. */
        scroll-snap-type: y mandatory;
      }

      .cards-grid {
        user-select: none;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: baseline;
        margin-top: auto;
        /* Espacio de respiro extra bajo la última fila, además del punto de
           enganche "end" en la última card. OJO: este padding compite por
           el mismo espacio libre que "margin-top: auto" usa para el efecto
           "parado sobre el piso" con pocas cards (ej. Favoritos) — si
           queda muy grande, esa vista deja de bajar tanto como ahora. */
        padding-bottom: 3rem;
      }

      :host::-webkit-scrollbar {
        width: 5px;
      }

      :host::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }

      :host::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }

      pokemon-card {
        max-width: calc(33.33% - 20px);
        box-sizing: border-box;
        margin: 10px;
        scroll-snap-align: start;
        scroll-snap-stop: always;
      }

      /* El punto de enganche "start" de la última fila suele pedir
         scrollear más de lo que el contenedor permite (el alto visible es
         mayor a una fila), así que el navegador lo recorta a mitad de
         camino, dejando la última fila Y la penúltima parcialmente
         visibles (penúltima atenuada por hover-disabled). "end" en la
         última card agrega un punto de enganche que coincide con el final
         real del scroll — siempre alcanzable, por definición. */
      pokemon-card:last-child {
        scroll-snap-align: end;
      }
    `;
  }

  render() {
    return html`
      <div class="cards-grid">
        ${this.pokemons?.map(
          (pokemon) => html`<pokemon-card .pokemon=${pokemon}></pokemon-card>`,
        )}
      </div>
    `;
  }
}
customElements.define("listar-pokemon", ListarPokemon);
