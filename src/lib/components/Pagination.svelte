<script lang="ts">
  import { Pagination } from "bits-ui";
  import { CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    /** Total number of items being paginated. */
    count: number;
    /** Items per page. */
    perPage?: number;
    /** Current page (1-based). `bind:page` round-trips. */
    page?: number;
    /** Pages shown either side of the current page before ellipsis. */
    siblingCount?: number;
    class?: string;
    /** Names the navigation landmark. */
    "aria-label"?: string;
    onPageChange?: (page: number) => void;
  }

  let { count, perPage = 10, page = $bindable(1), siblingCount = 1, class: klass, "aria-label": ariaLabel, onPageChange }: Props = $props();

  // Names the navigation landmark; defaults when the consumer doesn't pass one.
  const navLabel = $derived(ariaLabel ?? "Pagination");

  const pageBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-button font-sans text-text hover:bg-surface data-[selected]:bg-accent data-[selected]:text-warm-900";
  const navBase = "inline-flex h-9 w-9 items-center justify-center rounded-md text-text hover:bg-surface disabled:pointer-events-none disabled:opacity-40";
</script>

<!-- Bits owns behavior: page computation (with ellipses), keyboard navigation,
     and the current-page `data-selected`/`aria-label` wiring on each page
     button. The Root renders a plain <div>, so the wrapper provides the
     navigation landmark. Prev/Next are icon-only, so they carry their own
     accessible names. `focus-ring` is appended last on every button so a
     consumer class can't strip it. -->
<nav aria-label={navLabel}>
  <Pagination.Root {count} {perPage} {siblingCount} bind:page {...onPageChange ? { onPageChange } : {}} class={cn("flex items-center gap-1", klass)}>
    {#snippet children({ pages })}
      <Pagination.PrevButton aria-label="Go to previous page" class={cn(navBase, "focus-ring")}>
        <CaretLeftIcon size={18} color="currentColor" aria-hidden="true" />
      </Pagination.PrevButton>
      {#each pages as p (p.key)}
        {#if p.type === "ellipsis"}
          <span class="px-2 text-text-muted" aria-hidden="true">…</span>
        {:else}
          <Pagination.Page page={p} class={cn(pageBase, "focus-ring")}>
            {p.value}
          </Pagination.Page>
        {/if}
      {/each}
      <Pagination.NextButton aria-label="Go to next page" class={cn(navBase, "focus-ring")}>
        <CaretRightIcon size={18} color="currentColor" aria-hidden="true" />
      </Pagination.NextButton>
    {/snippet}
  </Pagination.Root>
</nav>
