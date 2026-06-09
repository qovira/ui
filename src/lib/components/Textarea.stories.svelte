<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Field from "./Field.svelte";
  import Textarea from "./Textarea.svelte";

  const { Story } = defineMeta({
    title: "Forms/Textarea",
    component: Textarea,
    tags: ["autodocs"],
  });
</script>

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
    <div class="bg-surface text-text p-6">
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
    <div class="bg-surface text-text p-6">
      <Field label="Notes" error="Notes can't be empty.">
        <Textarea rows={3} />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Daylight, so axe runs the control in both themes. -->
<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Field label="Notes">
        <Textarea rows={3} placeholder="Add a note…" />
      </Field>
    </div>
  {/snippet}
</Story>
