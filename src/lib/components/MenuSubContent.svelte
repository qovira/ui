<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { MENU_PANEL_BASE } from "../internal/menu-item.js";

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
<DropdownMenu.SubContent {sideOffset} class={cn(MENU_PANEL_BASE, klass, "focus-ring")}>
  {@render children()}
</DropdownMenu.SubContent>
