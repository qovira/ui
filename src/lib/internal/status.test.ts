import { describe, expect, it } from "vitest";
import { BADGE_TONE } from "./status.js";

describe("BADGE_TONE", () => {
  // Every tone carries a border so neutral and status variants are visually consistent (F1). Neutral has no status tint
  // to carry contrast, so it uses the stronger `border-divider` to stay legible against the Evening surfaces; the
  // status tones keep the hairline `border-border` and lean on their tint instead.
  const variants = ["neutral", "info", "success", "warning", "error"] as const;
  const statusVariants = ["info", "success", "warning", "error"] as const;

  it.each(variants)('"%s" includes a border utility', (variant) => {
    const classes = BADGE_TONE[variant].split(" ");
    expect(classes).toContain("border");
  });

  it("neutral uses the stronger divider edge so it reads on the Evening surfaces", () => {
    const classes = BADGE_TONE.neutral.split(" ");
    expect(classes).toContain("border-divider");
    expect(classes).not.toContain("border-border");
  });

  it.each(statusVariants)('"%s" keeps the hairline border-border', (variant) => {
    const classes = BADGE_TONE[variant].split(" ");
    expect(classes).toContain("border-border");
  });

  it("status tones keep their tint background", () => {
    expect(BADGE_TONE.info).toContain("bg-tint-info");
    expect(BADGE_TONE.success).toContain("bg-tint-success");
    expect(BADGE_TONE.warning).toContain("bg-tint-warning");
    expect(BADGE_TONE.error).toContain("bg-tint-error");
  });

  it("status tones keep their semantic text color", () => {
    expect(BADGE_TONE.info).toContain("text-fg-info");
    expect(BADGE_TONE.success).toContain("text-fg-success");
    expect(BADGE_TONE.warning).toContain("text-fg-warning");
    expect(BADGE_TONE.error).toContain("text-fg-error");
  });
});
