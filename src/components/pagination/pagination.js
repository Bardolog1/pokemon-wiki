import { LitElement, html, css } from "lit";
import "../pagination-button/pagination-button.js";
import "../pagination-numbers/pagination-numbers.js";
import { calcPages, getNumberList } from "./pagination.utils.js";

const EVENTS_CLICK = {
  FIRST: "first-click",
  END: "end-click",
  BACK: "back-click",
  NEXT: "next-click",
  NUMBER: "number-click",
};

export class Pagination extends LitElement {
  static styles = css`
    :host {
      user-select: none;
    }
    .pagination-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .pagination-buttons {
      display: flex;
      align-items: center;
    }
  `;

  static get properties() {
    return {
      currentPage: { type: Number, attribute: "current-page" },
      pages: { type: Number },
      results: { type: Number, attribute: "results" },
      visiblePages: { type: Number, attribute: "visible-pages" },
      visibleResults: { type: Number, attribute: "visible-results" },
    };
  }

  constructor() {
    super();
    this.results = 0;
    this.currentPage = 0;
    this.pages = 0;
    this.visiblePages = 0;
    this.visibleResults = 0;
  }

  updated(props) {
    super.updated(props);
    if (
      props.has("results") ||
      props.has("pages") ||
      props.has("visibleResults") ||
      props.has("visiblePages")
    ) {
      // "pages" siempre se deriva de results/visibleResults, nunca se
      // preserva de un cálculo anterior: si se pasara this.pages ya
      // calculado, calcPages lo respeta como "ya definido" y jamás
      // vuelve a recalcularlo (ver su guard `if (!nextPages)`), dejando
      // la cantidad de páginas pegada al primer cómputo para siempre —
      // justo el bug que rompía la paginación al filtrar por tipo.
      const next = calcPages({
        results: this.results,
        pages: 0,
        visibleResults: this.visibleResults,
        visiblePages: this.visiblePages,
        currentPage: this.currentPage,
      });
      this.pages = next.pages;
      this.visibleResults = next.visibleResults;
      this.visiblePages = next.visiblePages;
      this.currentPage = next.currentPage;
    }
  }

  get _firstDisabled() {
    return this.currentPage === 1;
  }

  get _endDisabled() {
    return this.pages === this.currentPage;
  }

  _dispatchNav(type, page) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        detail: { page, results_page: this.visibleResults, total: this.results },
      }),
    );
  }

  _onFirst() {
    if (this._firstDisabled) return;
    this.currentPage = 1;
    this._dispatchNav(EVENTS_CLICK.FIRST, this.currentPage);
  }

  _onEnd() {
    if (this._endDisabled) return;
    this.currentPage = this.pages;
    this._dispatchNav(EVENTS_CLICK.END, this.currentPage);
  }

  _onBack() {
    this._dispatchNav(EVENTS_CLICK.BACK, this.currentPage - 1);
    this.currentPage -= 1;
  }

  _onNext() {
    this._dispatchNav(EVENTS_CLICK.NEXT, this.currentPage + 1);
    this.currentPage += 1;
  }

  _onNumberClick(e) {
    const { page } = e.detail;
    this._dispatchNav(EVENTS_CLICK.NUMBER, page);
    this.currentPage = page;
  }

  render() {
    const { numbers, limit } = getNumberList({
      currentPage: this.currentPage,
      visiblePages: this.visiblePages,
    });

    return html`
      <div class="pagination-container">
        <div class="pagination-buttons">
          <pagination-button
            icon="first"
            label="Primera página"
            .disabled=${this._firstDisabled}
            @button-click=${this._onFirst}
          ></pagination-button>
          <pagination-button
            icon="next"
            rotate
            label="Página anterior"
            .disabled=${this._firstDisabled}
            @button-click=${this._onBack}
          ></pagination-button>
          <pagination-numbers
            .numbers=${numbers}
            .currentPage=${this.currentPage}
            .limit=${limit}
            @number-click=${this._onNumberClick}
          ></pagination-numbers>
          <pagination-button
            icon="next"
            label="Página siguiente"
            .disabled=${this._endDisabled}
            @button-click=${this._onNext}
          ></pagination-button>
          <pagination-button
            icon="first"
            rotate
            label="Última página"
            .disabled=${this._endDisabled}
            @button-click=${this._onEnd}
          ></pagination-button>
        </div>
      </div>
    `;
  }
}
customElements.define("pagination-nav", Pagination);
