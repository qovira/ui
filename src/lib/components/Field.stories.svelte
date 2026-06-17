<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Field from "./Field.svelte";
  import Input from "./Input.svelte";

  const { Story } = defineMeta({
    title: "Forms/Field",
    component: Field,
    tags: ["autodocs"],
  });
</script>

<!-- The Input is nested with NO id/aria props — it inherits the whole contract
     from Field via context (the "no prop-drilling" requirement). -->
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

<!-- Error state: aria-invalid + a real message carry the meaning; the red
     border only reinforces (never color alone). -->
<Story
  name="Invalid"
  play={async ({ canvas }) => {
    const input = canvas.getByLabelText("Email address");
    const message = canvas.getByText("Enter a valid email address.");
    // AC: aria-invalid is set, and aria-describedby points at the message.
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-describedby", message.id);
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

<!-- Invalid state in Daylight, so axe checks the error state in both themes. -->
<Story name="Daylight invalid" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email address" error="Enter a valid email address.">
        <Input type="email" value="nope" />
      </Field>
    </div>
  {/snippet}
</Story>
