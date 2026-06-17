<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import { CalendarDate } from "@internationalized/date";
  import Calendar from "./Calendar.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/Calendar",
    component: Calendar,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  let selected = $state<DateValue | DateValue[] | undefined>(new CalendarDate(2026, 6, 15));
</script>

<!-- A selected date renders aria-selected; clicking another day and keyboard
     navigation (ArrowRight + Enter) both round-trip through bind:value. -->
<Story
  name="Selected"
  play={async ({ canvas }) => {
    // The consumer's label names the grid (bits composes it as "<label> <month>").
    await expect(canvas.getByRole("application")).toHaveAccessibleName(/Reminder date/);
    // AC: the selected date is marked (data-selected on the day button; the
    // gridcell carries aria-selected).
    await expect(canvas.getByRole("button", { name: /June 15, 2026/ })).toHaveAttribute("data-selected");
    // AC: clicking a day round-trips bind:value.
    await userEvent.click(canvas.getByRole("button", { name: /June 20, 2026/ }));
    await expect(canvas.getByTestId("value")).toHaveTextContent("2026-06-20");
    // AC: keyboard-operable — focus moves with arrows, Enter commits.
    canvas.getByRole("button", { name: /June 20, 2026/ }).focus();
    await userEvent.keyboard("{ArrowRight}{Enter}");
    await expect(canvas.getByTestId("value")).toHaveTextContent("2026-06-21");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-flex flex-col gap-3 p-6">
      <Calendar aria-label="Reminder date" bind:value={selected} />
      <p data-testid="value" class="text-small font-sans text-fg-muted">
        {selected?.toString() ?? "none"}
      </p>
    </div>
  {/snippet}
</Story>

<!-- No value: the grid opens on the current month (placeholder defaults to today). -->
<Story name="Empty">
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" />
    </div>
  {/snippet}
</Story>

<!-- Disabled: days and navigation report aria-disabled. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /June 15, 2026/ })).toHaveAttribute("aria-disabled", "true");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" disabled value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the grid inherits the a11y contract without prop-drilling. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const grid = canvas.getByRole("application");
    // The Field's label names the grid via context (calendarLabel = label text).
    await expect(grid).toHaveAccessibleName(/Reminder date/);
    await expect(grid).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Choose a valid date.");
    await expect(grid).toHaveAttribute("aria-describedby", message.id);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Field label="Reminder date" error="Choose a valid date.">
        <Calendar value={new CalendarDate(2026, 6, 15)} />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>
