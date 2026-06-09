<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn } from "storybook/test";
  import Box from "./Box.svelte";

  const { Story } = defineMeta({
    title: "Foundation/Box",
    component: Box,
    tags: ["autodocs"],
    // Spy on the forwarded native handler; auto-resets between stories.
    args: { onclick: fn() },
  });
</script>

<!-- Renders in whichever theme the toolbar selects (Evening by default). -->
<Story name="Default">Hello from Qovira.</Story>

<!-- Proves a story `play` runs as a Vitest Browser-Mode test and asserts a fn() spy. -->
<Story
  name="Clickable"
  play={async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByText("Click me"));
    await expect(args.onclick).toHaveBeenCalledTimes(1);
  }}
>
  Click me
</Story>
