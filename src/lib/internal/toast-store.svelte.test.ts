import { describe, expect, it, vi } from "vitest";
import { registerActiveToastStore, toast, ToastStore } from "./toast-store.svelte.js";

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

describe("imperative toast API", () => {
  it("warns and returns undefined when no provider is active", () => {
    // Drop any active registration first, so we exercise the no-provider path.
    registerActiveToastStore(new ToastStore())();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const id = toast.info("Before a provider mounted.");

    expect(id).toBeUndefined();
    expect(warn).toHaveBeenCalledOnce();
  });

  it("routes a toast to the active store and returns its id", () => {
    const store = new ToastStore();
    const dispose = registerActiveToastStore(store);

    const id = toast.success("Saved.");

    expect(id).toBeDefined();
    expect(store.toasts).toHaveLength(1);
    expect(store.toasts[0]).toMatchObject({ variant: "success", message: "Saved." });
    dispose();
  });

  it("last provider to mount wins; an earlier unmount can't wipe a later registration", () => {
    const a = new ToastStore();
    const b = new ToastStore();
    const disposeA = registerActiveToastStore(a);
    const disposeB = registerActiveToastStore(b); // b is now the active target

    disposeA(); // a's disposer must NOT clear b (the `active === store` guard)
    const id = toast.info("Goes to b.");

    expect(id).toBeDefined();
    expect(b.toasts).toHaveLength(1);
    expect(a.toasts).toHaveLength(0);
    disposeB();
  });

  it("toast.dismiss delegates to the active store", () => {
    const store = new ToastStore();
    const dispose = registerActiveToastStore(store);
    const id = store.add("info", "Dismiss me.");

    toast.dismiss(id);

    expect(store.toasts).toHaveLength(0);
    dispose();
  });
});
