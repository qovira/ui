<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Text from "./Text.svelte";

  const { Story } = defineMeta({
    title: "Typography/Text",
    component: Text,
    tags: ["autodocs"],
  });
</script>

<Story
  name="Variants"
  play={async ({ canvas }) => {
    // Body binds the text-body role on Figtree and the primary text color.
    const body = canvas.getByText("Body — the default reading size.");
    await expect(body).toHaveClass("text-body", "font-sans", "text-fg");
    // Muted uses the secondary color role.
    await expect(canvas.getByText(/Muted body/)).toHaveClass("text-fg-muted");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col gap-3 p-6">
      <Text variant="lead">Lead — a slightly larger intro line.</Text>
      <Text>Body — the default reading size.</Text>
      <Text variant="small">Small — secondary details.</Text>
      <Text variant="label">Label</Text>
      <Text variant="code" as="span">const greeting = "hello";</Text>
      <Text tone="muted">Muted body — timestamps, counts, hints.</Text>
    </div>
  {/snippet}
</Story>
