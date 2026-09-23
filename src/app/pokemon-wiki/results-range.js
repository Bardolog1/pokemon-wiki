// Rango de resultados/páginas de la cabecera; puro para testearlo sin montar Lit.
// Mientras un fetch filtrado está en curso usa `elements` como respaldo: un total=0 llegaría al paginador
// y calcPages lo fijaría para siempre.
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
