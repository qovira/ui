<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import { CalendarDate, CalendarDateTime } from "@internationalized/date";
  import DateField from "./DateField.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/DateField",
    component: DateField,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  let value = $state<DateValue | undefined>(new CalendarDate(2026, 6, 15));
  let withTime = $state<DateValue | undefined>(new CalendarDateTime(2026, 6, 15, 9, 30));
</script>

<!-- Segmented entry: each part is a spinbutton; stepping the day segment with
     the keyboard round-trips bind:value. -->
<Story
  name="Entry"
  play={async ({ canvas }) => {
    const day = canvas.getByRole("spinbutton", { name: /day/i });
    day.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(canvas.getByTestId("value")).toHaveTextContent("2026-06-16");
    // AC: it's a labelled group of editable segments.
    await expect(canvas.getByRole("spinbutton", { name: /month/i })).toBeInTheDocument();
    await expect(canvas.getByRole("spinbutton", { name: /year/i })).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <DateField aria-label="Due date" bind:value />
      <p data-testid="value" class="text-small font-sans text-fg-muted">
        {value?.toString() ?? "none"}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Time granularity adds hour/minute segments. -->
<Story
  name="Date and time"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: /hour/i })).toBeInTheDocument();
    await expect(canvas.getByRole("spinbutton", { name: /minute/i })).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Reminder time" bind:value={withTime} granularity="minute" />
    </div>
  {/snippet}
</Story>

<!-- Empty: placeholder segments render, muted. -->
<Story name="Empty">
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" />
    </div>
  {/snippet}
</Story>

<!-- Disabled: segments aren't editable. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: /day/i })).toHaveAttribute("aria-disabled", "true");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" disabled value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the segment group inherits the a11y contract. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: /Due date/ });
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Enter a valid date.");
    await expect(group).toHaveAttribute("aria-describedby", message.id);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Due date" error="Enter a valid date.">
        <DateField value={new CalendarDate(2026, 6, 15)} />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>
