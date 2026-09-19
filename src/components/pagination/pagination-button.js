import { LitElement, html, css } from "lit";

export class PaginationButton extends LitElement {
  static properties = {
    icon: { type: String },
    rotate: { type: Boolean },
    disabled: { type: Boolean },
  };

  static styles = css`
    :host {
      user-select: none;
    }

    .pagination-button {
      background: rgba(255, 255, 255, 0.5);
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
    }

    .pagination-button:active {
      background: rgba(255, 255, 255, 0.5);
      transition: 0.1s all ease-in-out;
      transform: scale(0.9);
    }

    .pagination-button.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rotate {
      transform: rotate(180deg);
      transition: none;
    }

    .icon {
      width: 16px;
      height: 16px;
      background-size: cover;
      background-image: var(--icon-url);
    }
  `;

  constructor() {
    super();
    this.icon = "";
    this.rotate = false;
    this.disabled = false;
  }

  _onClick() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("button-click", { bubbles: true }));
  }

  render() {
    return html`
      <button
        class="pagination-button ${this.disabled ? "disabled" : ""}"
        @click=${this._onClick}
        ?disabled=${this.disabled}
        style="--icon-url: url(assets/${this.icon}.svg)"
      >
        <i class="icon ${this.rotate ? "rotate" : ""}"></i>
      </button>
    `;
  }
}
customElements.define("pagination-button", PaginationButton);
