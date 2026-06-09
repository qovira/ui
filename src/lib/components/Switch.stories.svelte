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
    <div class="bg-surface text-text flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-text">
        <Switch bind:checked />Email notifications
      </label>
      <button
        type="button"
        class="text-small font-sans text-link"
        onclick={() => (checked = false)}
      >
        Reset
      </button>
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the switch inherits the a11y contract without prop-drilling. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Autoplay" });
    await expect(sw).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("This setting needs review.");
    await expect(sw).toHaveAttribute("aria-describedby", message.id);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Field label="Autoplay" error="This setting needs review.">
        <Switch />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-text">
        <Switch checked />On
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-text">
        <Switch />Off
      </label>
    </div>
  {/snippet}
</Story>
