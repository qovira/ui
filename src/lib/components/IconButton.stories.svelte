<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent } from "storybook/test";
  import { PlusIcon, TrashIcon } from "phosphor-svelte";
  import IconButton from "./IconButton.svelte";

  const { Story } = defineMeta({
    title: "Actions/IconButton",
    component: IconButton,
    tags: ["autodocs"],
    args: { icon: PlusIcon, label: "Add item" },
  });

  const handleClick = fn();
</script>

<!-- The label is the control's only accessible name; the icon is aria-hidden,
     so the button is reachable by name and the icon adds no duplicate node. -->
<Story
  name="Default"
  args={{ icon: PlusIcon, label: "Add item", onclick: handleClick }}
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Add item" });
    // AC: meets the 40px desktop hit-target floor.
    await expect(btn).toHaveClass("h-10");
    await expect(btn).toHaveClass("w-10");
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

<!-- Every variant, both themes (this + Daylight) — axe covers each. -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text flex flex-wrap items-center gap-3 p-6">
      <IconButton icon={PlusIcon} label="Add" variant="primary" />
      <IconButton icon={PlusIcon} label="Highlight" variant="key" />
      <IconButton icon={PlusIcon} label="More" variant="secondary" />
      <IconButton icon={PlusIcon} label="Edit" variant="ghost" />
      <IconButton icon={TrashIcon} label="Delete" variant="destructive" />
    </div>
  {/snippet}
</Story>

<!-- Disabled and loading states. -->
<Story
  name="Disabled"
  args={{ icon: TrashIcon, label: "Delete", variant: "destructive", disabled: true }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Delete" })).toBeDisabled();
  }}
/>

<Story
  name="Loading"
  args={{ icon: PlusIcon, label: "Adding", variant: "primary", loading: true }}
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Adding" });
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute("aria-busy", "true");
  }}
/>

<Story name="Daylight" args={{ icon: PlusIcon, label: "Add item", variant: "primary" }} globals={{ theme: "daylight" }} />
