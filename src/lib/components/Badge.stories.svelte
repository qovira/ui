<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Badge from "./Badge.svelte";

  type Args = Omit<ComponentProps<typeof Badge>, "children">;

  const { Story } = defineMeta({
    title: "Feedback/Badge",
    component: Badge,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures below hardcode their own props and ignore these.
    args: { variant: "neutral" },
    argTypes: {
      variant: { control: "select", options: ["neutral", "info", "success", "warning", "error"] },
    },
    parameters: { controls: { include: ["variant"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Badge {...args}>Active</Badge>
    </div>
  {/snippet}
</Story>

<!-- Compact labels. Neutral is a quiet hairline tag; status variants pair the semantic tint/text with a glyph so meaning is never carried by color alone. -->
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

<Story name="Evening" globals={{ theme: "evening" }}>
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
