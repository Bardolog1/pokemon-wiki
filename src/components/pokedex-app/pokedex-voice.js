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
