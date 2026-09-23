export function calcPages({ results, pages, visibleResults, visiblePages, currentPage }) {
  let nextPages = pages;
  let nextVisibleResults = visibleResults;
  let nextVisiblePages = visiblePages;
  let nextCurrentPage = currentPage;

  if (!nextPages && nextVisibleResults) {
    nextPages = Math.floor(results / nextVisibleResults);
    nextPages = results % nextVisibleResults > 0 ? nextPages + 1 : nextPages;
  }

  if (!nextVisibleResults && nextPages) {
    nextVisibleResults = Math.floor(results / nextPages);
    nextVisibleResults = results % nextPages > 0 ? nextVisibleResults + 1 : nextVisibleResults;
  }

  if (nextPages !== undefined && nextPages < nextVisiblePages) {
    nextVisiblePages = nextPages;
  }

  if (nextPages !== undefined && nextCurrentPage > nextPages) {
    nextCurrentPage = nextPages;
  }

  return {
    pages: nextPages,
    visibleResults: nextVisibleResults,
    visiblePages: nextVisiblePages,
    currentPage: nextCurrentPage,
  };
}

export function getNumberList({ currentPage, visiblePages }) {
  const limit = currentPage > visiblePages ? currentPage : visiblePages;
  const init = currentPage > visiblePages ? currentPage - (visiblePages - 1) : 1;

  const numbers = [];
  for (let i = init; i <= limit; i += 1) {
    numbers.push(i);
  }

  return { numbers, limit };
}
