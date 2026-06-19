<script lang="ts">
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    /** Open state. `bind:open` for two-way; `onOpenChange` fires either way. */
    open?: boolean;
    /** The anchor. Receives `props` to spread onto your own element (a Button, a router link) so Bits' behavior/ARIA
     *  stay wired — `child` delegation surfaced one level up. */
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    /** The floating panel's body. */
    children: Snippet;
    /** Gap from the anchor, in px. */
    sideOffset?: number;
    /** Preferred side; Bits flips it on collision. */
    side?: Popover.ContentProps["side"];
    /** Alignment along the side. */
    align?: Popover.ContentProps["align"];
    /** Merged onto the panel. */
    class?: string;
    /** Where to portal the panel. Defaults to `<body>`. */
    portalTo?: Popover.PortalProps["to"];
    onOpenChange?: (open: boolean) => void;
  }

  let {
    open = $bindable(false),
    trigger,
    children,
    sideOffset = 8,
    side,
    align,
    class: klass,
    portalTo,
    onOpenChange,
  }: Props = $props();
</script>

<!-- Bits owns behavior: anchoring, collision-aware positioning, focus management, Escape, portalling, ARIA. The wrapper
     dresses the panel in @qovira/theme utilities and forwards bind:open. The trigger delegates to the consumer's
     element via Bits' `child` snippet, so a Button or a router link stays the real trigger. `focus-ring` is appended
     last so a consumer class can't strip it. -->
<Popover.Root bind:open {...onOpenChange ? { onOpenChange } : {}}>
  <Popover.Trigger>
    {#snippet child({ props })}
      {@render trigger({ props })}
    {/snippet}
  </Popover.Trigger>
  <Popover.Portal {...portalTo ? { to: portalTo } : {}}>
    <Popover.Content
      {sideOffset}
      {...side ? { side } : {}}
      {...align ? { align } : {}}
      class={cn(
        "z-50 w-72 rounded-xl border border-border bg-surface-raised p-4 text-fg shadow-(--shadow-lg)",
        "duration-overlay ease-qovira",
        klass,
        "focus-ring",
      )}
    >
      {@render children()}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>
