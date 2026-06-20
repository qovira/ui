import { getContext, setContext } from "svelte";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  /** Auto-dismiss delay in ms (the timer pauses on hover/focus). Default 5000. */
  duration?: number;
}

export interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
  duration: number;
}

/**
 * The toast queue. State lives on the instance (a `$state` array), so each `<ToastProvider>` owns its own toasts —
 * there is NO module-level toast data, which is what keeps it SSR-safe (a top-level array would bleed across requests).
 * Verified in `toast-store.svelte.test.ts`.
 */
export class ToastStore {
  // Replace-only queue of immutable records (no field of a mounted toast is ever mutated in place), so `raw` skips the
  // per-element deep proxy; `add`/`dismiss` both reassign the array.
  toasts = $state.raw<ToastData[]>([]);
  #seq = 0;

  add(variant: ToastVariant, message: string, options?: ToastOptions): string {
    const id = `toast-${this.#seq++}`;
    this.toasts = [...this.toasts, { id, variant, message, duration: options?.duration ?? 5000 }];
    return id;
  }

  dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}

const KEY = Symbol("qovira-toast");

export function setToastStore(store: ToastStore): void {
  setContext(KEY, store);
}

/** Read the enclosing toast store (for components rendered inside a provider). */
export function getToastStore(): ToastStore {
  const store = getContext<ToastStore | undefined>(KEY);
  if (!store) {
    throw new Error("getToastStore() must be called within a <ToastProvider>.");
  }
  return store;
}

// The imperative API reaches the mounted provider's store from anywhere — including code with no component context
// (event handlers, load results). The provider registers its store here ON MOUNT (client only). This holds only a
// *reference*, never toast data: the data lives in the context-seeded store, so nothing crosses SSR requests (effects
// don't run server-side, so this stays null there). Last provider to mount wins, matching the single-provider design.
let active: ToastStore | null = null;

/**
 * Register a provider's store as the imperative API's target; returns a disposer that clears it **only if still
 * active**, so an earlier provider unmounting can't wipe a later one's registration (last mount wins).
 */
export function registerActiveToastStore(store: ToastStore): () => void {
  active = store;
  return () => {
    if (active === store) {
      active = null;
    }
  };
}

function emit(variant: ToastVariant, message: string, options?: ToastOptions): string | undefined {
  if (!active) {
    console.warn(`[@qovira/ui] toast.${variant}() called before a <ToastProvider> mounted.`);
    return undefined;
  }
  return active.add(variant, message, options);
}

/**
 * Imperative toast API — raise a notification from anywhere:
 * `import { toast } from "@qovira/ui"; toast.success("Saved.")`.
 * Requires a `<ToastProvider>` mounted near the app root.
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => emit("success", message, options),
  error: (message: string, options?: ToastOptions) => emit("error", message, options),
  warning: (message: string, options?: ToastOptions) => emit("warning", message, options),
  info: (message: string, options?: ToastOptions) => emit("info", message, options),
  dismiss: (id: string) => active?.dismiss(id),
};
