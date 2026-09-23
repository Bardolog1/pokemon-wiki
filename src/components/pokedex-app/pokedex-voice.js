// Narración por voz separada de pokedex-app: texto puro más un efecto aislado (SpeechSynthesis).

// Arma el texto narrado: tipo, estadísticas, dato curioso y línea evolutiva. Pura, testeable sin SpeechSynthesis.
export function buildNarrationText(pokemon) {
  const { name, type, stats, description, evolutions } = pokemon;
  const typeText = (type || []).join(" y ");
  const evolutionText =
    evolutions && evolutions.length > 1
      ? `Su línea evolutiva es: ${evolutions.join(", ")}.`
      : "No tiene evoluciones conocidas.";

  return [
    `${name}.`,
    `Tipo: ${typeText}.`,
    `Puntos de vida: ${stats.hp}. Ataque: ${stats.attack}. Defensa: ${stats.defense}. Velocidad: ${stats.speed}.`,
    description,
    evolutionText,
  ].join(" ");
}

// Cancela la narración en curso y arranca otra. pitch/rate son lo único que expone
// SpeechSynthesisUtterance para acercarse a un tono sintético.
export function speakPokemonEntry(pokemon, { onEnd } = {}) {
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(buildNarrationText(pokemon));
  utterance.lang = "es-ES";
  utterance.rate = 0.95;
  utterance.pitch = 0.7;

  const stop = () => onEnd?.();
  utterance.addEventListener("end", stop);
  utterance.addEventListener("error", stop);

  window.speechSynthesis.speak(utterance);
}
