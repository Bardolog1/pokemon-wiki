// Normalizes what the user typed into what the PokeAPI expects:
// "  #25 " -> "25", "Mr Mime" -> "mr-mime", "Flabébé" -> "flabebe".
// Returns "" when there is nothing to search for.
export function normalizeSearchQuery(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/^#/, "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}
