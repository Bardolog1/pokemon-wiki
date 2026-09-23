import { describe, it, expect } from "vitest";
import { buildNarrationText } from "./pokedex-voice.js";

const basePokemon = {
  name: "charizard",
  type: ["fire", "flying"],
  stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
  description: "Escupe fuego capaz de fundir rocas.",
  evolutions: ["charmander", "charmeleon", "charizard"],
};

describe("buildNarrationText", () => {
  it("includes name, joined types, stats, description, and evolution line", () => {
    const text = buildNarrationText(basePokemon);

    expect(text).toContain("charizard.");
    expect(text).toContain("Tipo: fire y flying.");
    expect(text).toContain("Puntos de vida: 78. Ataque: 84. Defensa: 78. Velocidad: 100.");
    expect(text).toContain("Escupe fuego capaz de fundir rocas.");
    expect(text).toContain("Su línea evolutiva es: charmander, charmeleon, charizard.");
  });

  it("says there are no known evolutions when the pokemon does not evolve", () => {
    const text = buildNarrationText({ ...basePokemon, evolutions: ["charizard"] });

    expect(text).toContain("No tiene evoluciones conocidas.");
  });
});
