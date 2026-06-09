<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import Select from "./Select.svelte";
  import Field from "./Field.svelte";
  import type { ListboxItem } from "./listbox-types.js";

  const { Story } = defineMeta({
    title: "Forms/Select",
    component: Select,
    tags: ["autodocs"],
  });

  const models: ListboxItem[] = [
    { value: "gpt-5", label: "GPT-5" },
    { value: "claude", label: "Claude Opus" },
    { value: "gemini", label: "Gemini" },
    { value: "llama", label: "Llama 3", disabled: true },
  ];
</script>

<script lang="ts">
  // Per-story state so each play starts clean (Storybook reuses this instance).
  let single = $state<string | string[] | undefined>();
  let multi = $state<string | string[]>([]);
  const onValueChange = fn();
  const onOpenChange = fn();
</script>

<!-- Single select, driven by the keyboard: focus the trigger, open with Enter,
     arrow to an option, commit with Enter. Proves listbox keyboard nav, the
     bind:value round-trip (rendered out), and that both callbacks fire. -->
<Story
  name="Single"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Model" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await canvas.findByRole("listbox");
    await expect(onOpenChange).toHaveBeenCalledWith(true);
    // The first option is highlighted on open; ArrowDown moves to the second,
    // proving keyboard nav, and Enter commits it.
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(canvas.getByRole("option", { name: "Claude Opus" })).toHaveAttribute(
        "data-highlighted",
      ),
    );
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
    await expect(onValueChange).toHaveBeenLastCalledWith("claude");
    // bind:value round-tripped and the trigger reflects the chosen label.
    await expect(canvas.getByTestId("value")).toHaveTextContent('"claude"');
    await expect(trigger).toHaveTextContent("Claude Opus");
    // Reopen and pick another option by clicking it.
    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("option", { name: "GPT-5" }));
    await expect(canvas.getByTestId("value")).toHaveTextContent('"gpt-5"');
    // An external reset to `undefined` clears the selection (controlled round-trip).
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(trigger).toHaveTextContent("Select a model");
    await expect(canvas.getByTestId("value")).toHaveTextContent("null");
  }}
>
  {#snippet template()}
    <div id="select-single-host" class="bg-surface text-text flex flex-col gap-3 p-6">
      <Select
        aria-label="Model"
        items={models}
        bind:value={single}
        placeholder="Select a model"
        {onValueChange}
        {onOpenChange}
        portalTo="#select-single-host"
      />
      <button
        type="button"
        class="text-small font-sans text-link self-start"
        onclick={() => (single = undefined)}
      >
        Reset
      </button>
      <p data-testid="value" class="text-small font-sans text-text-muted">
        {JSON.stringify(single ?? null)}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Multi-select: clicking options accumulates them without closing the list;
     the disabled option can't be chosen. -->
<Story
  name="Multiple"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Models" });
    await userEvent.click(trigger);
    await canvas.findByRole("listbox");
    await userEvent.click(canvas.getByRole("option", { name: "GPT-5" }));
    await userEvent.click(canvas.getByRole("option", { name: "Gemini" }));
    // Disabled option stays unselectable.
    await expect(canvas.getByRole("option", { name: "Llama 3" })).toHaveAttribute("data-disabled");
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByTestId("multi")).toHaveTextContent('["gpt-5","gemini"]');
  }}
>
  {#snippet template()}
    <div id="select-multi-host" class="bg-surface text-text flex flex-col gap-3 p-6">
      <Select
        aria-label="Models"
        type="multiple"
        items={models}
        bind:value={multi}
        placeholder="Select models"
        portalTo="#select-multi-host"
      />
      <p data-testid="multi" class="text-small font-sans text-text-muted">
        {JSON.stringify(multi)}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Disabled trigger can't be opened. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Model" })).toBeDisabled();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Select aria-label="Model" items={models} disabled placeholder="Select a model" />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the trigger inherits the a11y contract without prop-drilling. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /Provider/ });
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Pick a provider to continue.");
    await expect(trigger).toHaveAttribute("aria-describedby", message.id);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Field label="Provider" error="Pick a provider to continue.">
        <Select items={models} placeholder="Select a provider" />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the listbox so axe checks the rendered panel in the other
     theme, then close to leave a clean slate. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Model" }));
    await canvas.findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="select-day-host" class="bg-surface text-text p-6">
      <Select
        aria-label="Model"
        items={models}
        placeholder="Select a model"
        portalTo="#select-day-host"
      />
    </div>
  {/snippet}
</Story>
