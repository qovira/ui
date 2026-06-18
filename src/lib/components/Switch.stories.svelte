<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import Switch from "./Switch.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/Switch",
    component: Switch,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  let checked = $state(false);
  let switchFieldChecked = $state(false);
  let switchFieldError = $state<string | undefined>("This setting needs review.");
</script>

<!-- bind:checked round-trips; the switch is the rounded-full exception. -->
<Story
  name="Bind"
  play={async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Email notifications" });
    await expect(sw).not.toBeChecked();
    await expect(sw).toHaveClass("rounded-full");
    await expect(sw).toHaveClass("focus-ring");
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(sw).not.toBeChecked();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch bind:checked />Email notifications
      </label>
      <button type="button" class="text-small font-sans text-link" onclick={() => (checked = false)}> Reset </button>
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the switch inherits the a11y contract without prop-drilling.
     Toggling the switch on constitutes a valid action — it clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Autoplay" });
    // Initial state: invalid wiring is present.
    await expect(sw).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("This setting needs review.");
    await expect(sw).toHaveAttribute("aria-describedby", message.id);
    // Toggling the switch on satisfies the field — error clears.
    await userEvent.click(sw);
    await expect(sw).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("This setting needs review.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Autoplay" {...switchFieldError ? { error: switchFieldError } : {}}>
        <Switch
          bind:checked={switchFieldChecked}
          onCheckedChange={(v) => {
            switchFieldChecked = v;
            switchFieldError = switchFieldChecked ? undefined : "This setting needs review.";
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
        <Switch checked />On
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch />Off
      </label>
    </div>
  {/snippet}
</Story>
