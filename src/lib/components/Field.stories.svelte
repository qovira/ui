<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Field from "./Field.svelte";
  import Input from "./Input.svelte";

  type Args = Omit<ComponentProps<typeof Field>, "children">;

  const { Story } = defineMeta({
    title: "Forms/Field",
    component: Field,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { label: "Email address", description: "We'll only use this to send reminders.", error: "" },
    argTypes: {
      label: { control: "text" },
      description: { control: "text" },
      error: { control: "text" },
    },
    // Limit the Controls panel to the label/help/error strings; children is a snippet and class is excluded.
    parameters: { controls: { include: ["label", "description", "error"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Field {...args}>
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- The Input is nested with NO id/aria props — it inherits the whole contract from Field via context (the "no prop-drilling" requirement). -->
<Story
  name="Default"
  play={async ({ canvas }) => {
    // AC: label is linked to the control by id (getByLabelText resolves it).
    const input = canvas.getByLabelText("Email address");
    await expect(input).toBeInTheDocument();
    // Valid field carries no invalid/describedby wiring.
    await expect(input).not.toHaveAttribute("aria-invalid");
    await expect(input).not.toHaveAttribute("aria-describedby");
    // AC: the control shows a visible focus ring.
    await expect(input).toHaveClass("focus-ring");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address">
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Optional help text is linked via aria-describedby without an error. -->
<Story
  name="With description"
  play={async ({ canvas }) => {
    const input = canvas.getByLabelText("Email address");
    const help = canvas.getByText("We'll only use this to send reminders.");
    await expect(input).toHaveAttribute("aria-describedby", help.id);
    await expect(input).not.toHaveAttribute("aria-invalid");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address" description="We'll only use this to send reminders.">
        <Input type="email" />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Error state: aria-invalid + a real message carry the meaning; the red border only reinforces (never color alone). -->
<Story
  name="Invalid"
  play={async ({ canvas }) => {
    const input = canvas.getByLabelText("Email address");
    const message = canvas.getByText("Enter a valid email address.");
    // AC: aria-invalid is set, and aria-describedby points at the message.
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-describedby", message.id);
    // AC: the error is a live region, so a validation error surfaced after blur is announced.
    await expect(message).toHaveAttribute("aria-live", "polite");
    // AC: the meaning is in the message text, not color alone.
    await expect(message).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address" error="Enter a valid email address.">
        <Input type="email" value="nope" />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Disabled control. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByLabelText("Email address")).toBeDisabled();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address">
        <Input type="email" disabled />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- The invalid field (its richest state) in each theme, so axe checks the error treatment in both. -->
<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address" error="Enter a valid email address.">
        <Input type="email" value="nope" />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address" error="Enter a valid email address.">
        <Input type="email" value="nope" />
      </Field>
    </div>
  {/snippet}
</Story>
