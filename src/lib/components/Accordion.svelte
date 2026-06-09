<script lang="ts">
  import { Accordion } from "bits-ui";
  import { CaretDownIcon } from "phosphor-svelte";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import type { AccordionItem } from "./nav-types.js";

  interface Props {
    /** The collapsible sections. */
    items: AccordionItem[];
    /** `single` (one open at a time, default) or `multiple`. */
    type?: "single" | "multiple";
    /** Open value(s) — a `string` for single, `string[]` for multiple.
     *  `bind:value` round-trips. */
    value?: string | string[];
    /** Disables every section. */
    disabled?: boolean;
    class?: string;
    /** Renders a section's body; receives the matching item. */
    section: Snippet<[AccordionItem]>;
    onValueChange?: (value: string | string[]) => void;
  }

  let { items, type = "single", value = $bindable(), disabled = false, class: klass, section, onValueChange }: Props = $props();

  const listClass = $derived(cn("divide-y divide-border border-y border-border", klass));
</script>

<!-- Bits owns behavior: the heading/button/region ARIA, aria-expanded, and
     keyboard expand/collapse + roving focus. The wrapper dresses the parts in
     @qovira/theme utilities. The Root is branched on `type` so the single/
     multiple value union narrows to a concrete literal; the rows are shared via
     the `rows` snippet. Value is one-way + writeback (not bind:value) because
     the union won't narrow under bind — `bind:value` on THIS component still
     round-trips. The caret rotation is the disclosure motion (honors
     prefers-reduced-motion via the theme's global reset). `focus-ring` is
     appended last on the trigger so a consumer class can't strip it. -->
{#snippet rows()}
  {#each items as item (item.value)}
    <Accordion.Item value={item.value} disabled={item.disabled ?? false}>
      <Accordion.Header class="flex">
        <Accordion.Trigger
          class={cn(
            "group flex flex-1 items-center justify-between gap-2 py-4 text-left",
            "text-body font-sans font-medium text-text",
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
            "focus-ring",
          )}
        >
          {item.title}
          <CaretDownIcon
            size={18}
            color="currentColor"
            aria-hidden="true"
            class="shrink-0 text-text-muted transition-transform duration-overlay ease-qovira group-data-[state=open]:rotate-180"
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content class="overflow-hidden text-body font-sans text-text">
        <div class="pb-4">
          {@render section(item)}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
{/snippet}

{#if type === "multiple"}
  <Accordion.Root
    type="multiple"
    value={Array.isArray(value) ? value : []}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    {disabled}
    class={listClass}
  >
    {@render rows()}
  </Accordion.Root>
{:else}
  <Accordion.Root
    type="single"
    value={typeof value === "string" ? value : ""}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    {disabled}
    class={listClass}
  >
    {@render rows()}
  </Accordion.Root>
{/if}
