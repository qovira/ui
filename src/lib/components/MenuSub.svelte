<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    /** Submenu open state. `bind:open` for two-way. */
    open?: boolean;
    children: Snippet;
    onOpenChange?: (open: boolean) => void;
  }

  let { open = $bindable(false), children, onOpenChange }: Props = $props();
</script>

<!-- A nested submenu. Wrap a `Menu.SubTrigger` and a `Menu.SubContent`. -->
<DropdownMenu.Sub bind:open {...onOpenChange ? { onOpenChange } : {}}>
  {@render children()}
</DropdownMenu.Sub>
