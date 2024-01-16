import { LitElement, html, css } from "lit-element";

export class BannerTitle extends LitElement {
  static properties = {
    titleText: {
      type: String,
      attribute: "title",
    },
    logo: {
      type: String,
      attribute: "logo",
    },
    descriptiontext: {
      type: String,
      attribute: "description",
    },
    secundLogo: {
      type: String,
      attribute: "logo-2",
    },
  };

  constructor() {
    super();
    this.titleText = "";
    this.logo = "";
    this.descriptiontext = this.titleText;
    this.secundLogo = "";
  }

  static styles = css`
    :host {
      user-select: none;
    }

    @font-face {
      font-family: "PokemonFont";
      src: url(../assets/fonts/Pokemon-Solid.ttf) format("truetype");
    }
    .container {
      text-align: center;
      background: transparent;
      padding-top: 10px;
    }

    .title {
      font-size: 2.5rem;
      font-family: "PokemonFont", sans-serif;
      color: #ffcb04;
      -webkit-text-stroke: 2.5px #3c60ac;
      //text-stroke: 2.5px #3C60AC;
      text-shadow: -3px 1px 0px rgba(31, 55, 106, 1);
      margin: 0;
      user-select: none;
    }

    .logo {
      width: 250px;
    }

    .title .title-logo {
      width: 4rem;
      height: 4rem;
    }
  `;

  render() {
    return html`
      <div class="container">
        <img class="logo" src="${this.logo}" alt="${this.descriptiontext}" />
        <p class="title">
          ${this.titleText}
          <img
            class="title-logo"
            src="${this.secundLogo}"
            alt="${this.descriptiontext}"
          />
        </p>
      </div>
    `;
  }
}
customElements.define("banner-title", BannerTitle);
