import { LitElement, html, css } from "lit";

export class PaginationNumbers extends LitElement {
  static properties = {
    numbers: { type: Array },
    currentPage: { type: Number, attribute: "current-page" },
    limit: { type: Number },
  };

  static styles = css`
    :host {
      user-select: none;
    }

    .vertical {
      border-left: 1px solid #fff;
      opacity: 0.5;
      height: 1.5rem;
      margin-left: 4px;
      margin-right: 4px;
    }

    .pagination-numbers {
      display: flex;
      align-items: center;
      margin: 0 5rem;
    }

    .pagination-numbers .number,
    .pagination-numbers .active {
      all: unset;
      cursor: pointer;
      box-sizing: border-box;
    }

    .pagination-numbers .number {
      margin: 0 10px;
      padding: 8px;
      border-radius: 20%;
      background: rgba(255, 255, 255, 0.5);
    }

    .pagination-numbers .number:hover,
    .pagination-numbers .number:focus-visible {
      background: rgba(200, 200, 200, 0.8);
      transform: scale(1.1);
      transition: 0.1s all ease-in-out;
    }

    .pagination-numbers .active {
      font-weight: bold;
      margin: 0 2px;
      padding: 8px;
      border-radius: 20%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      cursor: default;
    }
  `;

  constructor() {
    super();
    this.numbers = [];
    this.currentPage = 0;
    this.limit = 0;
  }

  _onClickNumber(num) {
    this.dispatchEvent(
      new CustomEvent("number-click", { bubbles: true, detail: { page: num } }),
    );
  }

  #activeButton(num) {
    return html`
      <button type="button" class="active" aria-current="page" aria-label="Página ${num}, actual" disabled>
        ${num}
      </button>
    `;
  }

  #numberButton(num) {
    return html`
      <button
        type="button"
        class="number"
        aria-label="Ir a la página ${num}"
        @click=${() => this._onClickNumber(num)}
      >
        ${num}
      </button>
    `;
  }

  render() {
    return html`
      <div class="pagination-numbers">
        ${this.numbers.map((num) => {
          if (num === this.currentPage && num === this.limit) {
            return this.#activeButton(num);
          }
          if (num === this.limit) {
            return this.#numberButton(num);
          }
          if (num === this.currentPage) {
            return html`
              ${this.#activeButton(num)}
              <hr class="vertical" />
            `;
          }
          return html`
            ${this.#numberButton(num)}
            <hr class="vertical" />
          `;
        })}
      </div>
    `;
  }
}
customElements.define("pagination-numbers", PaginationNumbers);
