<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Field from "./Field.svelte";
  import Input from "./Input.svelte";

  type Args = ComponentProps<typeof Input>;

  const { Story } = defineMeta({
    title: "Forms/Input",
    component: Input,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { placeholder: "you@example.com", type: "email", disabled: false, readonly: false, required: false },
    argTypes: {
      placeholder: { control: "text" },
      type: { control: "select", options: ["text", "email", "password", "search", "tel", "url"] },
      disabled: { control: "boolean" },
      readonly: { control: "boolean" },
      required: { control: "boolean" },
    },
    // Limit the Controls panel to the user-meaningful scalar attributes the input reflects.
    parameters: { controls: { include: ["placeholder", "type", "disabled", "readonly", "required"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Field label="Email">
        <Input {...args} />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the input inherits the a11y contract (id ↔ label, describedby) without prop-drilling. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    await expect(input.tagName).toBe("INPUT");
    await expect(input).toHaveClass("focus-ring");
    await expect(input).not.toHaveAttribute("aria-invalid");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email" description="We'll only use it to sign you in.">
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Standalone (no Field): the control names itself with an explicit aria-label and takes an explicit id. -->
<Story
  name="Standalone"
  play={async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Search" });
    // Explicit id wins (there is no Field context to inherit from).
    await expect(input).toHaveAttribute("id", "search-input");
    await expect(input).toHaveClass("focus-ring");
    await expect(input).not.toHaveAttribute("aria-invalid");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Input aria-label="Search" id="search-input" placeholder="Search…" />
    </div>
  {/snippet}
</Story>

<!-- Standalone invalid: explicit aria-invalid + aria-describedby wire the error message with no Field. -->
<Story
  name="Standalone invalid"
  play={async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Coupon" });
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-describedby", "coupon-error");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col gap-2 p-6">
      <Input aria-label="Coupon" aria-invalid="true" aria-describedby="coupon-error" placeholder="Code" />
      <p id="coupon-error" class="text-small font-sans text-fg-error">That code isn't valid.</p>
    </div>
  {/snippet}
</Story>

<!-- Explicit aria props always win over the enclosing Field's: a control can opt out of the Field's validity wiring
     (e.g. it manages its own async validation). The Field is in error, yet the control reports its own state. -->
<Story
  name="Explicit aria override the field"
  play={async ({ canvas }) => {
    const input = canvas.getByLabelText("Email");
    // The Field would set aria-invalid="true" + describedby=<error id>, but the control's explicit props win.
    await expect(input).toHaveAttribute("aria-invalid", "false");
    await expect(input).toHaveAttribute("aria-describedby", "email-hint");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col gap-2 p-6">
      <Field label="Email" error="Enter a valid email.">
        <Input type="email" aria-invalid="false" aria-describedby="email-hint" />
      </Field>
      <p id="email-hint" class="text-small font-sans text-fg-muted">We'll send a sign-in code here.</p>
    </div>
  {/snippet}
</Story>

<!-- Daylight + Evening, so axe runs the control in both themes. -->
<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email">
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Email">
        <Input type="email" placeholder="you@example.com" />
      </Field>
    </div>
  {/snippet}
</Story>
