<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  // Build on Bits' own Root prop type so forwarded attributes (onOpenChange,
  // closeOnEscape, …) stay exactly compatible and `open` stays bindable.
  interface Props extends Dialog.RootProps {
    /** Extra classes merged onto the content panel. */
    class?: string;
    /** Where to portal the dialog. Defaults to `<body>`; pass a selector or
     *  element to scope it (e.g. inside a test/story container). */
    portalTo?: Dialog.PortalProps["to"];
    children: Snippet;
  }

  let { open = $bindable(false), class: klass, portalTo, children, ...rest }: Props = $props();
</script>

<!-- Bits owns behavior: focus trap, scroll lock, Escape, portalling, ARIA. The
     wrapper only dresses its parts in @qovira/theme utilities and forwards
     bind:open. `focus-ring` is appended last so a consumer class can't strip it.
     Include a <ModalTitle> in the children — it supplies the dialog's accessible
     name (Bits warns in dev if it's missing). -->
<Dialog.Root bind:open {...rest}>
  <Dialog.Portal {...portalTo ? { to: portalTo } : {}}>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-warm-900/40 backdrop-blur-sm duration-overlay ease-qovira"
    />
    <Dialog.Content
      class={cn(
        "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2",
        "rounded-xl border border-border bg-surface-raised p-6 shadow-[var(--shadow-lg)]",
        "duration-overlay ease-qovira",
        klass,
        "focus-ring",
      )}
    >
      {@render children()}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
