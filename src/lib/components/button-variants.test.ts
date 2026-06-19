import { describe, expect, it } from "vitest";
import { VARIANTS } from "./button-variants.js";

describe("VARIANTS.secondary", () => {
  const cls = VARIANTS.secondary;

  // The secondary button is an outline button: with a transparent fill, its border is its entire resting presence. The
  // faint `--border` hairline left it barely visible on the cream (Daylight) and espresso (Evening) surfaces, so it
  // uses the stronger `--divider` edge — "a clear step past the hairline" — to read at rest in both themes. Must FAIL
  // on the old `border-border` recipe.
  it("uses the stronger divider edge, not the faint hairline", () => {
    expect(cls).toContain("border-divider");
    expect(cls).not.toMatch(/border-border\b/);
  });

  // It stays an outline button: transparent fill plus a real border.
  it("remains a transparent, bordered outline button", () => {
    expect(cls).toContain("bg-transparent");
    expect(cls).toMatch(/\bborder\b/);
  });
});

describe("VARIANTS.destructive", () => {
  const cls = VARIANTS.destructive;

  // TDD guard: the old `brightness-95`/`brightness-90` approach dims the entire element including white text, causing
  // contrast to DROP on hover (white-on-#cc4029 ≈ 4.85:1 at rest; `brightness-90` would yield ≈ 4.44:1, failing WCAG
  // AA). A CSS `filter` never changes `background-color`, so it is invisible to `getComputedStyle` in browser tests.
  // This test must FAIL on the old code and PASS after the fix.
  it("does not use brightness() filter for hover or active states", () => {
    expect(cls).not.toMatch(/hover:brightness/);
    expect(cls).not.toMatch(/active:brightness/);
  });

  // The fix darkens the background fill via color-mix, leaving text at pure white. This means hover and active each
  // carry a `bg-[color-mix(...)]` arbitrary value while the resting state keeps `bg-error` and `text-white`.
  it("uses color-mix for the hover background", () => {
    // The class must contain hover:bg-[ to confirm Tailwind's arbitrary-value syntax.
    expect(cls).toMatch(/hover:bg-\[color-mix\(/);
  });

  it("uses color-mix for the active background", () => {
    expect(cls).toMatch(/active:bg-\[color-mix\(/);
  });

  // The resting fill is bg-error (the --color-error token, #cc4029).
  it("keeps bg-error as the resting background", () => {
    expect(cls).toContain("bg-error");
  });

  // text-white must survive unchanged so white text on the darkened fills keeps WCAG AA.
  // WCAG ratios (sRGB channel scaling, `in srgb` color-mix):
  //   rest   white/#cc4029          ≈ 4.85:1  (≥ 4.5 — pass)
  //   hover  white/#cc4029×0.90     ≈ 5.72:1  (≥ 4.5 — pass)
  //   active white/#cc4029×0.82     ≈ 6.65:1  (≥ 4.5 — pass)
  it("keeps text-white so white text clears WCAG AA on hover and active fills", () => {
    expect(cls).toContain("text-white");
  });

  // The hover fill must mix in MORE black than the active fill (i.e., active is darker than hover) to produce a
  // visually distinct step.
  it("active mixes in more black than hover (active is darker than hover)", () => {
    // Extract the percentage values from the color-mix expressions. The Tailwind arbitrary-value bracket is `]`; inside
    // the color-mix there are nested parens from `var(--color-error)`, so we use a lazy `.*?` to cross them.
    const hoverMatch = cls.match(/hover:bg-\[color-mix\(.*?black_(\d+)%\)\]/);
    const activeMatch = cls.match(/active:bg-\[color-mix\(.*?black_(\d+)%\)\]/);
    expect(hoverMatch).not.toBeNull();
    expect(activeMatch).not.toBeNull();
    const hoverPct = parseInt(hoverMatch![1]!, 10);
    const activePct = parseInt(activeMatch![1]!, 10);
    // Both must be perceptible (>= 5%) and the active must be strictly darker.
    expect(hoverPct).toBeGreaterThanOrEqual(5);
    expect(activePct).toBeGreaterThan(hoverPct);
  });
});
