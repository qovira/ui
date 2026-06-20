<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Select from "./Select.svelte";
  import Field from "./Field.svelte";
  import type { ListboxItem } from "./listbox-types.js";

  type Args = Omit<ComponentProps<typeof Select>, "items">;

  const { Story } = defineMeta({
    title: "Forms/Select",
    component: Select,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { type: "single", placeholder: "Select…", disabled: false },
    argTypes: {
      type: { control: "inline-radio", options: ["single", "multiple"] },
      placeholder: { control: "text" },
      disabled: { control: "boolean" },
    },
    // Limit the Controls panel to the scalar props — items is an option array and value is bindable, so both are left
    // out (the items are supplied in the template).
    parameters: { controls: { include: ["type", "placeholder", "disabled"] } },
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
  let selectFieldValue = $state<string | undefined>(undefined);
  let selectFieldError = $state<string | undefined>("Pick a provider to continue.");
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div id="select-playground-host" class="bg-surface text-fg flex flex-col gap-3 p-6">
      <Select aria-label="Model" items={models} portalTo="#select-playground-host" {...args} />
    </div>
  {/snippet}
</Story>

<!-- Single select, driven by the keyboard: focus the trigger, open with Enter, arrow to an option, commit with Enter. Proves listbox keyboard nav, the bind:value round-trip (rendered out), and that both callbacks fire. -->
<Story
  name="Single"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Model" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await canvas.findByRole("listbox");
    await expect(onOpenChange).toHaveBeenCalledWith(true);
    // The first option is highlighted on open; ArrowDown moves to the second, proving keyboard nav, and Enter commits
    // it.
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() =>
      expect(canvas.getByRole("option", { name: "Claude Opus" })).toHaveAttribute("data-highlighted"),
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
    <div id="select-single-host" class="bg-surface text-fg flex flex-col gap-3 p-6">
      <Select
        aria-label="Model"
        items={models}
        bind:value={single}
        placeholder="Select a model"
        {onValueChange}
        {onOpenChange}
        portalTo="#select-single-host"
      />
      <button type="button" class="text-small font-sans text-link self-start" onclick={() => (single = undefined)}>
        Reset
      </button>
      <p data-testid="value" class="text-small font-sans text-fg-muted">
        {JSON.stringify(single ?? null)}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Multi-select: clicking options accumulates them without closing the list; the disabled option can't be chosen. Selected options must be visually distinguished in the open list — their computed background-color must differ from unselected ones. -->
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
    // Assert the open-list selected-vs-unselected distinction before closing.
    // A selected option's background must differ from an unselected one so users can see (and deselect) their current
    // picks.
    const selectedOption = canvas.getByRole("option", { name: "GPT-5" });
    const unselectedOption = canvas.getByRole("option", { name: "Claude Opus" });
    const selectedBg = getComputedStyle(selectedOption).backgroundColor;
    const unselectedBg = getComputedStyle(unselectedOption).backgroundColor;
    await expect(selectedBg).not.toBe(unselectedBg);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
    await expect(canvas.getByTestId("multi")).toHaveTextContent('["gpt-5","gemini"]');
    // While CLOSED, the trigger must keep showing the human labels, not the raw committed values. Bits' Select.Value
    // resolves labels from the now-unmounted options and its persistent fallback is single-select only, so for multiple
    // it would regress to the values once the list closes. Labels differ in case from the values, so this catches it.
    await expect(trigger).toHaveTextContent("GPT-5");
    await expect(trigger).toHaveTextContent("Gemini");
    await expect(trigger).not.toHaveTextContent("gpt-5");
  }}
>
  {#snippet template()}
    <div id="select-multi-host" class="bg-surface text-fg flex flex-col gap-3 p-6">
      <Select
        aria-label="Models"
        type="multiple"
        items={models}
        bind:value={multi}
        placeholder="Select models"
        portalTo="#select-multi-host"
      />
      <p data-testid="multi" class="text-small font-sans text-fg-muted">
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
    <div class="bg-surface text-fg p-6">
      <Select aria-label="Model" items={models} disabled placeholder="Select a model" />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the trigger inherits the a11y contract without prop-drilling. Picking a provider clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /Provider/ });
    // Initial state: invalid wiring is present.
    await expect(trigger).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Pick a provider to continue.");
    await expect(trigger).toHaveAttribute("aria-describedby", message.id);
    // Picking a provider satisfies the field — error clears.
    await userEvent.click(trigger);
    await canvas.findByRole("listbox");
    await userEvent.click(canvas.getByRole("option", { name: "GPT-5" }));
    await expect(trigger).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Pick a provider to continue.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div id="select-field-host" class="bg-surface text-fg p-6">
      <Field label="Provider" {...selectFieldError ? { error: selectFieldError } : {}}>
        <Select
          items={models}
          placeholder="Select a provider"
          bind:value={selectFieldValue}
          onValueChange={(v) => {
            selectFieldValue = typeof v === "string" ? v : undefined;
            selectFieldError = selectFieldValue ? undefined : "Pick a provider to continue.";
          }}
          portalTo="#select-field-host"
        />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the listbox so axe checks the rendered panel in the other theme, then close to leave a clean slate. -->
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
    <div id="select-day-host" class="bg-surface text-fg p-6">
      <Select aria-label="Model" items={models} placeholder="Select a model" portalTo="#select-day-host" />
    </div>
  {/snippet}
</Story>

<!-- Evening: open the listbox so axe checks the rendered panel in the default theme too, then close. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Model" }));
    await canvas.findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="select-eve-host" class="bg-surface text-fg p-6">
      <Select aria-label="Model" items={models} placeholder="Select a model" portalTo="#select-eve-host" />
    </div>
  {/snippet}
</Story>
