import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    margin-bottom: 20px;
  }

  .grid-btn,
  .white-btn,
  .yellow-btn {
    all: unset;
    display: block;
    box-sizing: border-box;
    cursor: pointer;
  }

  .grid-buttons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 3px;
    width: 220px;
    background-color: var(--dex-border);
    border: 4px solid var(--dex-border);
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 2px;
  }
  .grid-btn {
    height: 42px;
    background-color: #00bfff;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: monospace;
    font-weight: bold;
    font-size: 1.4rem;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
    user-select: none;
    transition: transform 0.05s, background-color 0.05s;
  }
  .grid-btn:hover { background-color: #33ccff; }
  .grid-btn:active { transform: scale(0.85); background-color: #0088cc; }

  .middle-controls {
    display: flex;
    width: 220px;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
  }
  .white-btns { display: flex; gap: 10px; margin-right: auto; }
  .white-btn {
    width: 45px;
    height: 22px;
    background-color: #fff;
    border: 3px solid var(--dex-border);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.7rem;
    font-family: sans-serif;
    font-weight: bold;
  }
  .white-btn:active { transform: scale(0.9); }
  .white-btn.bold-red { color: red; }

  .yellow-btn {
    width: 22px;
    height: 22px;
    background-color: var(--dex-yellow);
    border: 3px solid var(--dex-border);
    border-radius: 50%;
    transition: background-color 0.1s;
  }
  .yellow-btn.flash { background-color: #ffffee; box-shadow: 0 0 15px yellow; transform: scale(1.05); }
`;
