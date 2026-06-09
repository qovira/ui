<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Cluster from "./Cluster.svelte";

  const { Story } = defineMeta({
    title: "Layout/Cluster",
    component: Cluster,
    tags: ["autodocs"],
  });
</script>

<Story
  name="Default"
  play={async ({ canvas }) => {
    // AC: horizontal grouping with consistent gaps and wrap, theme spacing only.
    await expect(canvas.getByTestId("cluster")).toHaveClass("flex", "flex-wrap", "gap-2", "items-center");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Cluster gap={2} data-testid="cluster">
        {#each ["Inbox", "Today", "Upcoming", "Notes", "Calendar", "Reminders"] as item (item)}
          <span class="bg-surface-raised border-border rounded-sm border px-2.5 py-1">
            {item}
          </span>
        {/each}
      </Cluster>
    </div>
  {/snippet}
</Story>

<Story name="Spaced between">
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Cluster justify="between">
        <span class="bg-surface-raised border-border rounded-sm border px-2.5 py-1">Left</span>
        <span class="bg-surface-raised border-border rounded-sm border px-2.5 py-1">Right</span>
      </Cluster>
    </div>
  {/snippet}
</Story>
