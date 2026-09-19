// src/components/pokemon-card/pokemon-stats-chart.js
import { LitElement, html, css } from "lit";
import Chart from "chart.js/auto";

export class PokemonStatsChart extends LitElement {
  static properties = {
    pokemon: { type: Object },
    visible: { type: Boolean },
  };

  static styles = css`
    canvas {
      margin-top: 5%;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.pokemon = {};
    this.visible = false;
  }

  updated(changed) {
    super.updated(changed);
    if (changed.has("visible") && this.visible) {
      this.#draw();
    }
  }

  #draw() {
    if (!this.pokemon?.stats) return;
    const canvas = this.renderRoot.getElementById(`${this.pokemon.id}-chart`);
    if (!canvas) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(canvas.getContext("2d"), {
      type: "polarArea",
      data: {
        labels: ["HP", "Attack", "Defense", "S. Attack", "S. Defense", "Speed"],
        datasets: [
          {
            borderColor: "#000",
            data: [
              this.pokemon.stats.hp,
              this.pokemon.stats.attack,
              this.pokemon.stats.defense,
              this.pokemon.stats.special_attack,
              this.pokemon.stats.special_defense,
              this.pokemon.stats.speed,
            ],
            backgroundColor: [
              "rgb(255, 99, 132,0.5)",
              "rgb(54, 162, 235,0.5)",
              "rgb(255, 205, 86, 0.5)",
              "rgb(25, 205, 86, 0.5)",
              "rgb(153, 102, 255, 0.5)",
              "rgb(255, 159, 64, 0.5)",
            ],
            borderColor: [
              "rgb(255, 99, 132,1)",
              "rgb(54, 162, 235,1)",
              "rgb(255, 205, 86, 1)",
              "rgb(25, 205, 86, 1)",
              "rgb(153, 102, 255, 1)",
              "rgb(255, 159, 64, 1)",
            ],
            hoverOffset: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: true, labels: { color: "rgb(255, 255, 255, 0.5)" } },
        },
        scales: { r: { suggestedMax: 100, display: false } },
      },
    });
  }

  render() {
    return html`<canvas id="${this.pokemon.id}-chart"></canvas>`;
  }
}
customElements.define("pokemon-stats-chart", PokemonStatsChart);
