<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Tabs from "./Tabs.svelte";
  import type { TabItem } from "./nav-types.js";

  type Args = Omit<ComponentProps<typeof Tabs>, "items">;

  const { Story } = defineMeta({
    title: "Navigation/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { orientation: "horizontal" },
    argTypes: {
      orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    },
    // Limit the Controls panel to the scalar prop — items/panel are structured content, value is a binding key that
    // must match an item, and onValueChange is a callback.
    parameters: { controls: { include: ["orientation"] } },
  });

  const items: TabItem[] = [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
    { value: "settings", label: "Settings", disabled: true },
  ];
</script>

<script lang="ts">
  let active = $state("overview");
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Tabs {items} {...args}>
        {#snippet panel(item)}
          <p>The {item.label} panel.</p>
        {/snippet}
      </Tabs>
    </div>
  {/snippet}
</Story>

<!-- Arrow-key navigation with correct tablist/tab/tabpanel roles; bind:value round-trips. activationMode is automatic, so focusing a tab activates it. -->
<Story
  name="Tabbed panels"
  play={async ({ canvas }) => {
    // AC: correct roles.
    await expect(canvas.getAllByRole("tab")).toHaveLength(3);
    await expect(canvas.getByRole("tablist")).toBeInTheDocument();
    const overview = canvas.getByRole("tab", { name: "Overview" });
    const activity = canvas.getByRole("tab", { name: "Activity" });
    const settings = canvas.getByRole("tab", { name: "Settings" });
    // First tab selected by default; its panel is shown.
    await expect(overview).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("the overview");
    // AC: arrow-key navigable — ArrowRight activates the next tab, and bind:value round-trips to the consumer's state.
    overview.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(activity).toHaveAttribute("aria-selected", "true"));
    await expect(canvas.getByTestId("active")).toHaveTextContent("activity");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("recent activity");
    // The disabled tab can't be activated.
    await expect(settings).toHaveAttribute("data-disabled");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Tabs {items} bind:value={active}>
        {#snippet panel(item)}
          {#if item.value === "overview"}
            <p>This is the overview panel.</p>
          {:else if item.value === "activity"}
            <p>Your recent activity shows here.</p>
          {:else}
            <p>Settings.</p>
          {/if}
        {/snippet}
      </Tabs>
      <p data-testid="active" class="text-small mt-3 font-sans text-fg-muted">{active}</p>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Tabs {items} value="overview">
        {#snippet panel(item)}
          <p>The {item.label} panel.</p>
        {/snippet}
      </Tabs>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Tabs {items} value="overview">
        {#snippet panel(item)}
          <p>The {item.label} panel.</p>
        {/snippet}
      </Tabs>
    </div>
  {/snippet}
</Story>
