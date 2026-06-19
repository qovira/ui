<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Popover from "./Popover.svelte";
  import Button from "./Button.svelte";

  type Args = Omit<ComponentProps<typeof Popover>, "children">;

  const { Story } = defineMeta({
    title: "Overlays/Popover",
    component: Popover,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these. `open`
    // defaults true so the panel is visible without a click.
    args: { open: false, sideOffset: 8, side: "bottom", align: "center" },
    argTypes: {
      open: { control: "boolean" },
      sideOffset: { control: "number" },
      side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
      align: { control: "inline-radio", options: ["start", "center", "end"] },
    },
    // Limit the Controls panel to the scalar props — trigger/children are snippets, onOpenChange/class/portalTo aren't
    // user-meaningful controls.
    parameters: { controls: { include: ["open", "sideOffset", "side", "align"] } },
  });
</script>

<script lang="ts">
  // Per-story open state; each play closes the panel at the end so axe checks the resting (closed) state. The content
  // is portalled into the story's own host element so the scoped `canvas` can see it.
  let openMain = $state(false);
  let openDay = $state(false);
  let openEve = $state(false);
  const onOpenChange = fn();
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. `open` defaults true so the panel
shows without a click; the trigger and panel body are snippets, left out of the controls. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div id="pop-host-playground" class="bg-surface text-fg p-6">
      <Popover {...args} portalTo="#pop-host-playground">
        {#snippet trigger({ props })}
          <Button {...props}>Filters</Button>
        {/snippet}
        <h3 class="text-h3 font-display text-fg">Active filters</h3>
        <p class="text-body mt-2 font-sans text-fg-muted">Refine the list by status, owner, or date.</p>
      </Popover>
    </div>
  {/snippet}
</Story>

<!-- Full lifecycle: the trigger delegates to a Button via the `child` snippet, Bits portals the panel and positions
it with collision handling, Escape closes it, and onOpenChange reports the change. -->
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
    <div id="pop-host-main" class="bg-surface text-fg p-6">
      <Popover bind:open={openMain} {onOpenChange} portalTo="#pop-host-main">
        {#snippet trigger({ props })}
          <Button {...props}>Filters</Button>
        {/snippet}
        <h3 class="text-h3 font-display text-fg">Active filters</h3>
        <p class="text-body mt-2 font-sans text-fg-muted">Refine the list by status, owner, or date.</p>
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
    <div id="pop-host-day" class="bg-surface text-fg p-6">
      <Popover bind:open={openDay} portalTo="#pop-host-day">
        {#snippet trigger({ props })}
          <Button {...props}>Filters</Button>
        {/snippet}
        <h3 class="text-h3 font-display text-fg">Active filters</h3>
        <p class="text-body mt-2 font-sans text-fg-muted">Refine the list by status, owner, or date.</p>
      </Popover>
    </div>
  {/snippet}
</Story>

<!-- Evening: open the panel so axe checks it in the default theme too, then close. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Filters" }));
    await canvas.findByText("Active filters");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByText("Active filters")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="pop-host-eve" class="bg-surface text-fg p-6">
      <Popover bind:open={openEve} portalTo="#pop-host-eve">
        {#snippet trigger({ props })}
          <Button {...props}>Filters</Button>
        {/snippet}
        <h3 class="text-h3 font-display text-fg">Active filters</h3>
        <p class="text-body mt-2 font-sans text-fg-muted">Refine the list by status, owner, or date.</p>
      </Popover>
    </div>
  {/snippet}
</Story>
