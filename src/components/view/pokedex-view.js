import { LitElement, html, css } from "lit-element";

export class PokedexView extends LitElement {
  
  
  static get properties() {
    return {
      visible: {
        type: Boolean,
        attribute: true, 
        reflect: true,
  
      }
    };
  }

  constructor() {
    super();
    
  }
  
  update(props) {
    super.update && super.update(props);
    console.log(props);
    if (props.has("visible")) {
      const pokedex = this.renderRoot.querySelector("#pokedex");
      console.log("visible", this.visible);
      if (this.visible) {
        console.log(pokedex);
        console.log("cerrar");
        pokedex.classList.add("visible");
        pokedex.classList.remove("hidden");
      } else { 
        console.log(pokedex);
        console.log("Abrir");
        pokedex.classList.add("hidden");
        pokedex.classList.remove("visible");
      }
    }
  }
  

  static styles = css`
    :host {
      user-select: none;

      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 1;
      --main-bg-color: #fe0065;
      --secondary-bg-color: #f2f2f2;
      --main-screen-bg-color: #98cbaf;
      --secondary-screen-bg-color: #9e9d9d;
      --main-buttons-color: #585858;
      --square-buttons-color: #7ca9f7;
    }

    .red {
      background-color: #ff0000;
    }
    .yellow {
      background-color: #fecb65;
    }
    .green {
      background-color: #32cb65;
    }
    .blue {
      background-color: #3298cb;
    }

    .light-blue {
      background-color: #85bdfe;
    }
    .light-red {
      background-color: #fe98cb;
    }
    .light-yellow {
      background-color: #fefecb;
    }
    .light-green {
      background-color: #98fe00;
    }

    /* poke-dex */
    #pokedex {
      cursor: url(assets/hand.png), auto;
      height: 80vh;
      width: 50vw;
      display: flex;
      border-radius: 10px;
    }

    @media only screen and (max-width: 600px) {
      #pokedex {
        width: 90%;
      }
    }

    /* LEFT PANEL */
    #left-panel {
      background-color: var(--main-bg-color);
      box-sizing: border-box;
      height: 100%;
      width: 50%;
      display: grid;
      grid-template-rows: 23% 50% 27%;
      border: solid black 3px;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      border-top-right-radius: 7px;
    }
    /* Top Lights */

    .left-top-container {
      position: relative;
    }

    .lights-container {
      position: relative;
      display: flex;
      justify-content: start;
      align-items: center;
    }

    .left-svg {
      position: absolute;
      z-index: +5;
      width: 100%;
    }

    .big-light-boarder {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      margin-top: 5px;
      height: 60px;
      width: 60px;
      border: solid black;
      border-radius: 50%;
      background-color: white;
    }

    .big-light {
      height: 50px;
      width: 50px;
      border-radius: 50%;
      border: solid black;
    }

    .big-dot {
      height: 15px;
      width: 15px;
      position: relative;
      top: 7px;
      left: 10px;
      border-radius: 50%;
    }

    .small-lights-container {
      margin-left: 15px;
      margin-top: 10px;
      width: 100px;
      height: 100%;
      display: flex;
      align-self: start;
      justify-content: space-between;
    }

    .small-light {
      border: solid black;
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
    .dot {
      height: 10px;
      width: 10px;
      position: relative;
      top: 3px;
      left: 3px;
      border-radius: 50%;
    }

    /* Center Screen */

    .screen-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .screen {
      width: 80%;
      height: 100%;
      border: solid black;
      border-radius: 0 0 0 17%;
      display: grid;
      grid-template-rows: 10% 72% 18%;
      background-color: white;
    }

    .top-screen-lights {
      width: 50%;
      margin-top: 2px;
      display: flex;
      justify-self: center;
      justify-content: center;
      align-items: center;
    }

    .mini-light {
      border: solid black 1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 7px;
    }

    #main-screen {
      height: 100%;
      width: 80%;
      justify-self: center;
      background-color: var(--main-screen-bg-color);
      border: solid black 2px;
      border-radius: 5%;
      background-image: url(https://clipart-library.com/images_k/sun-and-moon-silhouette/sun-and-moon-silhouette-5.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .bottom-screen-lights {
      display: flex;
      margin-top: 5px;
      width: 75%;
      justify-self: center;
      justify-content: space-between;
      align-items: center;
    }

    .bottom-screen-lights .small-light {
      border: solid black 2px;
      width: 30px;
      height: 30px;
    }

    .bottom-screen-lights .dot {
      height: 15px;
      width: 15px;
      top: 4px;
      left: 2px;
    }

    .line {
      width: 60px;
      height: 4px;
      background-color: black;
      margin-top: 4px;
    }

    /*Bottom buttons  */

    .buttons-container {
      display: grid;
      grid-template-rows: 40% 60%;
    }

    .big-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: solid 2px black;
      background-color: var(--main-buttons-color);
      margin-left: 20px;
      box-shadow: inset -3px -3px gray;
    }

    .long-button {
      width: 60px;
      height: 10px;
      margin-top: 10px;
      margin-left: 10px;
      border-radius: 50px;
      border: 2px solid black;
      box-shadow: inset -3px -3px gray;
    }

    .green-screen {
      width: 100%;
      height: 80%;
      border-radius: 5px;
      border: solid black 2px;
      background-color: #3ab47d;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #name-screen {
      width: 100%;
      font-family: "Press Start 2P", cursive;
      text-align: center;
      font-size: 8.5px;
      overflow-wrap: break-word;
    }

    .circle {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid black;
    }

    .upper-buttons-container {
      display: flex;
      align-items: top;
      justify-content: start;
      margin-top: 20px;
    }

    .long-buttons-container {
      display: flex;
      width: 40%;
      justify-content: space-around;
      margin-left: 15px;
    }

    .nav-buttons-container {
      display: grid;
      grid-template-columns: 27% 35% 38%;
    }

    .right-nav-container {
      position: relative;
      top: -30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .nav-button {
      height: 52px;
      width: 52px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .nav-button-vertical {
      position: absolute;
      transform: rotate(90deg);
      background-color: var(--main-buttons-color);
      border-radius: 8px;
      height: 25px;
      width: 80px;
      border: 3px solid black;
      box-shadow: inset -3px -3px gray;
    }

    .nav-button-horizontal {
      position: absolute;
      background-color: var(--main-buttons-color);
      border-radius: 8px;
      height: 25px;
      width: 80px;
      border: 3px solid black;
      box-shadow: inset -3px -3px gray;
    }

    .nav-center-circle {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      border: solid black 3px;
      z-index: +2;
      box-shadow: inset -3px -3px gray;
    }

    .border-top {
      border-top: 3px solid var(--main-buttons-color);
      position: absolute;
      top: -3px;
      left: 28px;
      right: 28px;
    }
    .border-bottom {
      border-top: 3px solid var(--main-buttons-color);
      position: absolute;
      top: 25px;
      left: 28px;
      right: 28px;
    }

    .bottom-right-nav-container {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .bottom-right-nav-container .small-light {
      border: solid black 2px;
      width: 20px;
      height: 20px;
      margin-right: 3px;
      margin-top: 25px;
    }

    .bottom-right-nav-container .dot {
      height: 5px;
      width: 5px;
      top: 2.5px;
      left: 2.5px;
    }

    /* RIGHT PANEL */

    #right-panel {
      background-color: var(--main-bg-color);
      box-sizing: border-box;
      position: relative;
      height: 88.3%;
      width: 50%;
      display: grid;
      grid-template-rows: 10% repeat(3, 25%);
      border-bottom: solid black 3px;
      border-bottom-right-radius: 10px;
      top: 11.7%;
      border-right: solid black 3px;
    }
    #right-panel::before {
      content: "";
      position: absolute;
      left: -3px;
      bottom: 0;
      width: 100%;
      height: 265px;

      border-bottom-right-radius: 7px;
    }

    .lines-poly {
      position: absolute;
      top: -32px;
      left: 0;
      z-index: +5;
      width: 100%;
      height: 50px;
    }

    /* top screen */
    .top-screen-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .right-panel-screen {
      font-family: "Press Start 2P", cursive;
      width: 300px;
      height: 120px;
      background-color: var(--secondary-screen-bg-color);
      border: solid black 2px;
      border-radius: 4px;
      font-size: xx-small;
      padding-left: 2px;
      padding-right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: left;
      padding-left: 8px;
      line-height: 2;
    }

    /* square buttons grid */
    .square-buttons-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .blue-squares-container {
      width: 300px;
      height: 150px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
    .blue-square {
      border-radius: 2px;
      border: black 1.5px solid;
      background-color: var(--square-buttons-color);
      box-shadow: inset -2px -2px #3298cb;
      box-shadow: inset -3px -3px gray;
    }

    /* center buttons */
    .center-buttons-container {
      display: flex;
      justify-content: space-around;
    }

    .center-left-container {
      display: grid;
    }

    .small-reds-container {
      display: flex;
      align-items: center;
      justify-content: start;
    }
    .small-reds-container .small-light {
      border: solid black 3px;
      width: 15px;
      height: 15px;
      margin-right: 20px;
      margin-top: 20px;
    }
    .small-reds-container .dot {
      height: 4px;
      width: 4px;
      top: 1px;
      left: 1px;
    }

    .white-squares-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .white-square {
      width: 60px;
      height: 60px;
      border-radius: 10px;
      border: black 3px solid;
      background-color: #ffffff;
      box-shadow: inset -3px -3px gray;
    }

    .center-right-container {
      display: grid;
      position: relative;
    }

    .thin-buttons-container {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      margin-right: 50%;
    }

    .thin-button {
      width: 70px;
      height: 5px;
      border: 3px solid black;
      background-color: var(--main-buttons-color);
      margin-left: 10px;
    }
    .yellow-button {
      justify-self: end;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: solid 3px black;
      margin-left: 7px;
    }

    .yellow-button .big-dot {
      height: 15px;
      width: 15px;
      position: relative;
      top: 10px;
      left: 10px;
      border-radius: 50%;
    }

    /* bottom screens */

    .bottom-screens-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .bottom-screens-container .right-panel-screen {
      width: 150px;
      height: 50px;
    }

    .container {
      background: rgba(0, 0, 0, 0.5);
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }

    .pokedex-close-button {
      background: rgba(255, 255, 255, 0.6);
      border: none;
      height: 5rem;
      width: 5rem;
      margin: 0 3rem;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      position: relative;
      transition: 0.5s all ease-in-out;
    }

    .pokedex-close-button:hover {
      background: rgba(200, 200, 200, 0.8);
      transition: 0.5s all ease-in-out;
      cursor: url(assets/hand.png), auto;
    }

    .pokedex-close-button:hover > .icon {
      transform: scale(1.2);
      transition: 0.5s all ease-in-out;
    }

    .pokedex-close-button:active > .icon {
      transform: scale(0.8);
      transition: 0.2s all ease-in-out;
    }

    .pokedex-close-button.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .pokedex-close-button .icon {
      width: 4rem;
      height: 4rem;
      background-size: cover;
      transition: 0.5s all ease-in-out;
    }

    .pokedex-close-button .icon.icon-first {
      position: absolute;
      top: 10%;
      left: 10%;
      background-image: url(assets/close-dex.png);
    }

    .pokedex-close-button-container {
      position: absolute;
      top: 10%;
      right: 10%;
      z-index: +5;
    }
    
    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
    
    @keyframes scaleOut {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(0);
        
      }
    }
    
    .visible {
      display: flex;
      animation: scaleIn 0.5s ease-in-out;
    }
    
    .hidden {
      display: none;
      animation: scaleOut 0.5s ease-in-out;
    }
    
  `;

