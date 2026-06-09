<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    children: Snippet;
    /** Gap from the sub-trigger, in px. */
    sideOffset?: number;
    class?: string;
  }

  let { children, sideOffset = 0, class: klass }: Props = $props();
</script>

<!-- Bits positions and collision-handles the submenu panel within the menu's
     floating context. `focus-ring` last so a consumer class can't strip it. -->
<DropdownMenu.SubContent
  {sideOffset}
  class={cn(
    "z-50 min-w-[10rem] rounded-xl border border-border bg-surface-raised p-1.5 text-text shadow-[var(--shadow-lg)]",
    "duration-overlay ease-qovira",
    klass,
    "focus-ring",
  )}
>
  {@render children()}
</DropdownMenu.SubContent>
