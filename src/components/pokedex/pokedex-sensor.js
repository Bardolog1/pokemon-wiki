import { LitElement, html, css } from "lit";

export class PokedexSensor extends LitElement {
  static properties = {
    blinking: { type: Boolean },
    loading: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .top-sensor-area {
      height: 100px;
      border-bottom: 4px solid var(--dex-border);
      display: flex;
      align-items: center;
      padding-left: 20px;
      box-sizing: border-box;
    }
    .lens-container {
      width: 70px;
      height: 70px;
      background: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 4px solid var(--dex-border);
    }
    .main-lens {
      width: 54px;
      height: 54px;
      background: radial-gradient(circle at 30% 30%, #7cd4ff, var(--dex-lens) 60%, #005f99);
      border-radius: 50%;
      border: 2px solid var(--dex-border);
    }
    .mini-leds {
      display: flex;
      gap: 8px;
      margin-left: 20px;
      align-self: flex-start;
      margin-top: 20px;
    }
    .led {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid var(--dex-border);
    }
    .led.red { background-color: #ff3333; }
    .led.yellow { background-color: var(--dex-yellow); }
    .led.green { background-color: var(--dex-green); }

    .main-lens.blinking { animation: blue-siren 0.3s infinite alternate; }
    @keyframes blue-siren {
      from { background-color: #28aadc; box-shadow: 0 0 10px #28aadc; }
      to { background-color: #e0f7fa; box-shadow: 0 0 30px #e0f7fa, inset 0 0 10px #fff; }
    }

    .loading-sequence .red { animation: traffic-red 0.6s infinite 0s; }
    .loading-sequence .yellow { animation: traffic-yellow 0.6s infinite 0.2s; }
    .loading-sequence .green { animation: traffic-green 0.6s infinite 0.4s; }

    @keyframes traffic-red { 50% { background-color: #ff5555; box-shadow: 0 0 15px red; } }
    @keyframes traffic-yellow { 50% { background-color: #ffff55; box-shadow: 0 0 15px yellow; } }
    @keyframes traffic-green { 50% { background-color: #55ff55; box-shadow: 0 0 15px green; } }
  `;

  constructor() {
    super();
    this.blinking = false;
    this.loading = false;
  }

  render() {
    return html`
      <div class="top-sensor-area">
        <div class="lens-container">
          <div class="main-lens ${this.blinking ? "blinking" : ""}"></div>
        </div>
        <div class="mini-leds ${this.loading ? "loading-sequence" : ""}">
          <div class="led red"></div>
          <div class="led yellow"></div>
          <div class="led green"></div>
        </div>
      </div>
    `;
  }
}
customElements.define("pokedex-sensor", PokedexSensor);
