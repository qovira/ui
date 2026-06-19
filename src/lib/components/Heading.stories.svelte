<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Heading from "./Heading.svelte";

  type Args = Omit<ComponentProps<typeof Heading>, "children">;

  const { Story } = defineMeta({
    title: "Typography/Heading",
    component: Heading,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { level: 2, size: "h2" },
    argTypes: {
      level: { control: "inline-radio", options: [1, 2, 3, 4] },
      size: { control: "select", options: ["display", "h1", "h2", "h3", "h4"] },
    },
    // Limit the Controls panel to the scalar typographic props; children is the rendered text.
    parameters: { controls: { include: ["level", "size"] } },
  });
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Heading {...args}>The warm sanctuary</Heading>
    </div>
  {/snippet}
</Story>

<!-- The full scale. font-display (Fraunces) is applied automatically for Display/H1–H3; H4 is Figtree (font-sans) per
     the brand. -->
<Story
  name="Scale"
  play={async ({ canvas }) => {
    // AC: Heading renders with font-display without the call site specifying it.
    await expect(canvas.getByRole("heading", { level: 1, name: "Heading 1" })).toHaveClass("font-display");
    // The H4 exception: Figtree, not Fraunces.
    await expect(canvas.getByRole("heading", { level: 4 })).toHaveClass("font-sans");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col gap-4 p-6">
      <Heading level={1} size="display">Display — the warm sanctuary</Heading>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4 — sans</Heading>
    </div>
  {/snippet}
</Story>

<!-- Size is decoupled from semantic level: an `<h2>` shown at the display size. -->
<Story name="Decoupled size">
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Heading level={2} size="display">An h2, sized as display</Heading>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col gap-4 p-6">
      <Heading level={1} size="display">Display — the warm sanctuary</Heading>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4 — sans</Heading>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col gap-4 p-6">
      <Heading level={1} size="display">Display — the warm sanctuary</Heading>
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4 — sans</Heading>
    </div>
  {/snippet}
</Story>
