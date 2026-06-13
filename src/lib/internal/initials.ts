/**
 * Up to two initials from a name: the first LETTER of each of the first two
 * words, uppercased. Skips leading digits/symbols within a word (`\p{L}` finds
 * the first actual letter) and supports accented / non-Latin scripts (the `u`
 * flag). A name with no letters yields an empty string, so callers can fall back
 * to a placeholder. Shared, framework-free, and unit-tested in `initials.test.ts`.
 */
export function computeInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.match(/\p{L}/u)?.[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
