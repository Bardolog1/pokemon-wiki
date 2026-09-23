import { LitElement, html, css } from "lit";

export class FavoritesEmpty extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
    }

    .panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      max-width: 20rem;
      padding: 1.1rem 1.6rem 1.3rem;
      border-radius: 1.4rem;
      text-align: center;
      color: #1d1d1b;
      background: rgba(255, 255, 255, 0.78);
      backdrop-filter: blur(6px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    }

    .star {
      font-size: 3rem;
      line-height: 1;
      color: #ffcb04;
      -webkit-text-stroke: 2px #3b4cca;
      paint-order: stroke fill;
      animation: pulse 1.8s ease-in-out infinite;
    }

    .title {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
    }

    .hint {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.35;
    }

    @keyframes pulse {
      50% {
        transform: scale(1.15) rotate(8deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .star {
        animation: none;
      }
    }
  `;

  render() {
    return html`
      <div class="panel" role="status">
        <span class="star" aria-hidden="true">★</span>
        <p class="title">Tu colección está vacía</p>
        <p class="hint">Marca la estrella de una carta y aparecerá aquí.</p>
      </div>
    `;
  }
}
customElements.define("favorites-empty", FavoritesEmpty);