  render() {
    return html`
      <div class="container">
        <div class="pokedex-close-button-container">
          <button
            class="pokedex-close-button"
            @click="${() => {
              this.dispatchEvent(
                new CustomEvent("pokedex-not-visible", {
                  bubbles: true,
                  detail: {
                    page: "pokedex",
                  },
                })
              );
            }}"
          >
            <i class="icon icon-first"></i>
          </button>
        </div>

        <div id="pokedex">
          <div id="left-panel">
            <!-- Top lights -->
            <div class="left-top-container">
              <svg height="100" width="500" class="left-svg">
                <polyline
                  points="0,90 90,90 120,60 500,60"
                  style="fill: none; stroke: black; stroke-width: 10"
                />
                <polyline
                  points="0,88 88,88 118,58 498,58"
                  style="fill: none; stroke: #fe0065; stroke-width: 2"
                />
              </svg>
              <div class="lights-container">
                <div class="big-light-boarder">
                  <div class="big-light blue">
                    <div class="big-dot light-blue"></div>
                  </div>
                </div>
                <div class="small-lights-container">
                  <div class="small-light red">
                    <div class="dot light-red"></div>
                  </div>
                  <div class="small-light yellow">
                    <div class="dot light-yellow"></div>
                  </div>
                  <div class="small-light green">
                    <div class="dot light-green"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Center Screen -->
            <div class="screen-container">
              <div class="screen">
                <div class="top-screen-lights">
                  <div class="mini-light red"></div>
                  <div class="mini-light red"></div>
                </div>
                <div id="main-screen"></div>
                <div class="bottom-screen-lights">
                  <div class="small-light red">
                    <div class="dot light-red"></div>
                  </div>
                  <div class="burger">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Bottom Buttons -->
            <div class="buttons-container">
              <div class="upper-buttons-container">
                <div class="big-button"></div>
                <div class="long-buttons-container">
                  <div class="long-button red"></div>
                  <div class="long-button light-blue"></div>
                </div>
              </div>
              <div class="nav-buttons-container">
                <div class="dots-container"></div>
                <div class="green-screen">
                  <span id="name-screen">***Pokemon Name Here***</span>
                </div>
                <div class="right-nav-container">
                  <div class="nav-button">
                    <div class="nav-center-circle"></div>
                    <div class="nav-button-vertical"></div>
                    <div class="nav-button-horizontal">
                      <div class="border-top"></div>
                      <div class="border-bottom"></div>
                    </div>
                  </div>
                  <div class="bottom-right-nav-container">
                    <div class="small-light red">
                      <div class="dot light-red"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="right-panel">
            <svg height="50%" width="100%" class="lines-poly">
              <polyline
                points="0,0 380,0 410,30 500,30 500,35 0,35 0,0"
                style="fill: #fe0065; stroke: none; stroke-width: 3"
              />
              <polyline
                points="3,3 380,3 410,30 498,28"
                style="fill: none; stroke: #000; stroke-width: 10"
              />
              <polyline
                points="-2,2 382,2 412,28 496,26"
                style="fill: none; stroke: #fe0065; stroke-width: 2"
              />
            </svg>
            <!-- Blank container -->
            <div class="empty-container"></div>
            <!-- Top screen -->
            <div class="top-screen-container">
              <div id="about-screen" class="right-panel-screen">
                For each blue button, information about the pokemon is shown
                here
              </div>
            </div>
            <!-- Blue Buttons -->
            <div class="square-buttons-container">
              <div class="blue-squares-container">
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
                <div class="blue-square"></div>
              </div>
            </div>
            <!-- Center Buttons -->
            <div class="center-buttons-container">
              <div class="center-left-container">
                <div class="small-reds-container">
                  <div class="small-light red">
                    <div class="dot light-red"></div>
                  </div>
                  <div class="small-light red">
                    <div class="dot light-red"></div>
                  </div>
                </div>
                <div class="white-squares-container">
                  <div class="white-square"></div>
                  <div class="white-square"></div>
                </div>
              </div>
              <div class="center-right-container">
                <div class="thin-buttons-container">
                  <div class="thin-button"></div>
                  <div class="thin-button"></div>
                </div>
                <div class="yellow-button yellow">
                  <div class="big-dot light-yellow"></div>
                </div>
              </div>
            </div>
            <!-- Bottom screens -->
            <div class="bottom-screens-container">
              <div id="type-screen" class="right-panel-screen">grass</div>
              <div id="id-screen" class="right-panel-screen">#1</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("pokedex-view", PokedexView);
