import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    --dex-red: #e32230;
    --dex-border: #222;
    --dex-screen-off: #232323;
    --dex-screen-on: #8bac0f;
    --dex-lens: #28aafa;
    --dex-yellow: #e8c722;
    --dex-green: #51ae5f;
    --dex-dark-green: #2c4a3f;
    --dex-bezel: #dedede;
  }

  .toggle-cover-btn {
    display: block;
    margin: 0 auto 40px auto;
    padding: 12px 24px;
    background-color: var(--dex-border);
    color: white;
    font-family: 'Press Start 2P', monospace, sans-serif;
    font-size: 14px;
    cursor: pointer;
    border-radius: 8px;
    border: 3px solid white;
    transition: transform 0.1s;
  }
  .toggle-cover-btn:active { transform: scale(0.95); }

  .pokedex-container {
    perspective: 2000px;
    margin: 0 auto 60px auto;
    display: flex;
    justify-content: center;
    transform: scale(1.05);
  }

  .pokedex {
    display: flex;
    flex-direction: row;
    align-items: center;
    filter: drop-shadow(15px 15px 20px rgba(0,0,0,0.6));
    transform-style: preserve-3d;
  }

  /* MITAD IZQUIERDA */
  .left-half {
    width: 340px;
    height: 480px;
    background-color: var(--dex-red);
    border: 4px solid var(--dex-border);
    border-radius: 20px 0 0 20px;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
  }

  .top-sensor-area { height: 100px; border-bottom: 4px solid var(--dex-border); display: flex; align-items: center; padding-left: 20px; box-sizing: border-box; }
  .lens-container { width: 70px; height: 70px; background: #fff; border-radius: 50%; display: flex; justify-content: center; align-items: center; border: 4px solid var(--dex-border); }
  .main-lens { width: 54px; height: 54px; background: radial-gradient(circle at 30% 30%, #7cd4ff, var(--dex-lens) 60%, #005f99); border-radius: 50%; border: 2px solid var(--dex-border); }
  .mini-leds { display: flex; gap: 8px; margin-left: 20px; align-self: flex-start; margin-top: 20px; }
  .led { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--dex-border); }
  .led.red { background-color: #ff3333; } .led.yellow { background-color: var(--dex-yellow); } .led.green { background-color: var(--dex-green); }

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

  .screen-bezel { margin: 20px auto 10px auto; width: 260px; height: 200px; background-color: var(--dex-bezel); border: 4px solid var(--dex-border); border-radius: 10px 10px 10px 60px; display: flex; flex-direction: column; align-items: center; padding-top: 15px; box-sizing: border-box; }

  .bezel-bottom { display: flex; justify-content: space-between; width: 200px; margin-top: 10px; }
  .red-bezel-btn { width: 18px; height: 18px; background-color: var(--dex-red); border-radius: 50%; border: 2px solid var(--dex-border); }
  .speaker-grill { display: flex; flex-direction: column; gap: 4px; }
  .speaker-line { width: 30px; height: 3px; background-color: var(--dex-border); }

  .lower-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-top: 20px;
  }

  .power-btn-container { position: relative; }
  .power-btn { width: 45px; height: 45px; background-color: #222; border-radius: 50%; border: 3px solid var(--dex-border); cursor: pointer; }

  .mini-green-screen {
    width: 95px;
    height: 42px;
    background-color: var(--dex-dark-green);
    border: 3.5px solid var(--dex-border);
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    font-weight: 900;
    color: transparent;
    transition: all 0.3s ease;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    letter-spacing: -1px;
  }
  .mini-green-screen.is-on {
    background-color: var(--dex-green);
    color: #0f380f;
    box-shadow: inset 0 0 10px rgba(15, 56, 15, 0.8);
  }

  .d-pad { position: relative; width: 85px; height: 85px; }
  .d-pad-v { position: absolute; left: 28px; width: 29px; height: 85px; background-color: #222; border-radius: 4px; border: 3px solid var(--dex-border); box-sizing: border-box; }
  .d-pad-h { position: absolute; top: 28px; width: 85px; height: 29px; background-color: #222; border-radius: 4px; border: 3px solid var(--dex-border); box-sizing: border-box; }
  .d-pad-center { position: absolute; top: 28px; left: 28px; width: 29px; height: 29px; background-color: #222; z-index: 2; }

  .d-pad-clickable { position: absolute; width: 29px; height: 29px; cursor: pointer; z-index: 10; }
  .d-pad-left { left: 0; top: 28px; }
  .d-pad-right { right: 0; top: 28px; }
  .d-pad-up { left: 28px; top: 0; }
  .d-pad-down { left: 28px; bottom: 0; }
  .d-pad-clickable:active { background-color: rgba(255,255,255,0.25); border-radius: 4px; }

  .turn-on-hint {
    position: absolute; top: -45px; left: 50%; transform: translateX(-50%); background-color: white; color: black; padding: 6px 10px; border-radius: 4px; font-weight: 900; font-family: sans-serif; font-size: 14px; white-space: nowrap; border: 2px solid black; animation: blinkArrow 0.6s infinite alternate; z-index: 20;
  }
  .turn-on-hint::after { content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); border-width: 8px 8px 0; border-style: solid; border-color: black transparent transparent transparent; }
  @keyframes blinkArrow { from { top: -50px; opacity: 1; } to { top: -35px; opacity: 0.8; } }

  /* BISAGRA */
  .hinge { width: 30px; height: 480px; background: linear-gradient(to right, #990000, var(--dex-red) 30%, #ff5b5b 50%, var(--dex-red) 70%, #990000); border: 4px solid var(--dex-border); border-radius: 10px; margin-left: -4px; margin-right: -4px; z-index: 5; display: flex; flex-direction: column; justify-content: space-evenly; box-sizing: border-box; }
  .hinge-joint { width: 100%; height: 4px; background-color: var(--dex-border); }

  /* MITAD DERECHA */
  .right-half {
    width: 340px;
    height: 480px;
    position: relative;
    z-index: 10;
    transform-origin: left center;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
    box-sizing: border-box;
  }

  .right-half.closed { transform: rotateY(-180deg); }
  .right-half.open { transform: rotateY(0deg); }

  .right-cover-exterior {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    backface-visibility: hidden;
    transform: rotateY(180deg);
  }
  .right-cover-exterior svg { width: 100%; height: 100%; }

  .right-content {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    backface-visibility: hidden;
  }
  .right-shell-svg-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
  .right-shell-svg-container svg { width: 100%; height: 100%; }

  .inner-components {
    position: relative; z-index: 2; padding: 120px 30px 30px 30px; display: flex; flex-direction: column; align-items: center; height: 100%; box-sizing: border-box;
  }

  .secondary-screen {
    width: 220px;
    height: 75px;
    background-color: var(--dex-dark-green);
    border: 4px solid var(--dex-border);
    border-radius: 6px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    font-family: 'Press Start 2P', monospace;
    transition: all 0.3s ease;
    color: transparent;
    box-sizing: border-box;
    overflow: hidden;
  }
  .secondary-screen.is-on { color: #0f380f; background-color: rgba(155, 188, 15, 0.85); box-shadow: inset 0 0 8px rgba(15, 56, 15, 0.6), 0 0 15px rgba(155, 188, 15, 0.6); text-shadow: 1px 1px 0px rgba(139, 172, 15, 0.3); }
  .poke-info-mini {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    line-height: 1.4;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }

  .poke-info-mini > div:first-child {
    font-size: 0.85rem;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .poke-info-mini .type-text {
    font-size: 0.65rem;
    margin-top: 6px;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .typing-number {
    font-size: 1.2rem;
    font-weight: 900;
    text-align: right;
    width: 100%;
    color: inherit;
    white-space: nowrap;
    overflow: hidden;
  }

  .grid-buttons { display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px; width: 220px; background-color: var(--dex-border); border: 4px solid var(--dex-border); border-radius: 4px; margin-bottom: 20px; padding: 2px; }
  .grid-btn { height: 42px; background-color: #00bfff; border-radius: 2px; cursor: pointer; display: flex; justify-content: center; align-items: center; color: #fff; font-family: monospace; font-weight: bold; font-size: 1.4rem; text-shadow: 1px 1px 0px rgba(0,0,0,0.5); user-select: none; transition: transform 0.05s, background-color 0.05s; }
  .grid-btn:hover { background-color: #33ccff; }
  .grid-btn:active { transform: scale(0.85); background-color: #0088cc; }

  .middle-controls { display: flex; width: 220px; justify-content: flex-end; align-items: center; gap: 15px; margin-bottom: 20px; }
  .white-btns { display: flex; gap: 10px; margin-right: auto; }
  .white-btn { width: 45px; height: 22px; background-color: #fff; border: 3px solid var(--dex-border); border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 0.7rem; font-family: sans-serif; cursor: pointer; font-weight: bold; }
  .white-btn:active { transform: scale(0.9); }
  .white-btn.bold-red { color: red; }

  .yellow-btn { width: 22px; height: 22px; background-color: var(--dex-yellow); border: 3px solid var(--dex-border); border-radius: 50%; cursor: pointer; transition: background-color 0.1s; }
  .yellow-btn.flash { background-color: #ffffee; box-shadow: 0 0 15px yellow; transform: scale(1.05); }

  /* BOTONES INFERIORES VERDES (PREV Y NEXT) */
  .bottom-controls { display: flex; width: 220px; justify-content: space-between; }
  .dark-green-btn {
    width: 100px;
    height: 25px;
    background-color: var(--dex-dark-green);
    border: 3px solid var(--dex-border);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8bac0f;
    font-family: 'Press Start 2P', monospace;
    font-size: 8px;
    font-weight: bold;
    user-select: none;
    transition: background-color 0.1s, transform 0.05s;
  }
  .dark-green-btn:hover { background-color: #385e50; }
  .dark-green-btn:active { transform: scale(0.92); }
`;
