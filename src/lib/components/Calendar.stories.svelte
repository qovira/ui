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
  let calFieldValue = $state<DateValue | undefined>(undefined);
  let calFieldError = $state<string | undefined>("Choose a valid date.");
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
    await expect(canvas.getByRole("button", { name: /15 June 2026/ })).toHaveAttribute("data-selected");
    // AC: clicking a day round-trips bind:value.
    await userEvent.click(canvas.getByRole("button", { name: /20 June 2026/ }));
    await expect(canvas.getByTestId("value")).toHaveTextContent("2026-06-20");
    // AC: keyboard-operable — focus moves with arrows, Enter commits.
    canvas.getByRole("button", { name: /20 June 2026/ }).focus();
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

<!-- Month + year selectors are present and queryable by their accessible names. -->
<Story
  name="With month and year selectors"
  play={async ({ canvas }) => {
    // AC: both native <select> elements are rendered with the correct accessible names.
    const monthSelect = canvas.getByRole("combobox", { name: "Select a month" });
    const yearSelect = canvas.getByRole("combobox", { name: "Select a year" });
    await expect(monthSelect).toBeInTheDocument();
    await expect(yearSelect).toBeInTheDocument();
    // AC: the month select offers all 12 months; the year select a non-empty window.
    await expect(monthSelect.querySelectorAll("option")).toHaveLength(12);
    await expect(yearSelect.querySelectorAll("option").length).toBeGreaterThan(0);
    // AC (headline): choosing a year jumps the displayed period — the grid re-renders
    // June 2027 (the selectors drive the calendar placeholder, not the selection).
    await userEvent.selectOptions(yearSelect, "2027");
    await expect(await canvas.findByRole("button", { name: /15 June 2027/ })).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: /15 June 2026/ })).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Disabled: days and navigation report aria-disabled. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /15 June 2026/ })).toHaveAttribute("aria-disabled", "true");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" disabled value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the grid inherits the a11y contract without prop-drilling.
     Picking any day clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const grid = canvas.getByRole("application");
    // The Field's label names the grid via context (calendarLabel = label text).
    await expect(grid).toHaveAccessibleName(/Reminder date/);
    // Initial state: invalid wiring is present.
    await expect(grid).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Choose a valid date.");
    await expect(grid).toHaveAttribute("aria-describedby", message.id);
    // Picking a day satisfies the field — error clears.
    await userEvent.click(canvas.getByRole("button", { name: /20 June 2026/ }));
    await expect(grid).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Choose a valid date.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Field label="Reminder date" {...calFieldError ? { error: calFieldError } : {}}>
        <Calendar
          bind:value={calFieldValue}
          onValueChange={(v) => {
            calFieldValue = Array.isArray(v) ? v[0] : v;
            calFieldError = calFieldValue ? undefined : "Choose a valid date.";
          }}
        />
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

<!-- Locale default: the standalone Calendar defaults to en-GB, so the week starts
     on Monday. The first weekday header cell must read "Mon", not "Sun". -->
<Story
  name="Locale default (Monday-first)"
  play={async ({ canvas }) => {
    // bits-ui renders Calendar.HeadCell as <th> (columnheader role).
    const headers = canvas.getAllByRole("columnheader");
    // AC: the first day-of-week column header is Monday under en-GB.
    await expect(headers[0]).toHaveTextContent("Mon");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>
