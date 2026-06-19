<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Box from "./Box.svelte";

  type Args = ComponentProps<typeof Box>;

  const { Story } = defineMeta({
    title: "Foundation/Box",
    component: Box,
    tags: ["autodocs"],
    // Spy on the forwarded native handler; auto-resets between stories. Box is a pure styled surface — it exposes no
    // scalar layout props, so the Playground drives nothing beyond children (args is empty, no argTypes).
    args: { onclick: fn() },
  });
</script>

<!-- Controls playground. Box has no controllable scalar props (only `class`, native attrs, and a children snippet), so
there are no controls to drive — it's here for uniformity. The fixtures below hardcode props for deterministic tests. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Box {...args}>Hello from Qovira.</Box>
    </div>
  {/snippet}
</Story>

<!-- Renders in whichever theme the toolbar selects (Evening by default). -->
<Story name="Default">Hello from Qovira.</Story>

<!-- Affordance only — cursor + hover border signal interactivity visually. Use Button for real interactive semantics
     (keyboard activation, role="button"). -->
<Story
  name="Clickable"
  args={{ class: "cursor-pointer transition-colors hover:border-accent" }}
  play={async ({ args, canvas, userEvent }) => {
    const box = canvas.getByText("Click me");
    // cursor-pointer is a static class (no :hover gate) so getComputedStyle resolves it in real Chromium. Must be
    // "pointer" once the class is present.
    await expect(getComputedStyle(box).cursor).toBe("pointer");
    // Pin class presence for the hover affordance (CSS :hover is not triggered by userEvent.hover in Browser Mode, so
    // we assert the class is wired rather than trying to inspect the computed border colour).
    await expect(box).toHaveClass("hover:border-accent");
    await expect(box).toHaveClass("cursor-pointer");
    await userEvent.click(box);
    await expect(args.onclick).toHaveBeenCalledTimes(1);
  }}
>
  Click me
</Story>

<!-- Proves that the per-story ThemeWrapper themes its subtree independently of `<html data-theme>`. This is the
     critical Docs-page correctness test: on the Docs page all story blocks share one document `<html>`, so without a
     wrapper each block clobbers the previous one (last renderer wins). This story runs under the default "evening"
     global and forcibly sets `<html>` to "daylight" in the play to simulate the clobbering scenario; the wrapper must
     still resolve evening tokens from its own `[data-theme="evening"]` attribute. -->
<Story
  name="Themed independently of the document"
  play={async ({ canvasElement }) => {
    // Simulate a sibling Docs block having clobbered <html> with the opposite theme.
    document.documentElement.setAttribute("data-theme", "daylight");

    // The ThemeWrapper renders a [data-theme] div INSIDE canvasElement (the wrapper is the decorator's Component, and
    // DecoratorHandler mounts <StoryComponent /> as children inside it, so the wrapper is a descendant of
    // canvasElement).
    const wrapper = canvasElement.querySelector("[data-theme]");
    await expect(wrapper).not.toBeNull();

    // The wrapper must carry the active global theme (evening by default).
    await expect((wrapper as Element).getAttribute("data-theme")).toBe("evening");

    // Custom properties must resolve from the wrapper, NOT from the daylight <html>. Evening --bg is #15100c; daylight
    // --bg is #f1e9dc. If there is no wrapper (old html-only approach) OR the wrapper is not independently themed,
    // getComputedStyle resolves #f1e9dc (daylight) instead.
    await expect(
      getComputedStyle(wrapper as Element)
        .getPropertyValue("--bg")
        .trim(),
    ).toBe("#15100c");

    // Restore <html> so subsequent stories are not poisoned.
    document.documentElement.setAttribute("data-theme", "evening");
  }}
>
  Evening theme (independence proof)
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Box>Hello from Qovira.</Box>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Box>Hello from Qovira.</Box>
    </div>
  {/snippet}
</Story>
