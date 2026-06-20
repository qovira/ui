<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Stack from "./Stack.svelte";

  type Args = Omit<ComponentProps<typeof Stack>, "children">;

  const { Story } = defineMeta({
    title: "Layout/Stack",
    component: Stack,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { gap: 4, align: "stretch" },
    argTypes: {
      gap: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16] },
      align: { control: "inline-radio", options: ["start", "center", "end", "stretch"] },
    },
    parameters: { controls: { include: ["gap", "align"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Stack {...args}>
        <div class="bg-surface-raised border-border rounded-md border p-3">First</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Second</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Third</div>
      </Stack>
    </div>
  {/snippet}
</Story>

<Story
  name="Default"
  play={async ({ canvas }) => {
    // AC: Stack produces the 8px-scale rhythm via theme spacing utilities only.
    await expect(canvas.getByTestId("stack")).toHaveClass("flex", "flex-col", "gap-4");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Stack gap={4} data-testid="stack">
        <div class="bg-surface-raised border-border rounded-md border p-3">First</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Second</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Third</div>
      </Stack>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Stack gap={4}>
        <div class="bg-surface-raised border-border rounded-md border p-3">First</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Second</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Third</div>
      </Stack>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Stack gap={4}>
        <div class="bg-surface-raised border-border rounded-md border p-3">First</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Second</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Third</div>
      </Stack>
    </div>
  {/snippet}
</Story>
