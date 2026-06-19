<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import { CalendarDate } from "@internationalized/date";
  import type { ComponentProps } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  import Field from "./Field.svelte";

  type Args = ComponentProps<typeof DatePicker>;

  const { Story } = defineMeta({
    title: "Forms/DatePicker",
    component: DatePicker,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: {
      disabled: false,
      readonly: false,
      granularity: "day",
      hourCycle: 24,
      weekdayFormat: "short",
      locale: "en-GB",
    },
    argTypes: {
      granularity: { control: "select", options: ["day", "hour", "minute", "second"] },
      hourCycle: { control: "inline-radio", options: [12, 24] },
      weekdayFormat: { control: "inline-radio", options: ["narrow", "short", "long"] },
      locale: { control: "select", options: ["en-GB", "en-US", "fr-FR", "de-DE", "ja-JP"] },
      disabled: { control: "boolean" },
      readonly: { control: "boolean" },
    },
    // Limit the Controls panel to props with a clean native control — value and the bounds are DateValue objects.
    parameters: {
      controls: { include: ["granularity", "hourCycle", "weekdayFormat", "locale", "disabled", "readonly"] },
    },
  });
</script>

<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  let value = $state<DateValue | undefined>(new CalendarDate(2026, 6, 15));
  let fixedValue = $state<DateValue | undefined>(new CalendarDate(2021, 2, 1));
  const onOpenChange = fn();
  let datePickerFieldValue = $state<DateValue | undefined>(undefined);
  let datePickerFieldError = $state<string | undefined>("Pick a reminder date.");
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. `value` is a DateValue with no native
control, so it's left to the fixtures — this playground drives granularity, hourCycle, weekdayFormat, locale, disabled,
and readonly. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <!-- Remount on any control change: bits-ui's calendar throws on certain in-place prop updates (its month/year
         select reads a transiently-undefined placeholder), so we key the subtree to force a fresh mount instead. -->
    <div id="datepicker-playground-host" class="bg-surface text-fg p-6">
      {#key [args.granularity, args.hourCycle, args.weekdayFormat, args.locale, args.disabled, args.readonly].join("|")}
        <DatePicker aria-label="Reminder" portalTo="#datepicker-playground-host" {...args} />
      {/key}
    </div>
  {/snippet}
</Story>

<!-- Open the popover from the trigger, pick a day; the popover portals + handles collisions, and the selection
     round-trips through bind:value. -->
<Story
  name="Open and select"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
    const day = await canvas.findByRole("button", { name: /20 June 2026/ });
    await userEvent.click(day);
    await expect(canvas.getByTestId("value")).toHaveTextContent("2026-06-20");
    // Popover dismisses; close defensively so axe checks the resting state.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-host" class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <DatePicker aria-label="Reminder" bind:value {onOpenChange} portalTo="#datepicker-host" />
      <p data-testid="value" class="text-small font-sans text-fg-muted">
        {value?.toString() ?? "none"}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Disabled: the trigger can't open the popover; group is visually dimmed (opacity-50). -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: /day/i })).toHaveAttribute("aria-disabled", "true");
    // Regression pin for F18: data-[disabled]:opacity-50 must cascade to this group too.
    const group = canvas.getByRole("group", { name: /Reminder/ });
    await expect(getComputedStyle(group).opacity).toBe("0.5");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DatePicker aria-label="Reminder" disabled value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the segment group inherits the a11y contract. Opening the calendar and picking a day fires
     onValueChange and clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: /Reminder date/ });
    // Initial state: invalid wiring is present.
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Pick a reminder date.");
    await expect(group).toHaveAttribute("aria-describedby", message.id);
    // Opening the calendar and picking a day clears the error.
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    const day = await canvas.findByRole("button", { name: /15 June 2026/ });
    await userEvent.click(day);
    await expect(group).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Pick a reminder date.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div id="datepicker-field-host" class="bg-surface text-fg p-6">
      <Field label="Reminder date" {...datePickerFieldError ? { error: datePickerFieldError } : {}}>
        <DatePicker
          bind:value={datePickerFieldValue}
          onValueChange={(v) => {
            datePickerFieldValue = v;
            datePickerFieldError = v ? undefined : "Pick a reminder date.";
          }}
          portalTo="#datepicker-field-host"
        />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Month + year selectors appear inside the calendar popover, queryable by role. -->
