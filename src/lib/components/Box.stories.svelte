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

<!--
  Affordance only — cursor + hover border signal interactivity visually.
  Use Button for real interactive semantics (keyboard activation, role="button").
-->
<Story
  name="Clickable"
  args={{ class: "cursor-pointer transition-colors hover:border-accent" }}
  play={async ({ args, canvas, userEvent }) => {
    const box = canvas.getByText("Click me");
    // cursor-pointer is a static class (no :hover gate) so getComputedStyle resolves it
    // in real Chromium. Must be "pointer" once the class is present.
    await expect(getComputedStyle(box).cursor).toBe("pointer");
    // Pin class presence for the hover affordance (CSS :hover is not triggered by
    // userEvent.hover in Browser Mode, so we assert the class is wired rather than
    // trying to inspect the computed border colour).
    await expect(box).toHaveClass("hover:border-accent");
    await expect(box).toHaveClass("cursor-pointer");
    await userEvent.click(box);
    await expect(args.onclick).toHaveBeenCalledTimes(1);
  }}
>
  Click me
</Story>
