<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import RadioGroup from "./RadioGroup.svelte";
  import RadioItem from "./RadioItem.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/RadioGroup",
    component: RadioGroup,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  let value = $state("standard");
</script>

<!-- Single choice: selecting one option deselects the others; bind:value
     round-trips. -->
<Story
  name="Single choice"
  play={async ({ canvas }) => {
    const standard = canvas.getByRole("radio", { name: "Standard" });
    const express = canvas.getByRole("radio", { name: "Express" });
    await expect(standard).toBeChecked();
    await expect(express).toHaveClass("focus-ring");
    await userEvent.click(express);
    await expect(express).toBeChecked();
    await expect(standard).not.toBeChecked();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <RadioGroup bind:value aria-label="Shipping speed">
        <RadioItem value="standard">Standard</RadioItem>
        <RadioItem value="express">Express</RadioItem>
        <RadioItem value="overnight">Overnight</RadioItem>
      </RadioGroup>
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the group names itself from the Field label (aria-labelledby)
     and inherits invalid/describedby — no prop-drilling. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup");
    await expect(group).toHaveAccessibleName("Plan");
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Choose a plan to continue.");
    await expect(group).toHaveAttribute("aria-describedby", message.id);
    // The group names itself via aria-labelledby, so the Field's <label> must
    // NOT emit a `for` pointing at a non-labelable element that exists nowhere.
    await expect(canvas.getByText("Plan")).not.toHaveAttribute("for");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Plan" error="Choose a plan to continue.">
        <RadioGroup value="">
          <RadioItem value="free">Free</RadioItem>
          <RadioItem value="pro">Pro</RadioItem>
        </RadioGroup>
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <RadioGroup value="express" aria-label="Shipping speed">
        <RadioItem value="standard">Standard</RadioItem>
        <RadioItem value="express">Express</RadioItem>
      </RadioGroup>
    </div>
  {/snippet}
</Story>
