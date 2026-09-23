import { css } from "lit";

export const styles = css`
  @font-face {
    font-family: "PokemonFont";
    src: url(../assets/fonts/Pokemon-Solid.ttf) format("truetype");
    font-weight: normal;
    font-style: normal;
  }

  /* La cabecera ocupa solo su alto (flex: 0 0 auto); listar-pokemon toma el resto con flex: 1. */
  .container {
    cursor: url(assets/poke2.png), auto;
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    padding-bottom: 0.75rem;
    box-sizing: border-box;
  }

  banner-title {
    width: 100%;
    flex: 0 0 auto;
  }

  pokemon-type-filter {
    width: 100%;
    flex: 0 0 auto;
    margin-top: 0.8rem;
  }

  pokemon-type-filter.hidden {
    display: none;
  }

  .top-bar {
    width: 100%;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    padding: 0.9rem 0 0.6rem;
  }

  pagination-nav {
    width: 100%;
    position: relative;
  }

  pagination-nav.hidden {
    display: none;
  }

  .empty-favorites {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    font-size: 1rem;
  }

  .error {
    color: #fff;
    background: rgba(180, 30, 30, 0.85);
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }

  listar-pokemon {
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    position: relative;
  }

  navbar-buttons {
    height: 0px;
    position: relative;
  }
`;
