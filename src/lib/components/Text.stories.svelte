<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Text from "./Text.svelte";

  type Args = Omit<ComponentProps<typeof Text>, "children">;

  const { Story } = defineMeta({
    title: "Typography/Text",
    component: Text,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { variant: "body", tone: "default", as: "p" },
    argTypes: {
      variant: { control: "select", options: ["body", "lead", "small", "label", "code"] },
      tone: { control: "inline-radio", options: ["default", "muted"] },
      as: { control: "inline-radio", options: ["p", "span", "div"] },
    },
    // Limit the Controls panel to the scalar typographic props; children is the rendered text.
    parameters: { controls: { include: ["variant", "tone", "as"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Text {...args}>The default reading size.</Text>
    </div>
  {/snippet}
</Story>

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

<Story name="Daylight" globals={{ theme: "daylight" }}>
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

<Story name="Evening" globals={{ theme: "evening" }}>
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