<Story
  name="With month and year selectors"
  play={async ({ canvas }) => {
    // Open the popover so the calendar renders.
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await canvas.findByRole("application");
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
    // Close the popover to leave a clean a11y state for axe.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-selector-host" class="bg-surface text-fg p-6">
      <DatePicker aria-label="Reminder" value={new CalendarDate(2026, 6, 15)} portalTo="#datepicker-selector-host" />
    </div>
  {/snippet}
</Story>

<!-- Default locale: segments render dd/mm (European, en-GB), and the popover calendar starts the week on Monday. -->
<Story
  name="Locale default (dd/mm)"
  play={async ({ canvas }) => {
    const spinbuttons = canvas.getAllByRole("spinbutton");
    const names = spinbuttons.map((el) => el.getAttribute("aria-label")?.toLowerCase() ?? "");
    // day must appear before month in the rendered order.
    const dayIdx = names.findIndex((n) => n.includes("day"));
    const monthIdx = names.findIndex((n) => n.includes("month"));
    // Both segments must exist, so the ordering assertion can't pass vacuously on a -1.
    await expect(dayIdx).toBeGreaterThanOrEqual(0);
    await expect(monthIdx).toBeGreaterThanOrEqual(0);
    await expect(dayIdx).toBeLessThan(monthIdx);
    // The en-GB default also drives the popover calendar's week start — Monday-first, like the standalone Calendar.
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await canvas.findByRole("application");
    await expect(canvas.getAllByRole("columnheader")[0]).toHaveTextContent("Mon");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-locale-host" class="bg-surface text-fg p-6">
      <DatePicker aria-label="Reminder" value={new CalendarDate(2026, 6, 15)} portalTo="#datepicker-locale-host" />
    </div>
  {/snippet}
</Story>

<!-- The popover calendar matches the standalone Calendar: it always renders six week-rows (42 day cells) so its height
     is constant month to month, and the leading/trailing adjacent-month days are selectable. February 2021 fits in four
     weeks naturally, so the two trailing rows are March 2021 days; clicking one selects that adjacent date. -->
<Story
  name="Fixed six-week grid"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await canvas.findByRole("application");
    // AC: six rows × seven days, like the standalone Calendar.
    await expect(canvas.getAllByRole("gridcell")).toHaveLength(42);
    // AC: a trailing adjacent-month day is selectable (not pointer-events-none).
    // Full accessible name disambiguates "1 March" from "11 March" in the padding.
    const marchFirst = canvas.getByRole("button", { name: "Monday, 1 March 2021" });
    await expect(marchFirst).toHaveAttribute("data-outside-month");
    await userEvent.click(marchFirst);
    await expect(canvas.getByTestId("value")).toHaveTextContent("2021-03-01");
  }}
>
  {#snippet template()}
    <div id="datepicker-fixed-host" class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <DatePicker aria-label="Reminder" bind:value={fixedValue} portalTo="#datepicker-fixed-host" />
      <p data-testid="value" class="text-small font-sans text-fg-muted">
        {fixedValue?.toString() ?? "none"}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the popover so axe checks the rendered calendar in the other theme, then close to leave a clean
     slate. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await canvas.findByRole("application");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-day-host" class="bg-surface text-fg p-6">
      <DatePicker aria-label="Reminder" value={new CalendarDate(2026, 6, 15)} portalTo="#datepicker-day-host" />
    </div>
  {/snippet}
</Story>

<!-- Evening: open the popover so axe checks the rendered calendar in the default theme too, then close. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await canvas.findByRole("application");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-eve-host" class="bg-surface text-fg p-6">
      <DatePicker aria-label="Reminder" value={new CalendarDate(2026, 6, 15)} portalTo="#datepicker-eve-host" />
    </div>
  {/snippet}
</Story>
