import { css } from "lit";

export const styles = css`
  :host {
    user-select: none;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
  }

  .pokedex-button {
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

  .pokedex-button:hover {
    background: rgba(200, 200, 200, 0.8);
    transition: 0.5s all ease-in-out;
  }

  .pokedex-button:hover > .icon {
    transform: scale(1.2);
    transition: 0.5s all ease-in-out;
  }

  .pokedex-button:active > .icon {
    transform: scale(0.8);
    transition: 0.2s all ease-in-out;
  }

  .pokedex-button.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .icon {
    width: 5.5rem;
    height: 5rem;
    background-size: cover;
    transition: 0.5s all ease-in-out;
  }

  .icon.icon-first {
    position: absolute;
    top: 0;
    left: 0;
    background-image: url("assets/NicePng_pokedex-png_2285786.png");
  }

  /* === NUEVOS ESTILOS PARA EL MODAL Y EL BACKDROP === */
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.75); /* Fondo oscuro semi-transparente */
    backdrop-filter: blur(4px); /* Efecto de desenfoque opcional */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; /* Asegura que esté por encima de todo */
    animation: fadeIn 0.3s ease;
  }

  .modal-content {
    /* Animación para que la Pokédex aparezca con un efecto de zoom */
    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleUp {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;
