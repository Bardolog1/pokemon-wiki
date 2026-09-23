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

  .power-btn,
  .red-bezel-btn {
    all: unset;
    display: block;
    box-sizing: border-box;
    cursor: pointer;
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

  .screen-bezel { margin: 20px auto 10px auto; width: 260px; height: 200px; background-color: var(--dex-bezel); border: 4px solid var(--dex-border); border-radius: 10px 10px 10px 60px; display: flex; flex-direction: column; align-items: center; padding-top: 15px; box-sizing: border-box; }

  .bezel-bottom { display: flex; justify-content: space-between; width: 200px; margin-top: 10px; }
  .red-bezel-btn {
    width: 18px;
    height: 18px;
    background-color: var(--dex-red);
    border-radius: 50%;
    border: 2px solid var(--dex-border);
    cursor: pointer;
    transition: transform 0.1s ease;
  }
  .red-bezel-btn:hover { filter: brightness(1.15); }
  .red-bezel-btn:active { transform: scale(0.88); }
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

  .turn-on-hint {
    position: absolute; top: -45px; left: 50%; transform: translateX(-50%); background-color: white; color: black; padding: 6px 10px; border-radius: 4px; font-weight: 900; font-family: sans-serif; font-size: 14px; white-space: nowrap; border: 2px solid black; animation: blinkArrow 0.6s infinite alternate; z-index: 20;
  }
  .turn-on-hint::after { content: ''; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); border-width: 8px 8px 0; border-style: solid; border-color: black transparent transparent transparent; }
  @keyframes blinkArrow { from { top: -50px; opacity: 1; } to { top: -35px; opacity: 0.8; } }

  .hinge { width: 30px; height: 480px; background: linear-gradient(to right, #990000, var(--dex-red) 30%, #ff5b5b 50%, var(--dex-red) 70%, #990000); border: 4px solid var(--dex-border); border-radius: 10px; margin-left: -4px; margin-right: -4px; z-index: 5; display: flex; flex-direction: column; justify-content: space-evenly; box-sizing: border-box; }
  .hinge-joint { width: 100%; height: 4px; background-color: var(--dex-border); }

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

`;
