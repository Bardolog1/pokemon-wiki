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

  // La fila que asoma en el borde inferior mostraría info recortada en :hover; se apaga bajo 90% visible.
  updated(props) {
    super.updated?.(props);
    if (props.has("pokemons") && this.pokemons?.length) {
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
      :host {
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        scrollbar-width: none;
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
