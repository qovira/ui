<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Chip from "./Chip.svelte";

  const { Story } = defineMeta({
    title: "Feedback/Chip",
    component: Chip,
    tags: ["autodocs"],
  });
</script>

<!-- Compact labels, like Badge: neutral hairline or a status (tint/text + glyph,
     never color alone). -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    const neutral = canvas.getByText("Personal").closest("span")!;
    await expect(neutral.querySelector("svg")).not.toBeInTheDocument();
    // AC: status chips carry a glyph AND a label, never color alone.
    for (const label of ["Synced", "Syncing", "Error"]) {
      const chip = canvas.getByText(label).closest("span")!;
      await expect(chip.querySelector("svg")).toBeInTheDocument();
    }
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text flex flex-wrap items-center gap-2 p-6">
      <Chip>Personal</Chip>
      <Chip variant="success">Synced</Chip>
      <Chip variant="warning">Syncing</Chip>
      <Chip variant="error">Error</Chip>
    </div>
  {/snippet}
</Story>

<!-- With `href`, the chip morphs into a navigable link, same look and states.
     It carries the focus-ring (the static span doesn't). -->
<Story
  name="As link"
  play={async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Archive" });
    await expect(link).toHaveAttribute("href", "/archive");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text flex flex-wrap items-center gap-2 p-6">
      <Chip href="/archive">Archive</Chip>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text flex flex-wrap items-center gap-2 p-6">
      <Chip>Personal</Chip>
      <Chip variant="success">Synced</Chip>
      <Chip variant="warning">Syncing</Chip>
      <Chip variant="error">Error</Chip>
      <Chip href="/archive">Archive</Chip>
    </div>
  {/snippet}
</Story>
