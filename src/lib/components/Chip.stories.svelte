<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Chip from "./Chip.svelte";

  // `ComponentProps<typeof Chip>` is `Props & (HTMLAttributes<HTMLSpanElement> | HTMLAnchorAttributes)`; a plain `Omit`
  // over that union exceeds TS's union-complexity limit, so distribute the omit across each member.
  type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
  type Args = DistributiveOmit<ComponentProps<typeof Chip>, "children">;

  const { Story } = defineMeta({
    title: "Feedback/Chip",
    component: Chip,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures below hardcode their own props and ignore these.
    args: { variant: "neutral", href: "" },
    argTypes: {
      variant: { control: "select", options: ["neutral", "info", "success", "warning", "error"] },
      href: { control: "text" },
    },
    parameters: { controls: { include: ["variant", "href"] } },
  });
</script>

<!-- Controls playground: spreads `args`, so editing a control live-updates the preview. The fixtures below hardcode
their props for deterministic tests, so their Controls panel is inert. Setting an `href` morphs the chip into a
navigable link; the label is fixed representative copy. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Chip {...args}>Personal</Chip>
    </div>
  {/snippet}
</Story>

<!-- Compact labels, like Badge: neutral hairline or a status (tint/text + glyph, never color alone). -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    const neutral = canvas.getByText("Personal").closest("span")!;
    await expect(neutral.querySelector("svg")).not.toBeInTheDocument();
    // AC: status chips carry a glyph AND a label, never color alone.
    for (const label of ["Synced", "Syncing", "Error"]) {
      const chip = canvas.getByText(label).closest("span")!;
      await expect(chip.querySelector("svg")).toBeInTheDocument();
    }
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Chip>Personal</Chip>
      <Chip variant="success">Synced</Chip>
      <Chip variant="warning">Syncing</Chip>
      <Chip variant="error">Error</Chip>
    </div>
  {/snippet}
</Story>

<!-- With `href`, the chip morphs into a navigable link, same look and states. It carries the focus-ring (the static
span doesn't). -->
<Story
  name="As link"
  play={async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Archive" });
    await expect(link).toHaveAttribute("href", "/archive");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Chip href="/archive">Archive</Chip>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Chip>Personal</Chip>
      <Chip variant="success">Synced</Chip>
      <Chip variant="warning">Syncing</Chip>
      <Chip variant="error">Error</Chip>
      <Chip href="/archive">Archive</Chip>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-2 p-6">
      <Chip>Personal</Chip>
      <Chip variant="success">Synced</Chip>
      <Chip variant="warning">Syncing</Chip>
      <Chip variant="error">Error</Chip>
      <Chip href="/archive">Archive</Chip>
    </div>
  {/snippet}
</Story>
