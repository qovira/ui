import { describe, expect, it } from "vitest";
import { cn } from "./cn.js";

describe("cn", () => {
  it("joins truthy class values", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("lets a later Tailwind utility win a conflict (tailwind-merge)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-surface", "bg-surface-raised")).toBe("bg-surface-raised");
  });

  it("keeps a theme typographic role alongside a text color (distinct groups)", () => {
    // The theme's `text-<role>` (font-size) must not be merged away by a
    // `text-<color>` — both appear in the theme's own recipes.
    expect(cn("text-body", "text-fg")).toBe("text-body text-fg");
    expect(cn("font-display", "text-h1", "text-fg")).toBe("font-display text-h1 text-fg");
  });

  it("still collapses two competing typographic roles to the last", () => {
    expect(cn("text-body", "text-h1")).toBe("text-h1");
  });
});
