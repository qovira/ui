<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import Tabs from "./Tabs.svelte";
  import type { TabItem } from "./nav-types.js";

  const { Story } = defineMeta({
    title: "Navigation/Tabs",
    component: Tabs,
    tags: ["autodocs"],
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

<!-- Arrow-key navigation with correct tablist/tab/tabpanel roles; bind:value
     round-trips. activationMode is automatic, so focusing a tab activates it. -->
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
    // AC: arrow-key navigable — ArrowRight activates the next tab, and
    // bind:value round-trips to the consumer's state.
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
    <div class="bg-surface text-text p-6">
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
      <p data-testid="active" class="text-small mt-3 font-sans text-text-muted">{active}</p>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Tabs {items} value="overview">
        {#snippet panel(item)}
          <p>The {item.label} panel.</p>
        {/snippet}
      </Tabs>
    </div>
  {/snippet}
</Story>
