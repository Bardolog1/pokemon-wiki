import { LitElement, html, css } from "lit";

export class PageRangeInfo extends LitElement {
  static properties = {
    rangeStart: { type: Number },
    rangeEnd: { type: Number },
    total: { type: Number },
    currentPage: { type: Number },
    totalPages: { type: Number },
  };

  static styles = css`
    /* Mismo lenguaje visual que .favorites-toggle/.tour-trigger (píldora
       translúcida blanca, texto oscuro) — así no se pierde contra el cielo
       claro del fondo. */
    .page-info {
      display: inline-block;
      background: rgba(255, 255, 255, 0.6);
      color: #1c2e28;
      border-radius: 100px;
      padding: 0.3rem 0.9rem;
      font-size: 0.75rem;
      font-weight: 600;
      margin: 0.1rem 0 0;
    }
  `;

  render() {
    return html`
      <p class="page-info">
        Mostrando ${this.rangeStart}–${this.rangeEnd} de ${this.total} · Página ${this.currentPage} de
        ${this.totalPages}
      </p>
    `;
  }
}
customElements.define("page-range-info", PageRangeInfo);
