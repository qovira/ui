<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Field from "./Field.svelte";
  import Textarea from "./Textarea.svelte";

  type Args = ComponentProps<typeof Textarea>;

  const { Story } = defineMeta({
    title: "Forms/Textarea",
    component: Textarea,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { placeholder: "Add a note…", rows: 3, disabled: false, readonly: false, required: false },
    argTypes: {
      placeholder: { control: "text" },
      rows: { control: "number" },
      disabled: { control: "boolean" },
      readonly: { control: "boolean" },
      required: { control: "boolean" },
    },
    // Limit the Controls panel to the user-meaningful scalar attributes the textarea actually reflects.
    parameters: { controls: { include: ["placeholder", "rows", "disabled", "readonly", "required"] } },
  });
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Field label="Notes">
        <Textarea {...args} />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Textarea consumes the same Field contract as Input — nested with no props. -->
<Story
  name="Default"
  play={async ({ canvas }) => {
    const field = canvas.getByLabelText("Notes");
    await expect(field.tagName).toBe("TEXTAREA");
    await expect(field).toHaveClass("focus-ring");
    await expect(field).not.toHaveAttribute("aria-invalid");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Notes" description="Anything we should keep in mind?">
        <Textarea placeholder="Add a note…" rows={3} />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Error state, same contract as Input. -->
<Story
  name="Invalid"
  play={async ({ canvas }) => {
    const field = canvas.getByLabelText("Notes");
    const message = canvas.getByText("Notes can't be empty.");
    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAttribute("aria-describedby", message.id);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Notes" error="Notes can't be empty.">
        <Textarea rows={3} />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Daylight + Evening, so axe runs the control in both themes. -->
<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Notes">
        <Textarea rows={3} placeholder="Add a note…" />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Notes">
        <Textarea rows={3} placeholder="Add a note…" />
      </Field>
    </div>
  {/snippet}
</Story>
