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

    .pagination-numbers .number {
      margin: 0 10px;
      padding: 8px;
      border-radius: 20%;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.5);
    }

    .pagination-numbers .number:hover {
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

  render() {
    return html`
      <div class="pagination-numbers">
        ${this.numbers.map((num) => {
          if (num === this.currentPage && num === this.limit) {
            return html`<span class="active">${num}</span>`;
          }
          if (num === this.limit) {
            return html`<span class="number" @click=${() => this._onClickNumber(num)}>${num}</span>`;
          }
          if (num === this.currentPage) {
            return html`
              <span class="active">${num}</span>
              <hr class="vertical" />
            `;
          }
          return html`
            <span class="number" @click=${() => this._onClickNumber(num)}>${num}</span>
            <hr class="vertical" />
          `;
        })}
      </div>
    `;
  }
}
customElements.define("pagination-numbers", PaginationNumbers);
