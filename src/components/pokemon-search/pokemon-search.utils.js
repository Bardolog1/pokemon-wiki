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
