<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Stack from "./Stack.svelte";

  const { Story } = defineMeta({
    title: "Layout/Stack",
    component: Stack,
    tags: ["autodocs"],
  });
</script>

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

<Story name="Tighter rhythm">
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Stack gap={2}>
        <div class="bg-surface-raised border-border rounded-md border p-3">First</div>
        <div class="bg-surface-raised border-border rounded-md border p-3">Second</div>
      </Stack>
    </div>
  {/snippet}
</Story>
