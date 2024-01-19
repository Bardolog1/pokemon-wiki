import { LitElement, html, css } from 'lit-element';


const EVENTS_CLICK = {
  FIRST: 'first-click',
  END: 'end-click',
  BACK: 'back-click',
  NEXT: 'next-click',
  NUMBER: 'number-click',
}

export class PaginadorPoke extends LitElement {
  static styles = css`
  
    :host {
      user-select: none;
    }

    .vertical {
      border-left: 1px solid #fff;
      opacity:0.5;
      height: 1.5rem;
      margin-left: 4px;
      margin-right: 4px;

    }

    .pagination-button {
      background: rgba(255,255,255,0.5);
      border: none;
      padding: 8px 12px;
      margin: 0 2px;
      cursor: pointer;
      border-radius: 20%;
      font-size: 14px;
      display: flex;
      align-items: center;
      transition: 0.1s all ease-in-out;
      position: relative;
    }




    .pagination-button:hover {
      background: rgba(200, 200, 200, 0.8);
      transform: scale(1.1);
      transition: 0.1s all ease-in-out;
      cursor: url(assets/hand.png), auto;
    }

    .pagination-button:active  {
      background: rgba(255,255,255,0.5);
      transition: 0.1s all ease-in-out;
      transform: scale(0.9);

    }

    .rotate {
      transform: rotate(180deg) ;
      transition: none;
    }

    .number:hover{
      cursor: url(assets/hand.png), auto;
      background: rgba(200, 200, 200, 0.8);
      transform: scale(1.1);
      transition: 0.1s all ease-in-out;
     
    }



    .pagination-button.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Estilos para los números de paginación */
    .pagination-numbers {
      display: flex;
      align-items: center;
      margin: 0 5rem;
    }

    .pagination-numbers .number {
      margin: 0 10px;
      padding: 8px;
      border-radius:20%;
      background: rgba(255,255,255,0.5);

    }

    .pagination-numbers .active {
      font-weight: bold;
      margin: 0 2px;
      padding: 8px;
      border-radius:20%;
      background: rgba(0,0,0,0.5);
      color:#fff;
    }

    /* Estilos para los íconos (esto es solo un ejemplo) */
    .icon {
      width: 16px;
      height: 16px;
      background-size: cover;
    }

    .icon.icon-first {
      background-image: url('assets/first.svg');
    }

    .icon.icon-end {
      background-image: url('assets/first.svg');
    }

    .icon.icon-next {
      background-image: url('assets/next.svg');
    }

    .icon.icon-back {
      background-image: url('assets/next.svg');
    }



    /* Contenedor principal */
    .pagination-container {
      display: flex;
      flex-direction:row;
      justify-content: center;
      align-items:center;
    }

    .pagination-buttons {
      display: flex;
      align-items: center;
    }
  `;


  static get properties() {
    return {
      currentPage: {
        type: Number,
        attribute: 'current-page',
        value:0
      },
      pages: {
        type: Number,
        value:0
      },
      results: {
        type: Number,
        attribute:'results',
        value:0,
        hasChanged(newP, oldP){
          return newP !== oldP;
        }
      },
      visiblePages: {
        type: Number,
        attribute: 'visible-pages',
        value:5
      },
      visibleResults: {
        type: Number,
        attribute: 'visible-results',
        value:50
      },
      _firstDisabled: {
        type: Boolean,
        attribute: false,
      },
      _endDisabled: {
        type: Boolean,
        attribute: false,
      },
      _mobile: {
        type: Boolean,
        attribute: false,
      },
      _numbers:{
        type:Array,
        attribute: false,
      }

    };

  }

  constructor() {
    super();
    this.results = 0;
    this.currentPage=0;
    this.pages=0;
    this.visiblePages=0;
    this.visibleResults=0;
  }

  updated(props) {
    super.updated && super.updated(props);

    if (
      props.has('results') ||
      props.has('pages') ||
      props.has('visibleResults') ||
      props.has('visiblePages')

    ) {
      this.calcPages();
    }
  }

  calcPages() {

    if (!this.pages && this.visibleResults ) {
      this.pages = Math.floor(this.results / this.visibleResults);
      this.pages = this.results % this.visibleResults > 0 ? this.pages + 1 : this.pages;

    }

    if (!this.visibleResults && this.pages) {
      this.visibleResults = Math.floor(this.results / this.pages);
      this.visibleResults = this.results % this.pages > 0 ? this.visibleResults + 1 : this.visibleResults

    }

    if (this.pages !== undefined && this.pages < this.visiblePages) {
      this.visiblePages = this.pages;

    }

    if (this.pages !== undefined && this.currentPage > this.pages) {
      this.currentPage = this.pages;

    }

  }

