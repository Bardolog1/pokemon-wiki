import { describe, it, expect } from "vitest";
import { normalizeSearchQuery } from "./pokemon-search.utils.js";

describe("normalizeSearchQuery", () => {
  it("trims and lowercases a name", () => {
    expect(normalizeSearchQuery("  Pikachu ")).toBe("pikachu");
  });

  it("accepts an id with a leading #", () => {
    expect(normalizeSearchQuery(" #25 ")).toBe("25");
  });

  it("turns spaces into hyphens and strips accents", () => {
    expect(normalizeSearchQuery("Mr Mime")).toBe("mr-mime");
    expect(normalizeSearchQuery("Flabébé")).toBe("flabebe");
  });

  it("returns an empty string when there is nothing to search", () => {
    expect(normalizeSearchQuery("   ")).toBe("");
    expect(normalizeSearchQuery(null)).toBe("");
    expect(normalizeSearchQuery("#")).toBe("");
  });
});
