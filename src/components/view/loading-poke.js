import { LitElement, html, css } from "lit";

export class LoadingPoke extends LitElement {

  static get properties() {
    return {
    };
  }

  static get styles() {
    return css`
      .container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }


      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }

      .pokeball {
        width: 100px;
        animation: rotate 1s ease-in-out infinite;
      }



      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        50% {
          transform: rotate(180deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }



    `;
  }


  constructor() {
    super();
  }

  render() {
    return html`
      <div class="container">
      <div class="loading">
        <img src="../../../assets/R.png" alt="pokeball" class="pokeball">
      </div>
      </div>
            `;
  }
}
customElements.define("loading-poke", LoadingPoke);
