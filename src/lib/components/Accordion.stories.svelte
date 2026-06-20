<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Accordion from "./Accordion.svelte";
  import type { AccordionItem } from "./nav-types.js";

  type Args = Omit<ComponentProps<typeof Accordion>, "items">;

  const { Story } = defineMeta({
    title: "Navigation/Accordion",
    component: Accordion,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { type: "single", disabled: false },
    argTypes: {
      type: { control: "inline-radio", options: ["single", "multiple"] },
      disabled: { control: "boolean" },
    },
    // Limit the Controls panel to scalar props — items is a data array, value/section/onValueChange aren't scalars.
    parameters: { controls: { include: ["type", "disabled"] } },
  });

  const items: AccordionItem[] = [
    { value: "what", title: "What is Qovira?" },
    { value: "how", title: "How does it work?" },
    { value: "price", title: "What does it cost?" },
  ];
</script>

<script lang="ts">
  let openOne = $state<string | string[]>("");
  let openMany = $state<string | string[]>([]);
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg w-96 p-6">
      <Accordion {items} {...args}>
        {#snippet section(item)}
          <p>The {item.title} answer.</p>
        {/snippet}
      </Accordion>
    </div>
  {/snippet}
</Story>

<!-- Single-open: keyboard expand/collapse with correct heading/button/region ARIA; bind:value round-trips. -->
<Story
  name="Single"
  play={async ({ canvas }) => {
    // AC: each section is a heading containing the toggle button.
    await expect(canvas.getAllByRole("heading")).toHaveLength(3);
    const what = canvas.getByRole("button", { name: "What is Qovira?" });
    const how = canvas.getByRole("button", { name: "How does it work?" });
    await expect(what).toHaveAttribute("aria-expanded", "false");
    // Keyboard: focus + Enter expands the first section.
    what.focus();
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(what).toHaveAttribute("aria-expanded", "true"));
    await expect(canvas.getByText(/calm, focused workspace/)).toBeVisible();
    await expect(canvas.getByTestId("open")).toHaveTextContent("what");
    // Single mode: opening another collapses the first.
    await userEvent.click(how);
    await waitFor(() => expect(how).toHaveAttribute("aria-expanded", "true"));
    await expect(what).toHaveAttribute("aria-expanded", "false");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg w-96 p-6">
      <Accordion {items} bind:value={openOne}>
        {#snippet section(item)}
          {#if item.value === "what"}
            <p>Qovira is a calm, focused workspace for your reminders and notes.</p>
          {:else if item.value === "how"}
            <p>You write; it organizes and reminds.</p>
          {:else}
            <p>There's a free tier; paid plans add more.</p>
          {/if}
        {/snippet}
      </Accordion>
      <p data-testid="open" class="text-small mt-3 font-sans text-fg-muted">{openOne}</p>
    </div>
  {/snippet}
</Story>

<!-- Multiple-open: several sections can be expanded at once. -->
<Story
  name="Multiple"
  play={async ({ canvas }) => {
    const what = canvas.getByRole("button", { name: "What is Qovira?" });
    const how = canvas.getByRole("button", { name: "How does it work?" });
    await userEvent.click(what);
    await userEvent.click(how);
    await waitFor(() => expect(what).toHaveAttribute("aria-expanded", "true"));
    await expect(how).toHaveAttribute("aria-expanded", "true");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg w-96 p-6">
      <Accordion {items} type="multiple" bind:value={openMany}>
        {#snippet section(item)}
          <p>Section: {item.title}</p>
        {/snippet}
      </Accordion>
    </div>
  {/snippet}
</Story>

<!-- Disabled: the whole accordion reports aria-disabled on its triggers. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "What is Qovira?" })).toHaveAttribute("aria-disabled", "true");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg w-96 p-6">
      <Accordion {items} disabled value="what">
        {#snippet section(item)}
          <p>{item.title}</p>
        {/snippet}
      </Accordion>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg w-96 p-6">
      <Accordion {items} value="what">
        {#snippet section(item)}
          <p>The {item.title} answer.</p>
        {/snippet}
      </Accordion>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg w-96 p-6">
      <Accordion {items} value="what">
        {#snippet section(item)}
          <p>The {item.title} answer.</p>
        {/snippet}
      </Accordion>
    </div>
  {/snippet}
</Story>
