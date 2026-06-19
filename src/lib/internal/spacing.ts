// Shared spacing scale for the layout primitives. The brand's 4px base maps 1:1 to Tailwind's default spacing step, so
// the scale (4·8·12·16·20·24·32·40·48·64) is exactly `*-1 *-2 *-3 *-4 *-5 *-6 *-8 *-10 *-12 *-16`. No off-grid values.

/** Spacing steps on the brand's scale (1:1 with theme/Tailwind spacing). */
export type SpacingStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

// Full literal class names so Tailwind's source scan sees them (no interpolation).
export const GAP: Record<SpacingStep, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
};
