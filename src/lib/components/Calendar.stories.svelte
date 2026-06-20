<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import { CalendarDate } from "@internationalized/date";
  import type { ComponentProps } from "svelte";
  import Calendar from "./Calendar.svelte";
  import Field from "./Field.svelte";

  type Args = ComponentProps<typeof Calendar>;

  const { Story } = defineMeta({
    title: "Forms/Calendar",
    component: Calendar,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { type: "single", disabled: false, weekdayFormat: "short", locale: "en-GB" },
    argTypes: {
      type: { control: "inline-radio", options: ["single", "multiple"] },
      weekdayFormat: { control: "inline-radio", options: ["narrow", "short", "long"] },
      locale: { control: "select", options: ["en-GB", "en-US", "fr-FR", "de-DE", "ja-JP"] },
      disabled: { control: "boolean" },
    },
    // Limit the Controls panel to props with a clean native control — value and the bounds are DateValue objects.
    parameters: { controls: { include: ["type", "disabled", "weekdayFormat", "locale"] } },
  });
</script>

<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  let selected = $state<DateValue | DateValue[] | undefined>(new CalendarDate(2026, 6, 15));
  let navSelected = $state<DateValue | undefined>(new CalendarDate(2026, 6, 15));
  let calFieldValue = $state<DateValue | undefined>(undefined);
  let calFieldError = $state<string | undefined>("Choose a valid date.");
</script>

<!-- Edit the Controls to drive the component live; the other stories pin their props. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <!-- Remount on any control change: bits-ui's calendar throws on certain in-place prop updates (its month/year
         select reads a transiently-undefined placeholder), so we key the subtree to force a fresh mount instead. -->
    <div class="bg-surface text-fg inline-block p-6">
      {#key [args.type, args.disabled, args.weekdayFormat, args.locale].join("|")}
        <Calendar aria-label="Pick a date" {...args} />
      {/key}
    </div>
  {/snippet}
</Story>

<!-- A selected date renders aria-selected; clicking another day and keyboard navigation (ArrowRight + Enter) both round-trip through bind:value. -->
<Story
  name="Selected"
  play={async ({ canvas }) => {
    // The consumer's label names the grid (bits composes it as "<label> <month>").
    await expect(canvas.getByRole("application")).toHaveAccessibleName(/Reminder date/);
    // AC: the selected date is marked (data-selected on the day button; the gridcell carries aria-selected).
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
    // AC (headline): choosing a year jumps the displayed period — the grid re-renders June 2027 (the selectors drive
    // the calendar placeholder, not the selection).
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

<!-- Inside a Field, the grid inherits the a11y contract without prop-drilling. Picking any day clears the error. -->
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

<!-- Locale default: the standalone Calendar defaults to en-GB, so the week starts on Monday. The first weekday header cell must read "Mon", not "Sun". -->
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

<!-- Narrow weekday format collapses the headers to single letters (M T W T F S S), several of which repeat — so the weekday header row must key by position, not by the non-unique label, else Svelte throws each_key_duplicate. -->
<Story
  name="Narrow weekday format"
  play={async ({ canvas }) => {
    const headers = canvas.getAllByRole("columnheader");
    // AC: all seven day columns render even though several narrow labels are identical (T/T, S/S).
    await expect(headers).toHaveLength(7);
    await expect(headers[0]).toHaveTextContent("M");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" weekdayFormat="narrow" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Layout stability: the grid always renders six week-rows (42 day cells), even for a month that naturally fits in four. February 2021 starts on a Monday and ends on a Sunday — exactly four weeks — so without fixed weeks it would be two rows shorter than its neighbours and the calendar's height would jump as you page through months. The padding days come from the adjacent months. -->
<Story
  name="Fixed six-week grid"
  play={async ({ canvas }) => {
    // AC: six rows × seven days regardless of the month's natural week count.
    await expect(canvas.getAllByRole("gridcell")).toHaveLength(42);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" value={new CalendarDate(2021, 2, 1)} />
    </div>
  {/snippet}
</Story>

<!-- Clicking a day from a leading/trailing adjacent month selects it and snaps the view to that month (and year, when it crosses a December boundary). June 2026's grid shows 1 July as a trailing outside-month day; clicking it both selects it and pages the calendar to July 2026. -->
<Story
  name="Adjacent-month days navigate"
  play={async ({ canvas }) => {
    // 1 July 2026 renders as a trailing outside-month day inside June's grid. Match the full accessible name so "11
    // July 2026" in the same grid isn't ambiguous.
    const julyFirst = canvas.getByRole("button", { name: "Wednesday, 1 July 2026" });
    await expect(julyFirst).toHaveAttribute("data-outside-month");
    await userEvent.click(julyFirst);
    // AC: the view follows the selection into the next month — a July in-month day appears and June's mid-month day is
    // no longer rendered.
    await expect(await canvas.findByRole("button", { name: /15 July 2026/ })).toBeInTheDocument();
    await expect(canvas.queryByRole("button", { name: /15 June 2026/ })).not.toBeInTheDocument();
    // AC: the adjacent-month day is the selection, round-tripped through bind:value.
    await expect(canvas.getByTestId("nav-value")).toHaveTextContent("2026-07-01");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg inline-flex flex-col gap-3 p-6">
      <Calendar aria-label="Pick a date" bind:value={navSelected} />
      <p data-testid="nav-value" class="text-small font-sans text-fg-muted">
        {navSelected?.toString() ?? "none"}
      </p>
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

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg inline-block p-6">
      <Calendar aria-label="Pick a date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>
