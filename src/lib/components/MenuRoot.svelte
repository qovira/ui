<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    /** Open state. `bind:open` for two-way; `onOpenChange` fires either way. */
    open?: boolean;
    children: Snippet;
    onOpenChange?: (open: boolean) => void;
  }

  let { open = $bindable(false), children, onOpenChange }: Props = $props();
</script>

<!-- Bits owns the menu behavior: roving focus, type-ahead, keyboard nav, the menu/menuitem ARIA roles, portalling and
     collision handling on the content. This wrapper only forwards bind:open. -->
<DropdownMenu.Root bind:open {...onOpenChange ? { onOpenChange } : {}}>
  {@render children()}
</DropdownMenu.Root>
