import { describe, it, expect } from "vitest";
import { computeResultsRange } from "./results-range.js";

describe("computeResultsRange", () => {
  it("uses elements as the total when no type filter is active", () => {
    const result = computeResultsRange({
      selectedTypes: [],
      filteredTotal: 0,
      elements: 1351,
      currentPage: 1,
      visibleResults: 20,
    });

    expect(result).toEqual({ resultsCount: 1351, totalPages: 68, rangeStart: 1, rangeEnd: 20 });
  });

  it("uses filteredTotal as the total when a type filter is active", () => {
    const result = computeResultsRange({
      selectedTypes: ["dragon"],
      filteredTotal: 117,
      elements: 1351,
      currentPage: 1,
      visibleResults: 20,
    });

    expect(result).toEqual({ resultsCount: 117, totalPages: 6, rangeStart: 1, rangeEnd: 20 });
  });

  it("falls back to elements while a filtered fetch is still in flight (filteredTotal not set yet)", () => {
    const result = computeResultsRange({
      selectedTypes: ["dragon"],
      filteredTotal: 0,
      elements: 1351,
      currentPage: 1,
      visibleResults: 20,
    });

    expect(result.resultsCount).toBe(1351);
  });

  it("computes the range for a page other than the first", () => {
    const result = computeResultsRange({
      selectedTypes: [],
      filteredTotal: 0,
      elements: 117,
      currentPage: 3,
      visibleResults: 20,
    });

    expect(result).toEqual({ resultsCount: 117, totalPages: 6, rangeStart: 41, rangeEnd: 60 });
  });

  it("clamps rangeEnd to the total on the last, partial page", () => {
    const result = computeResultsRange({
      selectedTypes: [],
      filteredTotal: 0,
      elements: 117,
      currentPage: 6,
      visibleResults: 20,
    });

    expect(result).toEqual({ resultsCount: 117, totalPages: 6, rangeStart: 101, rangeEnd: 117 });
  });
});
