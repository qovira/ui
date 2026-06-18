<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Container from "./Container.svelte";
  import Text from "./Text.svelte";

  const { Story } = defineMeta({
    title: "Layout/Container",
    component: Container,
    tags: ["autodocs"],
  });
</script>

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
