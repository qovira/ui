<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import Tooltip from "./Tooltip.svelte";
  import Button from "./Button.svelte";

  const { Story } = defineMeta({
    title: "Overlays/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  // A short delay keeps the hover assertion fast; focus shows immediately.
  // The tip is portalled into the story host so the scoped `canvas` sees it.
</script>

<!-- The trigger is a real Button carrying its own label ("Save") — the tooltip
     only supplements it, never being the lone carrier of meaning. Bits shows the
     tip on hover AND keyboard focus, and wires the trigger's aria-describedby. -->
<Story
  name="Hover and focus"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Save" });
    // AC: shows on hover. (Bits gives the tip no `role=tooltip`; it links the
    // trigger to the content via aria-describedby instead — so assert on text
    // and that wiring rather than a role.)
    await userEvent.hover(trigger);
    await expect(await canvas.findByText(/Saves your changes/)).toBeVisible();
    await waitFor(() => expect(trigger).toHaveAttribute("aria-describedby"));
    await userEvent.unhover(trigger);
    await waitFor(() => expect(canvas.queryByText(/Saves your changes/)).not.toBeInTheDocument());
    // AC: shows on keyboard focus too — meaning isn't tooltip-only (the button
    // is labelled "Save"; the tip only supplements it).
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await canvas.findByText(/Saves your changes/)).toBeVisible();
    // Close to leave a clean (closed) slate for the axe pass.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByText(/Saves your changes/)).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="tip-host-main" class="bg-surface text-fg p-12">
      <Tooltip delayDuration={150} portalTo="#tip-host-main">
        {#snippet trigger({ props })}
          <Button {...props}>Save</Button>
        {/snippet}
        Saves your changes (⌘S)
      </Tooltip>
    </div>
  {/snippet}
</Story>

<!-- Daylight: show the tip so axe checks it in the other theme, then close. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Save" }));
    await canvas.findByText(/Saves your changes/);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByText(/Saves your changes/)).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="tip-host-day" class="bg-surface text-fg p-12">
      <Tooltip delayDuration={150} portalTo="#tip-host-day">
        {#snippet trigger({ props })}
          <Button {...props}>Save</Button>
        {/snippet}
        Saves your changes (⌘S)
      </Tooltip>
    </div>
  {/snippet}
</Story>
