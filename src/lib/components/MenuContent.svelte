<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { MENU_PANEL_BASE } from "../internal/menu-item.js";

  interface Props {
    children: Snippet;
    /** Gap from the trigger, in px. */
    sideOffset?: number;
    class?: string;
    /** Where to portal the menu. Defaults to `<body>`. */
    portalTo?: DropdownMenu.PortalProps["to"];
  }

  let { children, sideOffset = 6, class: klass, portalTo }: Props = $props();
</script>

<!-- Portalled and collision-handled by Bits. `focus-ring` is appended last so a
     consumer class can't strip it. -->
<DropdownMenu.Portal {...portalTo ? { to: portalTo } : {}}>
  <DropdownMenu.Content {sideOffset} class={cn(MENU_PANEL_BASE, klass, "focus-ring")}>
    {@render children()}
  </DropdownMenu.Content>
</DropdownMenu.Portal>
