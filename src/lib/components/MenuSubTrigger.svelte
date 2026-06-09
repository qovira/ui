<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import { CaretRightIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { MENU_ITEM_BASE } from "../internal/menu-item.js";

  interface Props {
    children: Snippet;
    class?: string;
    disabled?: boolean;
  }

  let { children, class: klass, disabled = false }: Props = $props();
</script>

<!-- Opens its `Menu.SubContent`. Same row styling as `Menu.Item`, with a caret
     affordance. `focus-ring` last so a consumer class can't strip it. -->
<DropdownMenu.SubTrigger
  class={cn(MENU_ITEM_BASE, "justify-between", klass, "focus-ring")}
  {disabled}
>
  {@render children()}
  <CaretRightIcon
    size={16}
    color="currentColor"
    aria-hidden="true"
    class="shrink-0 text-text-muted"
  />
</DropdownMenu.SubTrigger>
