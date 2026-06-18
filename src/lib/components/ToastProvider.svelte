<script lang="ts">
  import { Dialog, Portal } from "bits-ui";
  import type { Snippet } from "svelte";
  import { ToastStore, registerActiveToastStore, setToastStore } from "../internal/toast-store.svelte.js";
  import Toast from "./Toast.svelte";

  interface Props {
    /** Where to portal the toast stack. Defaults to `<body>`. */
    portalTo?: Dialog.PortalProps["to"];
    /** The app this provider wraps. */
    children?: Snippet;
  }

  let { portalTo, children }: Props = $props();

  // Per-instance (per-request) store, seeded into context — never a module
  // singleton, so toasts can't leak across SSR requests.
  const store = new ToastStore();
  setToastStore(store);

  // Client-only: register this provider as the imperative API's target (the
  // disposer clears it only if still active). SSR never runs effects, so nothing
  // crosses requests.
  $effect(() => registerActiveToastStore(store));
</script>

{@render children?.()}

<Portal {...portalTo ? { to: portalTo } : {}}>
  <!-- Positioning only; click-through (each toast re-enables its own pointer
       events). Each toast carries role="status", its own polite live region, so
       it's announced on insert without nesting live regions here. -->
  <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-90 flex-col gap-2">
    {#each store.toasts as toast (toast.id)}
      <Toast {toast} ondismiss={() => store.dismiss(toast.id)} />
    {/each}
  </div>
</Portal>
