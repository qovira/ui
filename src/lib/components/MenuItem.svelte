<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { MENU_ITEM_BASE } from "../internal/menu-item.js";

  interface Props {
    children?: Snippet;
    class?: string;
    disabled?: boolean;
    /** Fires when the item is chosen (click or Enter/Space). */
    onSelect?: DropdownMenu.ItemProps["onSelect"];
    /** Delegate rendering (e.g. a SvelteKit `<a>` for client-side nav): receives `props` — including the themed `class`
     *  — to spread onto your element, so the link keeps the menuitem role, keyboard nav, and styling. */
    child?: DropdownMenu.ItemProps["child"];
  }

  let { children, class: klass, disabled = false, onSelect, child }: Props = $props();

  // `focus-ring` last so a consumer class can't merge it away. When `child` is used, Bits passes this class through
  // `props` to the delegated element.
  const classes = $derived(cn(MENU_ITEM_BASE, klass, "focus-ring"));
</script>

{#if child}
  <DropdownMenu.Item class={classes} {disabled} {...onSelect ? { onSelect } : {}} {child} />
{:else}
  <DropdownMenu.Item class={classes} {disabled} {...onSelect ? { onSelect } : {}}>
    {@render children?.()}
  </DropdownMenu.Item>
{/if}
