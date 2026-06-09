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
});