  get _getNumberList() {
     this._numbers = [];
    const limit = this._getLimit;
    const init = this.currentPage > this.visiblePages ? this.currentPage - (this.visiblePages - 1) : 1;

    for (let i = init; i <= limit; i += 1) {
      this._numbers.push(i);
    }

    return this._numberTpl( this._numbers, limit);

  }

  get _getLimit() {
    if (this.currentPage > this.visiblePages) {
      return this.currentPage;
    }
    return this.visiblePages;
  }

  get _firstDisabled() {
    return this.currentPage === 1;
  }

  get _endDisabled() {
    return this.pages === this.currentPage;
  }

  /* Templates */

  _numberTpl(myNumbers, limit) {

    return html`
      ${myNumbers.map(num => {

      if (num === this.currentPage && num === limit) {
        return html`<span class="active">${num}</span>`;
      }

      if (num === limit) {
        return html`<span class="number" @click="${this._clickNumber}">${num}</span>`;
      }

      if (num === this.currentPage && num !== limit) {
        return html`
              <span class="active">${num}</span>
              <hr class="vertical"/>
            `;
      }
      return html`
            <span class="number" @click="${this._clickNumber}">${num}</span>
            <hr class="vertical"/>
          `;
    })
      }
    `;
  }

  /* DispatchEvents */

  _firstClick() {
    if (!this._firstDisabled) {
      this.currentPage = 1;
      this.dispatchEvent(new CustomEvent(EVENTS_CLICK.FIRST, {
        bubbles: true,
        detail: {
          page:this.currentPage,
          results_page:this.visibleResults,
          total:this.results
        },
        }
      ));
    }
  }

  _endClick() {
    if (!this._endDisabled) {
      this.currentPage = this.pages;
      this.dispatchEvent(
        new CustomEvent(EVENTS_CLICK.END, {
        bubbles: true,
        detail: {
          page:this.currentPage,
          results_page:this.visibleResults,
          total:this.results
        },
        }
      ))
    }
  }

  _backClick() {
    this.dispatchEvent(
      new CustomEvent(EVENTS_CLICK.BACK, {
        bubbles: true,
        detail: {
          page:this.currentPage - 1,
          results_page:this.visibleResults,
          total:this.results
        },
      }),
    );
    this.currentPage -= 1;
  }

  _nextClick() {
    this.dispatchEvent(
      new CustomEvent(EVENTS_CLICK.NEXT, {
        bubbles: true,
        detail: {
          page:this.currentPage + 1,
          results_page:this.visibleResults,
          total:this.results
        },
      }),
    );
    this.currentPage += 1;
  }

  _clickNumber(e) {
    this.dispatchEvent(
      new CustomEvent(EVENTS_CLICK.NUMBER, {
        bubbles: true,
        detail: {
          page:Number(e.currentTarget.textContent),
          results_page:this.visibleResults
        }
      })
    );
    this.currentPage = Number(e.currentTarget.textContent)
  }


  render() {
    return html`
      <div class="pagination-container">
        <div class="pagination-buttons">
          <button
            class="pagination-button ${this._firstDisabled ? 'disabled' : ''}"
            @click="${this._firstClick}"
            ?disabled="${this._firstDisabled}"
          >
            <i class="icon icon-first"></i>
          </button>
          <button
            class="pagination-button ${this._firstDisabled ? 'disabled' : ''}"
            @click="${this._backClick}"
            ?disabled="${this._firstDisabled}"
          >
            <i class="icon icon-back rotate"></i>
          </button>
          <div class="pagination-numbers">
            ${this._getNumberList}
          </div>
          <button
            class="pagination-button ${this._endDisabled ? 'disabled' : ''}"
            @click="${this._nextClick}"
            ?disabled="${this._endDisabled}"
          >
            <i class="icon icon-next"></i>
          </button>
          <button
            class="pagination-button ${this._endDisabled ? 'disabled' : ''}"
            @click="${this._endClick}"
            ?disabled="${this._endDisabled}"
          >
            <i class="icon icon-end rotate"></i>
          </button>
        </div>
      </div>
    `;
  }
}
customElements.define('paginador-poke', PaginadorPoke);
