<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Tooltip from "./Tooltip.svelte";
  import Button from "./Button.svelte";

  type Args = Omit<ComponentProps<typeof Tooltip>, "children">;

  const { Story } = defineMeta({
    title: "Overlays/Tooltip",
    component: Tooltip,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these. `open`
    // defaults true so the tip is visible without a hover/focus interaction.
    args: { open: false, delayDuration: 300, sideOffset: 6, side: "top" },
    argTypes: {
      open: { control: "boolean" },
      delayDuration: { control: "number" },
      sideOffset: { control: "number" },
      side: { control: "inline-radio", options: ["top", "right", "bottom", "left"] },
    },
    // Limit the Controls panel to the scalar props — trigger/children are snippets, onOpenChange/class/portalTo aren't
    // user-meaningful controls.
    parameters: { controls: { include: ["open", "delayDuration", "sideOffset", "side"] } },
  });
</script>

<script lang="ts">
  // A short delay keeps the hover assertion fast; focus shows immediately. The tip is portalled into the story host so
  // the scoped `canvas` sees it.
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. `open` defaults true so the tip shows
without a hover/focus interaction; the trigger and tip content are snippets, left out of the controls. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div id="tip-host-playground" class="bg-surface text-fg p-12">
      <Tooltip {...args} portalTo="#tip-host-playground">
        {#snippet trigger({ props })}
          <Button {...props}>Save</Button>
        {/snippet}
        Saves your changes (⌘S)
      </Tooltip>
    </div>
  {/snippet}
</Story>

<!-- The trigger is a real Button carrying its own label ("Save") — the tooltip only supplements it, never being the
     lone carrier of meaning. Bits shows the tip on hover AND keyboard focus, and wires the trigger's
     aria-describedby. -->
<Story
  name="Hover and focus"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Save" });
    // AC: shows on hover. (Bits gives the tip no `role=tooltip`; it links the trigger to the content via
    // aria-describedby instead — so assert on text and that wiring rather than a role.)
    await userEvent.hover(trigger);
    await expect(await canvas.findByText(/Saves your changes/)).toBeVisible();
    await waitFor(() => expect(trigger).toHaveAttribute("aria-describedby"));
    await userEvent.unhover(trigger);
    await waitFor(() => expect(canvas.queryByText(/Saves your changes/)).not.toBeInTheDocument());
    // AC: shows on keyboard focus too — meaning isn't tooltip-only (the button is labelled "Save"; the tip only
    // supplements it).
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

<!-- Evening: same tip in the default theme, so axe checks the open state here too. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "Save" }));
    await canvas.findByText(/Saves your changes/);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByText(/Saves your changes/)).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="tip-host-eve" class="bg-surface text-fg p-12">
      <Tooltip delayDuration={150} portalTo="#tip-host-eve">
        {#snippet trigger({ props })}
          <Button {...props}>Save</Button>
        {/snippet}
        Saves your changes (⌘S)
      </Tooltip>
    </div>
  {/snippet}
</Story>
