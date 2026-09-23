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

  // Si el alto del contenedor no es múltiplo del alto de fila, la fila siguiente asoma en el borde inferior
  // y su :hover mostraría info recortada. Se apaga (hoverEnabled=false) en cards con menos de 90% visible.
  updated(props) {
    super.updated?.(props);
    if (props.has("pokemons") && this.pokemons?.length) {
      // El scroll físico no se reinicia al cambiar de página; se resetea a mano.
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
      /* :host es solo el scroll container; el grid vive en .cards-grid. Así, "margin-top: auto" empuja
         pocas filas hacia abajo y colapsa a 0 si desbordan. "align-content: flex-end" en :host dejaba
         filas fuera del área scrolleable. */
      :host {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        scrollbar-width: none;
        /* "mandatory" asienta el scroll en una fila completa; "scroll-snap-stop: always" evita saltarse filas. */
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
        /* Espacio extra bajo la última fila. Compite con "margin-top: auto" (pocas cards, ej. Favoritos):
           si crece, esa vista baja menos. */
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

      /* El snap "start" de la última fila pide más scroll del posible y el navegador lo recorta,
         dejando dos filas parciales. "end" coincide con el final real del scroll. */
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
