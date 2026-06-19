<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Separator from "./Separator.svelte";
  import Text from "./Text.svelte";

  type Args = ComponentProps<typeof Separator>;

  const { Story } = defineMeta({
    title: "Layout/Separator",
    component: Separator,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { orientation: "horizontal", decorative: false },
    argTypes: {
      orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
      decorative: { control: "boolean" },
    },
    parameters: { controls: { include: ["orientation", "decorative"] } },
  });
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Text>Left</Text>
      <Separator {...args} />
      <Text>Right</Text>
    </div>
  {/snippet}
</Story>

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

<!-- Regression test: a vertical separator in a plain block container (no flex/grid parent) must have non-zero height.
     With `self-stretch` alone the height collapses to 0; the `min-h` fallback makes it visible anywhere. -->
<Story
  name="VerticalInBlock"
  play={async ({ canvas }) => {
    const sep = canvas.getByRole("separator");
    // ARIA: vertical orientation is declared correctly even outside a flex parent.
    await expect(sep).toHaveAttribute("aria-orientation", "vertical");
    // Regression guard: height must be non-zero — `self-stretch` alone collapses to 0 in a block container.
    const height = sep.getBoundingClientRect().height;
    await expect(height).toBeGreaterThan(0);
  }}
>
  {#snippet template()}
    <!-- Plain block div — intentionally NOT flex/grid — to expose the vertical-collapse bug. -->
    <div class="bg-surface text-fg p-6">
      <Separator orientation="vertical" />
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Text>Above the line</Text>
      <Separator class="my-3" />
      <Text>Below the line</Text>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Text>Above the line</Text>
      <Separator class="my-3" />
      <Text>Below the line</Text>
    </div>
  {/snippet}
</Story>
