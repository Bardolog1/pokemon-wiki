import { describe, it, expect } from 'vitest';
import { calcPages, getNumberList } from './pagination.utils.js';

describe('calcPages', () => {
  it('derives pages from results and visibleResults when pages is not set', () => {
    const result = calcPages({ results: 60, pages: 0, visibleResults: 5, visiblePages: 5, currentPage: 1 });
    expect(result.pages).toBe(12);
  });

  it('rounds up when results does not divide evenly by visibleResults', () => {
    const result = calcPages({ results: 62, pages: 0, visibleResults: 5, visiblePages: 5, currentPage: 1 });
    expect(result.pages).toBe(13);
  });

  it('derives visibleResults from results and pages when visibleResults is not set', () => {
    const result = calcPages({ results: 60, pages: 12, visibleResults: 0, visiblePages: 5, currentPage: 1 });
    expect(result.visibleResults).toBe(5);
  });

  it('clamps visiblePages down to pages when pages is smaller', () => {
    const result = calcPages({ results: 12, pages: 3, visibleResults: 4, visiblePages: 5, currentPage: 1 });
    expect(result.visiblePages).toBe(3);
  });

  it('clamps currentPage down to pages when currentPage overshoots', () => {
    const result = calcPages({ results: 60, pages: 12, visibleResults: 5, visiblePages: 5, currentPage: 99 });
    expect(result.currentPage).toBe(12);
  });
});

describe('getNumberList', () => {
  it('returns 1..visiblePages when currentPage is within the first window', () => {
    const result = getNumberList({ currentPage: 2, visiblePages: 5 });
    expect(result.numbers).toEqual([1, 2, 3, 4, 5]);
    expect(result.limit).toBe(5);
  });

  it('slides the window forward once currentPage exceeds visiblePages', () => {
    const result = getNumberList({ currentPage: 7, visiblePages: 5 });
    expect(result.numbers).toEqual([3, 4, 5, 6, 7]);
    expect(result.limit).toBe(7);
  });
});
