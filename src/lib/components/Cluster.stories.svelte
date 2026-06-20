<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Cluster from "./Cluster.svelte";

  type Args = Omit<ComponentProps<typeof Cluster>, "children">;

  const { Story } = defineMeta({
    title: "Layout/Cluster",
    component: Cluster,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { gap: 2, align: "center", justify: "start", wrap: true },
    argTypes: {
      gap: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] },
      align: { control: "select", options: ["start", "center", "end", "baseline", "stretch"] },
      justify: { control: "inline-radio", options: ["start", "center", "end", "between"] },
      wrap: { control: "boolean" },
    },
    parameters: { controls: { include: ["gap", "align", "justify", "wrap"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Cluster {...args}>
        {#each ["Inbox", "Today", "Upcoming", "Notes", "Calendar", "Reminders"] as item (item)}
          <span class="bg-surface-raised border-border rounded-sm border px-2.5 py-1">
            {item}
          </span>
        {/each}
      </Cluster>
    </div>
  {/snippet}
</Story>

<Story
  name="Default"
  play={async ({ canvas }) => {
    // AC: horizontal grouping with consistent gaps and wrap, theme spacing only.
    await expect(canvas.getByTestId("cluster")).toHaveClass("flex", "flex-wrap", "gap-2", "items-center");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
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

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Cluster gap={2}>
        {#each ["Inbox", "Today", "Upcoming", "Notes", "Calendar", "Reminders"] as item (item)}
          <span class="bg-surface-raised border-border rounded-sm border px-2.5 py-1">
            {item}
          </span>
        {/each}
      </Cluster>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Cluster gap={2}>
        {#each ["Inbox", "Today", "Upcoming", "Notes", "Calendar", "Reminders"] as item (item)}
          <span class="bg-surface-raised border-border rounded-sm border px-2.5 py-1">
            {item}
          </span>
        {/each}
      </Cluster>
    </div>
  {/snippet}
</Story>
