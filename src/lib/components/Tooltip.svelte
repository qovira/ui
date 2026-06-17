<script lang="ts">
  import { Tooltip } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    /** Open state. `bind:open` for two-way; `onOpenChange` fires either way. */
    open?: boolean;
    /** The element the hint describes. Receives `props` to spread onto your own
     *  element so hover/focus/ARIA stay wired (Bits' `child` delegation). The
     *  trigger must carry its own meaning — a tooltip is never the sole label. */
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    /** The hint content. Supplementary only — never the lone carrier of meaning. */
    children: Snippet;
    /** Hover delay before showing, in ms. (Focus shows immediately.) */
    delayDuration?: number;
    /** Gap from the trigger, in px. */
    sideOffset?: number;
    /** Preferred side; Bits flips it on collision. */
    side?: Tooltip.ContentProps["side"];
    /** Merged onto the tip. */
    class?: string;
    /** Where to portal the tip. Defaults to `<body>`. */
    portalTo?: Tooltip.PortalProps["to"];
    onOpenChange?: (open: boolean) => void;
  }

  let {
    open = $bindable(false),
    trigger,
    children,
    delayDuration = 300,
    sideOffset = 6,
    side,
    class: klass,
    portalTo,
    onOpenChange,
  }: Props = $props();
</script>

<!-- Bits owns behavior: it shows on hover AND keyboard focus, hides on blur /
     Escape / pointer-leave, positions with collision handling, and wires the
     trigger's aria-describedby to the tip. The wrapper only dresses the tip in
     @qovira/theme utilities. The trigger delegates to the consumer's element via
     Bits' `child` snippet — that element carries the real, non-tooltip-only
     meaning. -->
<Tooltip.Provider {delayDuration}>
  <Tooltip.Root bind:open {...onOpenChange ? { onOpenChange } : {}}>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        {@render trigger({ props })}
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal {...portalTo ? { to: portalTo } : {}}>
      <Tooltip.Content
        {sideOffset}
        {...side ? { side } : {}}
        class={cn(
          "z-50 max-w-xs rounded-md border border-border bg-surface-raised px-2.5 py-1.5",
          "text-small font-sans text-fg shadow-[var(--shadow-md)]",
          "duration-overlay ease-qovira",
          klass,
        )}
      >
        {@render children()}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
