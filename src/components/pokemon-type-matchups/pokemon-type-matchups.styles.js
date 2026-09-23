import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    width: 100%;
  }

  .group {
    margin-bottom: 0.7rem;
  }

  .group-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--accent-color, #f2f2f2);
    margin-bottom: 0.4rem;
  }

  .group-title .arrow {
    font-size: 0.6rem;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    justify-content: center;
    padding: 0.4rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 0.6rem;
  }

  .chip {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .chip .badge {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }

  .chip img {
    width: 1.2rem;
    height: 1.2rem;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.5));
  }

  .chip .mult {
    font-size: 0.62rem;
    font-weight: 700;
    color: var(--accent-color, #f2f2f2);
  }

  .chip .tooltip {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) translateY(2px);
    background: #171614;
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #f2f2f2;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: capitalize;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease, transform 0.12s ease;
    z-index: 10;
  }

  .chip:hover .tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .empty {
    font-size: 0.65rem;
    color: #f2f2f2;
    opacity: 0.5;
    padding: 0.3rem 0;
  }
`;
