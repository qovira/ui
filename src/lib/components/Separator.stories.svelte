<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Separator from "./Separator.svelte";
  import Text from "./Text.svelte";

  const { Story } = defineMeta({
    title: "Layout/Separator",
    component: Separator,
    tags: ["autodocs"],
  });
</script>

<Story
  name="Horizontal"
  play={async ({ canvas }) => {
    // AC: non-decorative separator carries the separator role (Bits ARIA).
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Text>Above the line</Text>
      <Separator class="my-3" />
      <Text>Below the line</Text>
    </div>
  {/snippet}
</Story>

<Story
  name="Vertical"
  play={async ({ canvas }) => {
    // AC: both orientations with correct ARIA.
    await expect(canvas.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex h-12 items-center gap-3 p-6">
      <Text>Left</Text>
      <Separator orientation="vertical" />
      <Text>Right</Text>
    </div>
  {/snippet}
</Story>
