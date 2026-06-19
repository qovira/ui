<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Container from "./Container.svelte";
  import Text from "./Text.svelte";

  type Args = Omit<ComponentProps<typeof Container>, "children">;

  const { Story } = defineMeta({
    title: "Layout/Container",
    component: Container,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { width: "content" },
    argTypes: {
      width: { control: "inline-radio", options: ["content", "prose"] },
    },
    parameters: { controls: { include: ["width"] } },
  });
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg">
      <Container {...args}>
        <Text>Page content is centered and capped by the width control above.</Text>
      </Container>
    </div>
  {/snippet}
</Story>

<Story
  name="Content width"
  play={async ({ canvas }) => {
    // AC: Container enforces the max-width rule (content ~960px).
    await expect(canvas.getByTestId("container")).toHaveClass("max-w-240", "mx-auto");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg">
      <Container data-testid="container">
        <Text>Page content is centered and capped at ~960px for a calm layout.</Text>
      </Container>
    </div>
  {/snippet}
</Story>

<Story
  name="Prose width"
  play={async ({ canvas }) => {
    await expect(canvas.getByTestId("container")).toHaveClass("max-w-[70ch]");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg">
      <Container width="prose" data-testid="container">
        <Text
          >Prose caps the measure at ~70 characters so long-form reading stays comfortable rather than stretching the
          full width of the viewport.</Text
        >
      </Container>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg">
      <Container>
        <Text>Page content is centered and capped at ~960px for a calm layout.</Text>
      </Container>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg">
      <Container>
        <Text>Page content is centered and capped at ~960px for a calm layout.</Text>
      </Container>
    </div>
  {/snippet}
</Story>
