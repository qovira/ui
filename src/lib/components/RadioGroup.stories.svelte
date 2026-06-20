<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import RadioGroup from "./RadioGroup.svelte";
  import RadioItem from "./RadioItem.svelte";
  import Field from "./Field.svelte";

  type Args = ComponentProps<typeof RadioGroup>;

  const { Story } = defineMeta({
    title: "Forms/RadioGroup",
    component: RadioGroup,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { orientation: "vertical", loop: true, disabled: false, required: false, readonly: false },
    argTypes: {
      orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
      loop: { control: "boolean" },
      disabled: { control: "boolean" },
      required: { control: "boolean" },
      readonly: { control: "boolean" },
    },
    // Limit the Controls panel to scalar props; value is driven by the rendered options and name is form-only.
    parameters: { controls: { include: ["orientation", "loop", "disabled", "required", "readonly"] } },
  });
</script>

<script lang="ts">
  let value = $state("standard");
  let radioFieldValue = $state("");
  let radioFieldError = $state<string | undefined>("Choose a plan to continue.");
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <RadioGroup aria-label="Shipping speed" {...args}>
        <RadioItem value="standard">Standard</RadioItem>
        <RadioItem value="express">Express</RadioItem>
        <RadioItem value="overnight">Overnight</RadioItem>
      </RadioGroup>
    </div>
  {/snippet}
</Story>

<!-- Single choice: selecting one option deselects the others; bind:value round-trips. -->
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

<!-- Inside a Field, the group names itself from the Field label (aria-labelledby) and inherits invalid/describedby — no prop-drilling. Picking a plan clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const group = canvas.getByRole("radiogroup");
    // Initial state: valid a11y wiring.
    await expect(group).toHaveAccessibleName("Plan");
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Choose a plan to continue.");
    await expect(group).toHaveAttribute("aria-describedby", message.id);
    // The group names itself via aria-labelledby, so the Field's <label> must NOT emit a `for` pointing at a
    // non-labelable element that exists nowhere.
    await expect(canvas.getByText("Plan")).not.toHaveAttribute("for");
    // Picking a plan satisfies the field — error clears.
    await userEvent.click(canvas.getByRole("radio", { name: "Free" }));
    await expect(group).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Choose a plan to continue.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Plan" {...radioFieldError ? { error: radioFieldError } : {}}>
        <RadioGroup
          bind:value={radioFieldValue}
          onValueChange={(v) => {
            radioFieldValue = v;
            radioFieldError = v ? undefined : "Choose a plan to continue.";
          }}
        >
          <RadioItem value="free">Free</RadioItem>
          <RadioItem value="pro">Pro</RadioItem>
        </RadioGroup>
      </Field>
    </div>
  {/snippet}
</Story>

<!-- TDD guard: assert the :enabled-gated hover classes are present on the root element. Static Tailwind classes are always in the rendered class attribute, so classList checks are the reliable signal here. These assertions must FAIL before the hover classes are added and PASS after. -->
<Story
  name="Hover classes"
  play={async ({ canvas }) => {
    const unchecked = canvas.getByRole("radio", { name: "Standard" });
    const checked = canvas.getByRole("radio", { name: "Express" });

    // Unchecked: border lights to accent on hover when enabled.
    await expect(unchecked).toHaveClass("enabled:data-[state=unchecked]:hover:border-accent");

    // Checked (border-only — no fill on RadioItem): border deepens to honey-600 on hover when enabled.
    await expect(checked).toHaveClass("enabled:data-[state=checked]:hover:border-honey-600");

    // The :enabled gate is verified at the CSS-selector level (compiled CSS grep) not in the DOM class attribute —
    // Tailwind always emits the class token; :enabled is part of the CSS rule selector, not the token name, so a
    // disabled element still has the token but the rule won't fire.
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <RadioGroup value="express" aria-label="Delivery speed">
        <RadioItem value="standard">Standard</RadioItem>
        <RadioItem value="express">Express</RadioItem>
        <RadioItem value="disabled" disabled>Disabled</RadioItem>
      </RadioGroup>
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

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <RadioGroup value="express" aria-label="Shipping speed">
        <RadioItem value="standard">Standard</RadioItem>
        <RadioItem value="express">Express</RadioItem>
      </RadioGroup>
    </div>
  {/snippet}
</Story>
