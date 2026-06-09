import { describe, expect, it } from "vitest";
import { ToastStore } from "./toast-store.svelte.js";

describe("ToastStore", () => {
  it("keeps state per instance — no module-level shared array (SSR-safe)", () => {
    const a = new ToastStore();
    const b = new ToastStore();

    a.add("success", "Saved your changes.");

    // Two stores must not share state, or toasts would leak across SSR requests.
    expect(a.toasts).toHaveLength(1);
    expect(b.toasts).toHaveLength(0);
  });

  it("carries variant + message and defaults the duration", () => {
    const store = new ToastStore();

    store.add("warning", "Storage is nearly full.");

    expect(store.toasts[0]).toMatchObject({
      variant: "warning",
      message: "Storage is nearly full.",
      duration: 5000,
    });
  });

  it("honours an explicit duration", () => {
    const store = new ToastStore();
    store.add("info", "FYI", { duration: 1000 });
    expect(store.toasts[0]?.duration).toBe(1000);
  });

  it("dismiss removes only the matching toast", () => {
    const store = new ToastStore();
    const id = store.add("error", "Failed.");
    store.add("info", "Still here.");

    store.dismiss(id);

    expect(store.toasts.map((t) => t.message)).toEqual(["Still here."]);
  });

  it("hands back unique ids", () => {
    const store = new ToastStore();
    expect(store.add("info", "one")).not.toBe(store.add("info", "two"));
  });
});
