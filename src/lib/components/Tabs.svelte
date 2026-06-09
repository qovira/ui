<script lang="ts">
  import { Tabs } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import type { TabItem } from "./nav-types.js";

  interface Props {
    /** The tabs — each drives a trigger and a panel. */
    items: TabItem[];
    /** Active tab value. `bind:value` round-trips; defaults to the first tab. */
    value?: string;
    /** Layout direction of the tablist. */
    orientation?: "horizontal" | "vertical";
    class?: string;
    /** Merged onto each panel. */
    panelClass?: string;
    /** Renders the active panel's body; receives the matching item. */
    panel: Snippet<[TabItem]>;
    onValueChange?: (value: string) => void;
  }

  let {
    items,
    value = $bindable(items[0]?.value),
    orientation = "horizontal",
    class: klass,
    panelClass,
    panel,
    onValueChange,
  }: Props = $props();
</script>

<!-- Bits owns behavior: the tablist/tab/tabpanel roles, arrow-key roving focus,
     and aria-controls/aria-selected wiring. The wrapper dresses the parts in
     @qovira/theme utilities and forwards bind:value. `focus-ring` is appended
     last on every focusable part (triggers and the panel) so a consumer class
     can't strip it. -->
<Tabs.Root
  bind:value
  {orientation}
  {...onValueChange ? { onValueChange } : {}}
  class={cn("flex flex-col gap-3", klass)}
>
  <Tabs.List class="flex gap-1 border-b border-border">
    {#each items as item (item.value)}
      <Tabs.Trigger
        value={item.value}
        disabled={item.disabled}
        class={cn(
          "-mb-px border-b-2 border-transparent px-4 py-2 text-button font-sans text-text-muted",
          "hover:text-text data-[state=active]:border-accent data-[state=active]:text-text",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
          "focus-ring",
        )}
      >
        {item.label}
      </Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#each items as item (item.value)}
    <Tabs.Content
      value={item.value}
      class={cn("text-body font-sans text-text", panelClass, "focus-ring")}
    >
      {@render panel(item)}
    </Tabs.Content>
  {/each}
</Tabs.Root>
