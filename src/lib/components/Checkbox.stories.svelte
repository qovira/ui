<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import Checkbox from "./Checkbox.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/Checkbox",
    component: Checkbox,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  let checked = $state(false);
  let checkboxFieldChecked = $state(false);
  let checkboxFieldError = $state<string | undefined>("Please confirm your choice.");
</script>

<!-- bind:checked round-trips: a click drives state, and an external reset drives
     the control back. -->
<Story
  name="Bind"
  play={async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Accept terms" });
    await expect(box).not.toBeChecked();
    await expect(box).toHaveClass("focus-ring");
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(box).not.toBeChecked();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Checkbox bind:checked />Accept terms
      </label>
      <button type="button" class="text-small font-sans text-link" onclick={() => (checked = false)}> Reset </button>
    </div>
  {/snippet}
</Story>

<!-- The four states, including indeterminate (aria-checked="mixed"). -->
<Story
  name="States"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox", { name: "Checked" })).toBeChecked();
    await expect(canvas.getByRole("checkbox", { name: "Indeterminate" })).toHaveAttribute("aria-checked", "mixed");
    await expect(canvas.getByRole("checkbox", { name: "Disabled" })).toBeDisabled();
  }}
>
  {#snippet template()}
    {#snippet row(label: string, props: Record<string, unknown>)}
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Checkbox {...props} />{label}
      </label>
    {/snippet}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      {@render row("Unchecked", {})}
      {@render row("Checked", { checked: true })}
      {@render row("Indeterminate", { indeterminate: true })}
      {@render row("Disabled", { disabled: true })}
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the checkbox inherits the a11y contract without prop-drilling.
     Checking the box is a valid "I confirm" action — it clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: "Subscribe to updates" });
    // Initial state: invalid wiring is present.
    await expect(box).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Please confirm your choice.");
    await expect(box).toHaveAttribute("aria-describedby", message.id);
    // Checking the box satisfies the field — error clears.
    await userEvent.click(box);
    await expect(box).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Please confirm your choice.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Subscribe to updates" {...checkboxFieldError ? { error: checkboxFieldError } : {}}>
        <Checkbox
          bind:checked={checkboxFieldChecked}
          onCheckedChange={(v) => {
            checkboxFieldChecked = v === true;
            checkboxFieldError = checkboxFieldChecked ? undefined : "Please confirm your choice.";
          }}
        />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Checkbox checked />Checked
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Checkbox indeterminate />Indeterminate
      </label>
    </div>
  {/snippet}
</Story>
