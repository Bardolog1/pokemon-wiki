// Cálculo puro del rango de resultados/páginas mostrado en la cabecera de
// la lista — separado de pokemon-wiki.js para que sea testeable sin montar
// el componente Lit. Mientras un fetch filtrado está en camino,
// filteredTotal todavía no se actualizó (arranca en 0/valor anterior); sin
// el fallback a `elements`, el paginador recibiría un total=0 transitorio
// que rompe permanentemente visiblePages/currentPage (ver calcPages: el
// clamp que aplica ese 0 nunca se revierte cuando llegan los datos reales).
export function computeResultsRange({
  selectedTypes,
  filteredTotal,
  elements,
  currentPage,
  visibleResults,
}) {
  const resultsCount =
    selectedTypes.length > 0 ? filteredTotal || elements || 0 : elements || 0;
  const totalPages = visibleResults ? Math.ceil(resultsCount / visibleResults) : 0;
  const rangeStart = resultsCount === 0 ? 0 : (currentPage - 1) * visibleResults + 1;
  const rangeEnd = Math.min(currentPage * visibleResults, resultsCount);

  return { resultsCount, totalPages, rangeStart, rangeEnd };
}
