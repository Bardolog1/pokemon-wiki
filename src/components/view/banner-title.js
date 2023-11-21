import { LitElement, html, css } from 'lit-element';

export class BannerTitle extends LitElement {
  static properties = {
      titleText:{
        type:String,
        attribute: 'title'
      },
      logo:{
        type:String,
        attibute:'logo'
      },
      descriptiontext:{
        type:String,
        attribute:'description'
      },
      secundLogo:{
        type:String,
        attribute:'logo-2'
      }
  };

  constructor() {
    super();
    this.titleText="";
    this.logo="";
    this.descriptiontext=this.titleText;
    this.secundLogo="";
  }



  static styles = css`

   @font-face {
      font-family: 'Pokemon Solid';
      src: url('assets/fonts/Pokemon-Solid.ttf') format('truetype');
      /*font-weight: normal;
      font-style: normal;*/
    }
    .container {
      text-align: center;
      background: transparent;
      padding-top: 10px;
    }

    .title {
      font-size: 2.5rem;
      font-family:  'Pokemon Solid', sans-serif;
      color: #FFCB04;
      -webkit-text-stroke: 2.5px #3C60AC;
       text-stroke: 2.5px #3C60AC;
       text-shadow: -3px 1px 0px rgba(31,55,106,1);
       margin:0;
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
        <img
          class="logo"
          src="${this.logo}"
          alt="${this.descriptiontext}"
        />
        <p class="title">
          ${this.titleText}
          <img class="title-logo" src='${this.secundLogo}' alt='${this.descriptiontext}' />
        </p>
      </div>
    `;
  }
}
customElements.define('banner-title', BannerTitle);
