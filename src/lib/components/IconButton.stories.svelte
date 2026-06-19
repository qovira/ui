<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import PlusIcon from "phosphor-svelte/lib/PlusIcon";
  import TrashIcon from "phosphor-svelte/lib/TrashIcon";
  import IconButton from "./IconButton.svelte";

  type Args = ComponentProps<typeof IconButton>;

  const { Story } = defineMeta({
    title: "Actions/IconButton",
    component: IconButton,
    tags: ["autodocs"],
    // `icon`/`label` defaults double as the Playground args; the fixtures hardcode their own props and ignore these.
    args: { icon: PlusIcon, label: "Add item", variant: "secondary", size: "md", loading: false, disabled: false },
    argTypes: {
      variant: { control: "select", options: ["primary", "key", "secondary", "ghost", "destructive"] },
      size: { control: "inline-radio", options: ["md", "touch"] },
      loading: { control: "boolean" },
      disabled: { control: "boolean" },
    },
    // `icon` is a component prop with no native control; the label is the accessible name. Drive the scalars only.
    parameters: { controls: { include: ["label", "variant", "size", "loading", "disabled"] } },
    // Default render: arg-driven stories sit on a themed surface, like the rest of the library's stories
    // (Variants/Daylight bring their own template).
    render: wrapped,
  });

  const handleClick = fn();
</script>

{#snippet wrapped(args: Args)}
  <div class="bg-surface text-fg p-6">
    <IconButton {...args} />
  </div>
{/snippet}

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. The icon is a component prop with no
native control, so it's excluded — this playground drives label, variant, size, loading, and disabled. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <IconButton {...args} />
    </div>
  {/snippet}
</Story>

<!-- All five variants on brand, in both themes (this story + Daylight below) so axe checks each one's contrast in each
     theme. -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    // AC: every variant renders, reachable by its accessible label.
    for (const name of ["Add", "Highlight", "More", "Edit", "Delete"]) {
      await expect(canvas.getByRole("button", { name })).toBeInTheDocument();
    }
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-3 p-6">
      <IconButton icon={PlusIcon} label="Add" variant="primary" />
      <IconButton icon={PlusIcon} label="Highlight" variant="key" />
      <IconButton icon={PlusIcon} label="More" variant="secondary" />
      <IconButton icon={PlusIcon} label="Edit" variant="ghost" />
      <IconButton icon={TrashIcon} label="Delete" variant="destructive" />
    </div>
  {/snippet}
</Story>

<!-- The label is the control's only accessible name; the icon is aria-hidden, so the button is reachable by name and
     the icon adds no duplicate node. -->
<Story
  name="Default"
  args={{ icon: PlusIcon, label: "Add item", onclick: handleClick }}
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Add item" });
    // AC: meets the 40px desktop hit-target floor.
    await expect(btn).toHaveClass("h-10");
    await expect(btn).toHaveClass("w-10");
    // AC: defaults to type="button" so an icon button in a form/toolbar doesn't submit.
    await expect(btn).toHaveAttribute("type", "button");
    await userEvent.click(btn);
    await expect(handleClick).toHaveBeenCalledOnce();
  }}
/>

<!-- Touch contexts use the larger 44px target. -->
<Story
  name="Touch size"
  args={{ icon: PlusIcon, label: "Add item", size: "touch" }}
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Add item" });
    await expect(btn).toHaveClass("h-11");
    await expect(btn).toHaveClass("w-11");
  }}
/>

<!-- Disabled blocks interaction and dims. -->
<Story
  name="Disabled"
  args={{ icon: TrashIcon, label: "Delete", variant: "destructive", disabled: true }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Delete" })).toBeDisabled();
  }}
/>

<!-- Loading shows the signature spinner, marks the control busy, and blocks interaction. -->
<Story
  name="Loading"
  args={{ icon: PlusIcon, label: "Adding", variant: "primary", loading: true }}
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Adding" });
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute("aria-busy", "true");
    // The indicator is the signature Spinner (pulsing dot), like Button — not a rotating icon — and it inherits the
    // button's text color (bg-current) so it stays visible on the honey primary fill in Evening.
    const dot = btn.querySelector(".spinner-dot");
    await expect(dot).not.toBeNull();
    await expect(btn.querySelector(".animate-spin")).toBeNull();
    await expect(dot).toHaveClass("bg-current");
    // Decorative: the button already owns the busy semantics (aria-busy + the aria-label), so the embedded spinner adds
    // no role/label of its own.
    await expect(btn.querySelector('[role="status"]')).toBeNull();
  }}
/>

<!-- All five variants in Daylight, so axe runs each in both themes. -->
<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-3 p-6">
      <IconButton icon={PlusIcon} label="Add" variant="primary" />
      <IconButton icon={PlusIcon} label="Highlight" variant="key" />
      <IconButton icon={PlusIcon} label="More" variant="secondary" />
      <IconButton icon={PlusIcon} label="Edit" variant="ghost" />
      <IconButton icon={TrashIcon} label="Delete" variant="destructive" />
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-3 p-6">
      <IconButton icon={PlusIcon} label="Add" variant="primary" />
      <IconButton icon={PlusIcon} label="Highlight" variant="key" />
      <IconButton icon={PlusIcon} label="More" variant="secondary" />
      <IconButton icon={PlusIcon} label="Edit" variant="ghost" />
      <IconButton icon={TrashIcon} label="Delete" variant="destructive" />
    </div>
  {/snippet}
</Story>
