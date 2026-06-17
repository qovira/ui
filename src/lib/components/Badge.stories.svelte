<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Badge from "./Badge.svelte";

  const { Story } = defineMeta({
    title: "Feedback/Badge",
    component: Badge,
    tags: ["autodocs"],
  });
</script>

<!-- Compact labels. Neutral is a quiet hairline tag; status variants pair the
     semantic tint/text with a glyph so meaning is never carried by color alone. -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    // Neutral is text only — no glyph needed (it carries no status).
    const neutral = canvas.getByText("Draft").closest("span")!;
    await expect(neutral.querySelector("svg")).not.toBeInTheDocument();
    // AC: each status badge carries a glyph AND its label, never color alone.
    for (const label of ["Active", "Pending", "Failed", "Beta"]) {
      const badge = canvas.getByText(label).closest("span")!;
      await expect(badge.querySelector("svg")).toBeInTheDocument();
    }
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Badge>Draft</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="info">Beta</Badge>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Badge>Draft</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="info">Beta</Badge>
    </div>
  {/snippet}
</Story>
