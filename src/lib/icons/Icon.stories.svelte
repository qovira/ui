<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import PlusIcon from "phosphor-svelte/lib/PlusIcon";
  import Icon from "./Icon.svelte";

  const { Story } = defineMeta({
    title: "Foundation/Icon",
    component: Icon,
    tags: ["autodocs"],
    args: { icon: PlusIcon },
    // Scope Controls/autodocs to Icon's real API — the prop type spreads in the full forwarded-SVG-attribute surface
    // (every native svg attr, aria-*, event handler) via ...rest, which Storybook would otherwise list as controls.
    parameters: { controls: { include: ["icon", "size", "label", "decorative", "class"] } },
  });
</script>

<!-- A meaningful icon-only usage exposes an accessible name (role="img" + label). -->
<Story
  name="Labelled"
  args={{ icon: PlusIcon, label: "Add item", size: 24 }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Add item" })).toBeInTheDocument();
  }}
/>

<!-- A decorative icon is aria-hidden and exposes no accessible name. -->
<Story
  name="Decorative"
  args={{ icon: PlusIcon, decorative: true }}
  play={async ({ canvas }) => {
    // aria-hidden removes it from the accessibility tree entirely.
    await expect(canvas.queryByRole("img")).toBeNull();
  }}
/>

<!-- The two locked sizes, each inheriting text color via currentColor. -->
<Story name="Small" args={{ icon: PlusIcon, label: "Add item", size: 20 }} />
<Story name="Large" args={{ icon: PlusIcon, label: "Add item", size: 24 }} />

<!-- Same component in Daylight, so axe runs against it in both themes. -->
<Story name="Daylight" args={{ icon: PlusIcon, label: "Add item", size: 24 }} globals={{ theme: "daylight" }} />
