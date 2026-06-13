<script lang="ts">
  import type { HTMLThAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { CaretDownIcon, CaretUpIcon } from "phosphor-svelte";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
  import type { TableSortDirection } from "./table-types.js";

  interface Props extends HTMLThAttributes {
    /** Make the column header an interactive sort toggle. */
    sortable?: boolean;
    /** Current sort state — drives `aria-sort` and the caret indicator. */
    sort?: TableSortDirection;
    /** Fired when a sortable header is activated. */
    onsort?: () => void;
    class?: string;
    children: Snippet;
  }

  let { sortable = false, sort = "none", onsort, class: klass, children, ...rest }: Props = $props();

  // aria-sort lives on the <th> (the column header), with the button as its
  // control — the correct sortable-header pattern. The ternary already infers the
  // exact "ascending" | "descending" | "none" literal union, so no cast is needed.
  const ariaSort = $derived(sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none");

  const cell = "px-4 py-3 text-left text-label font-sans uppercase text-text-muted";
</script>

{#if sortable}
  <th scope="col" aria-sort={ariaSort} class={cn(cell, klass)} {...rest}>
    <!-- focus-ring appended last so a consumer class can't merge it away. -->
    <button
      type="button"
      class={cn(
        "-mx-1 inline-flex items-center gap-1 rounded px-1 transition-colors duration-micro ease-qovira hover:text-text",
        "focus-ring",
      )}
      onclick={onsort}
    >
      {@render children()}
      {#if sort === "asc"}
        <Icon icon={CaretUpIcon} decorative />
      {:else if sort === "desc"}
        <Icon icon={CaretDownIcon} decorative />
      {/if}
    </button>
  </th>
{:else}
  <th scope="col" class={cn(cell, klass)} {...rest}>
    {@render children()}
  </th>
{/if}
