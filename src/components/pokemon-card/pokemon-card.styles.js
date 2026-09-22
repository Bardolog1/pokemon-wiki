// src/components/pokemon-card/pokemon-card.styles.js
import { css } from "lit";

export const frontStyles = css`
  .containerCard {
    place-items: center;
    position: absolute;
    min-width: 100%;
    min-height: 100%;
    backface-visibility: hidden;
    border-radius: 1em;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    text-align: center;
    transform: rotateY(0deg);
    transform-style: preserve-3d;
    transition: 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
    overflow: hidden;
  }

  .containerCard::before {
    content: "";
    position: absolute;
    width: 450px;
    height: 35px;
    top: 0;
    right: 35px;
    transition: 0.1s ease-in-out;
    background: transparent;
    transform: rotate(-45deg) translate(0, -100px);
  }

  .containerCard:hover, .containerCard.force-hover {
    overflow: hidden;
    display: grid;
    background: linear-gradient(50deg, #2a5a3b, #1e4886);
  }

  .containerCard:hover::before, .containerCard.force-hover::before {
    background: linear-gradient(50deg, #00ff59, #02b3ff);
    animation: brightness 1.9s;
  }

  .containerCard .card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 15.5rem;
    height: 21.5rem;
    background: transparent;
    border-radius: 0.8em;
    color: transparent;
    transition: 0.1s ease-in-out;
    z-index: 999;
    overflow: hidden;
  }

  .containerCard:hover .card, .containerCard.force-hover .card {
    background: linear-gradient(160deg, rgba(23, 22, 20, 0.8), rgba(23, 22, 20, 0.55)),
      var(--gradient-background);
    overflow: hidden;
  }

  .containerCard .card .top-toolbar {
    display: none;
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 10%;
    z-index: 100;
    transition: 2s ease-in-out;
  }

  .containerCard:hover .top-toolbar, .containerCard.force-hover .top-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition: 2s ease-in-out;
  }

  .containerCard .card .top-toolbar pokemon-pokedex-button {
    height: 100%;
    width: 10%;
  }

  .containerCard:hover .image-container, .containerCard.force-hover .image-container {
    position: relative;
    margin-top: 0px;
    display: block;
    height: 10rem;
  }

  .containerCard:hover .image-container::before, .containerCard.force-hover .image-container::before {
    content: "";
    width: 150%;
    height: 250%;
    border-radius: 50%;
    background: var(--gradient-background);
    position: absolute;
    top: -170%;
    left: -25%;
    z-index: 1;
  }

  .containerCard:hover .image-container::after, .containerCard.force-hover .image-container::after {
    content: "";
    width: 150%;
    height: 250%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);

    position: absolute;
    top: -170%;
    left: -25%;
    z-index: 5;
  }

  .containerCard .card img {
    position: absolute;
    max-width: 100%;
    height: 13rem;
    transition: 0.3s ease-in-out;
    top: 35%;
    left: 0%;
    z-index: 9999;
  }

  .containerCard:hover img, .containerCard.force-hover img {
    position: relative;
    top: 10%;
    transition: all 0.3s ease-in-out 0s;
    z-index: 10;
    height: 9rem;
    width: 9rem;
  }

  .containerCard:hover .back-container, .containerCard.force-hover .back-container {
    width: 100%;
    height: 80%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 9;
  }

  .containerCard .img-back {
    display: none;
  }

  .containerCard:hover .img-back, .containerCard.force-hover .img-back {
    display: block;
    opacity: 0.5;
    width: 6rem;
    height: 7rem;
  }

  .containerCard .card h2 {
    display: block;
    font-weight: 500;
    text-align: start;
    width: 90%;
    margin: 0.5rem;
    margin-top: 1rem;
    margin-bottom: 0.3rem;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    color: #f2f2f2;
    font-size: 1.2rem;
  }

  .containerCard .card .info-container {
    display: none;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }

  .containerCard:hover .card .info-container, .containerCard.force-hover .card .info-container {
    display: flex;
  }

  .containerCard .id-exp-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 90%;
    margin: 0 0.5rem 0.5rem;
  }

  .containerCard .card .poke-id {
    width: 50%;
    text-align: left;
    display: inline-block;
    font-size: 0.8rem;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    color: #7a7a7a;
  }

  .containerCard .card .poke-exp {
    width: 50%;
    text-align: right;
    display: inline-block;
    font-size: 0.8rem;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    color: #7a7a7a;
  }

  .containerCard .type-container {
    width: 90%;
    margin: 0 0.5rem 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 0.2rem;
  }

  .containerCard .character-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 90%;
    margin: 0 0.5rem 0.5rem;
  }
`;

export const backStyles = css`
  .containerCardBack {
    display: grid;
    place-items: center;
    position: absolute;
    backface-visibility: hidden;
    min-width: 255px;
    min-height: 355px;
    background: linear-gradient(50deg, #2a5a3b, #1e4886);
    border-radius: 1em;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    text-align: center;
    overflow: hidden;
    transform: rotateY(180deg);
    transform-style: preserve-3d;
    transition: 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
  }
  .containerCardBack .card {
    display: block;
    place-items: center;
    width: 247px;
    height: 347px;
    background: linear-gradient(160deg, rgba(23, 22, 20, 0.8), rgba(23, 22, 20, 0.55)),
      var(--gradient-background);
    border-radius: 0.8em;
    z-index: 1;
    color: transparent;
    align-content: center;
    transition: 1s ease;
  }
  .containerCardBack h5 {
    color: #f2f2f2;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
    margin-top: 10px;
  }

  .containerCardBack h6 {
    color: #fff;
    font-size: 15px;
    margin-bottom: 6px;
    margin-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 5%;
    margin-right: 5%;
  }
  pokemon-type-matchups {
    margin-top: 8%;
    width: 90%;
  }
  .containerCardBack .card .top-toolbar {
    display: none;
    position: absolute;
    top: 5%;
    left: 10%;
    width: 80%;
    height: 10%;
    z-index: 100;
    transition: 2s ease-in-out;
  }

  .containerCardBack:hover .top-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition: 2s ease-in-out;
  }

  .containerCardBack .card .top-toolbar pokemon-pokedex-button {
    height: 100%;
    width: 10%;
  }
`;

export const sharedStyles = css`
  :host {
    user-select: none;
    height: 100%;
    margin: 0 1rem;
  }

  .scaff {
    display: inline-block;
    position: relative;
    min-width: 16rem;
    min-height: 22rem;
    overflow: inherit;
    background: transparent;
    border-radius: 1em;
    cursor: url(assets/poke1.png), auto;
    transition: 0.3 all;
  }

  /* Mientras se arrastra el ícono de la pokedex sobre la card, se anula el
     :hover para que no se abra/expanda mientras se suelta el ícono. */
  .scaff.drag-over .containerCard,
  .scaff.drag-over .containerCardBack {
    pointer-events: none;
  }

  .scaff.flipped > .containerCard {
    transform: rotateY(-180deg);
  }

  .scaff.flipped > .containerCardBack {
    transform: rotateY(0deg);
  }

  @keyframes brightness {
    100% {
      transform: rotate(-45deg) translate(0, 450px);
    }
  }
`;
