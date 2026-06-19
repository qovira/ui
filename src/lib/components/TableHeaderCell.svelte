<script lang="ts">
  import type { HTMLThAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import CaretDownIcon from "phosphor-svelte/lib/CaretDownIcon";
  import CaretUpDownIcon from "phosphor-svelte/lib/CaretUpDownIcon";
  import CaretUpIcon from "phosphor-svelte/lib/CaretUpIcon";
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

  // aria-sort lives on the <th> (the column header), with the button as its control — the correct sortable-header
  // pattern. The ternary already infers the exact "ascending" | "descending" | "none" literal union, so no cast is
  // needed.
  const ariaSort = $derived(sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none");

  // Unsorted shows a faint up/down caret — the affordance that the column is sortable; sorting resolves it to the
  // single direction at full strength.
  const sortIcon = $derived(sort === "asc" ? CaretUpIcon : sort === "desc" ? CaretDownIcon : CaretUpDownIcon);

  const cell = "px-4 py-3 text-left text-label font-sans uppercase text-fg-muted";
</script>

{#if sortable}
  <th scope="col" aria-sort={ariaSort} class={cn(cell, klass)} {...rest}>
    <!-- focus-ring appended last so a consumer class can't merge it away. -->
    <button
      type="button"
      class={cn(
        "group -mx-1 inline-flex items-center gap-1 rounded-sm px-1 uppercase transition-colors duration-micro ease-qovira hover:text-fg",
        "focus-ring",
      )}
      onclick={onsort}
    >
      {@render children()}
      <!-- The caret slot is always rendered so the header reserves its width up front: the column doesn't reflow when
           sorting first toggles the arrow. Unsorted, it's the faint up/down hint (brightening on hover); sorted, the
           full-strength directional caret. -->
      <Icon
        icon={sortIcon}
        decorative
        class={cn(
          "transition-opacity duration-micro ease-qovira",
          sort === "none" && "opacity-50 group-hover:opacity-100",
        )}
      />
    </button>
  </th>
{:else}
  <th scope="col" class={cn(cell, klass)} {...rest}>
    {@render children()}
  </th>
{/if}
