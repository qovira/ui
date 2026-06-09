<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import Popover from "./Popover.svelte";
  import Button from "./Button.svelte";

  const { Story } = defineMeta({
    title: "Overlays/Popover",
    component: Popover,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  // Per-story open state; each play closes the panel at the end so axe checks
  // the resting (closed) state. The content is portalled into the story's own
  // host element so the scoped `canvas` can see it.
  let openMain = $state(false);
  let openDay = $state(false);
  const onOpenChange = fn();
</script>

<!-- Full lifecycle: the trigger delegates to a Button via the `child` snippet,
     Bits portals the panel and positions it with collision handling, Escape
     closes it, and onOpenChange reports the change. -->
<Story
  name="Anchored panel"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Filters" });
    // AC: trigger wired by Bits (delegated to our Button via `child`).
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // AC: content is portalled and rendered.
    const heading = await canvas.findByText("Active filters");
    // AC: collision-aware positioning is live — Bits stamps the resolved side.
    const panel = heading.closest("[data-side]");
    await expect(panel).not.toBeNull();
    // AC: focus ring present on the panel; theme styling applied.
    await expect(panel).toHaveClass("focus-ring");
    await expect(panel).toHaveClass("rounded-xl");
    // AC: Escape closes it and onOpenChange fires.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByText("Active filters")).not.toBeInTheDocument());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(onOpenChange).toHaveBeenLastCalledWith(false);
  }}
>
  {#snippet template()}
    <div id="pop-host-main" class="bg-surface text-text p-6">
      <Popover bind:open={openMain} {onOpenChange} portalTo="#pop-host-main">
        {#snippet trigger({ props })}
          <Button {...props}>Filters</Button>
        {/snippet}
        <h3 class="text-h3 font-display text-text">Active filters</h3>
        <p class="text-body mt-2 font-sans text-text-muted">Refine the list by status, owner, or date.</p>
      </Popover>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the panel so axe checks it in the other theme, then close. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await canvas.findByText("Active filters");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByText("Active filters")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="pop-host-day" class="bg-surface text-text p-6">
      <Popover bind:open={openDay} portalTo="#pop-host-day">
        {#snippet trigger({ props })}
          <Button {...props}>Filters</Button>
        {/snippet}
        <h3 class="text-h3 font-display text-text">Active filters</h3>
        <p class="text-body mt-2 font-sans text-text-muted">Refine the list by status, owner, or date.</p>
      </Popover>
    </div>
  {/snippet}
</Story>
