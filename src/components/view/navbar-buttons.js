import { LitElement, html, css } from "lit-element";

export class NavbarButtons extends LitElement {
  static get properties() {
    return {};
  }

  static get styles() {
    return css`
      :host {
        user-select: none;
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-end;
        align-items: center;
      }

      .pokedex-button {
        background: rgba(255, 255, 255, 0.6);
        border: none;
        height: 5rem;
        width: 5rem;
        margin: 0 3rem;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        position: relative;
        transition: 0.5s all ease-in-out;
      }

      .pokedex-button:hover {
        background: rgba(200, 200, 200, 0.8);
        transition: 0.5s all ease-in-out;
        cursor: url(assets/hand.png), auto;
      }

      .pokedex-button:hover > .icon {
        transform: scale(1.2);
        transition: 0.5s all ease-in-out;
      }

      .pokedex-button:active > .icon {
        transform: scale(0.8);
        transition: 0.2s all ease-in-out;
      }

      .pokedex-button.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .icon {
        width: 5.5rem;
        height: 5rem;
        background-size: cover;
        transition: 0.5s all ease-in-out;
      }

      .icon.icon-first {
        position: absolute;
        top: 0;
        left: 0;
        background-image: url("assets/NicePng_pokedex-png_2285786.png");
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <button class="pokedex-button" 
      @click="${() => {
        this.dispatchEvent(
          new CustomEvent("pokedex-visible", {
            bubbles: true,
            detail: {
              page: "pokedex",
              
            },
          })
        );
      }}"
      >
        <i class="icon icon-first"></i>
      </button>
    `;
  }
}

customElements.define("navbar-buttons", NavbarButtons);
