import { LitElement, html, css } from 'lit-element';

export class BannerTitle extends LitElement {
  static properties = {
    page: { type: Number },
    ultimaPosible: { type: Number },
    primeraPosible: { type: Number },
    cantidad: { type: Number },
    elementos: { type: Array },
  };

  constructor() {
    super();
    this.page = 1;
    this.ultimaPosible = 1;
    this.primeraPosible = 1;
    this.cantidad = 1;
    this.elementos = [];
  }

  firstUpdated() {
    this._calcularPaginacion(this.cantidad, 15, this.page);
    this._next();
  }

  static styles = css`
    .container {
      text-align: center;
      background: transparent;
      padding-top: 20px;
      padding-bottom: 10px;
    }

    h1 {
      font-size: 100px;
    }

    .title {
      color: #fff;
    }

    p {
      font-size: 30px;
      margin-bottom: 20px;
    }

    .logo {
      width: 400px;
    }

    p img {
      width: 30px;
      height: 30px;
    }
  `;

  _calcularPaginacion(cant, element, page) {
    console.log(cant, element, page);
    if (cant > 0) {
      var endPageFloor = Math.floor(cant / element);
      var sobra = cant - endPageFloor * element;

      this.ultimaPosible = sobra > 0 ? endPageFloor + 1 : endPageFloor;
      this.primeraPosible = cant > 0 ? 1 : 'No Hay Elementos';

      this.elementos.splice(0, this.elementos.length);

      if (page != this.ultimaPosible) {
        this.elementos.push({
          primero: element * page - (element - 1),
          ultimo: element * page,
        });
        console.log(this.elementos);
      } else if (page == this.ultimaPosible || sobra > 0) {
        this.elementos.push({
          primero: element * page - --element,
          ultimo: cant,
        });
        console.log(this.elementos);
      }
      return this.elementos;
    }

    this.elementos.push({
      primero: 1,
      ultimo: element,
    });
    return this.elementos;
  }

  _evento(data) {
    this.dispatchEvent(
      new CustomEvent('elementos-paginar', {
        detail: { data },
        bubbles: true,
        composed: true,
      })
    );
  }

  _next() {

    var next = this.renderRoot.querySelector('.next');
    var back = this.renderRoot.querySelector('.back');

    next.addEventListener('click', (e) => {
      e.preventDefault();
      this.page = ++this.page;
      this._evento(this._calcularPaginacion(this.cantidad, 16, this.page));
    });

    back.addEventListener('click', (e) => {
      e.preventDefault();
      this.page = --this.page;
      this._evento(this._calcularPaginacion(this.cantidad, 16, this.page));
    });
  }

  render() {
    return html`
      <div class="container">
        <img
          class="logo"
          src="https://vignette1.wikia.nocookie.net/es.pokemon/images/6/61/Logo_de_Pok%C3%A9mon_(EN).png/revision/latest?cb=20160319183155"
          alt=""
        />
        <p class="title">
          PokeDex with PokéAPI & Lit
          <img src="https://lit.dev/images/logo.svg#flame" alt="lit" />
        </p>
      </div>
    `;
  }
}
customElements.define('banner-title', BannerTitle);
