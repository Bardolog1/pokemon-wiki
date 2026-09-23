// Lógica de narración por voz de la Pokédex, separada de pokedex-app.js
// porque es lógica pura (arma texto) + un efecto secundario aislado
// (SpeechSynthesis), sin tocar ningún otro estado del componente.

// Arma el texto que narra la Pokédex: tipo, estadísticas, dato curioso y
// línea evolutiva. Función pura — testeable sin SpeechSynthesis ni un
// componente Lit montado.
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

// Cancela cualquier narración en curso y arranca una nueva para este
// Pokémon. pitch/rate son los únicos parámetros reales que expone
// SpeechSynthesisUtterance para acercarla a un tono más sintético; no hay
// forma estándar de rutear la síntesis de voz por Web Audio API.
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
