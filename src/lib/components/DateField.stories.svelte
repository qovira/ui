<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import { CalendarDate, CalendarDateTime } from "@internationalized/date";
  import type { ComponentProps } from "svelte";
  import DateField from "./DateField.svelte";
  import Field from "./Field.svelte";

  type Args = ComponentProps<typeof DateField>;

  const { Story } = defineMeta({
    title: "Forms/DateField",
    component: DateField,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { disabled: false, readonly: false, granularity: "day", hourCycle: 24, locale: "en-GB" },
    argTypes: {
      granularity: { control: "select", options: ["day", "hour", "minute", "second"] },
      hourCycle: { control: "inline-radio", options: [12, 24] },
      locale: { control: "select", options: ["en-GB", "en-US", "fr-FR", "de-DE", "ja-JP"] },
      disabled: { control: "boolean" },
      readonly: { control: "boolean" },
    },
    // Limit the Controls panel to props with a clean native control — value and the bounds are DateValue objects.
    parameters: { controls: { include: ["granularity", "hourCycle", "locale", "disabled", "readonly"] } },
  });
</script>

<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  let value = $state<DateValue | undefined>(new CalendarDate(2026, 6, 15));
  let withTime = $state<DateValue | undefined>(new CalendarDateTime(2026, 6, 15, 9, 30));
  let dateFieldValue = $state<DateValue | undefined>(new CalendarDate(2026, 6, 15));
  let dateFieldError = $state<string | undefined>("Enter a valid date.");
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. `value` is a DateValue with no native
control, so it's left to the fixtures — this playground drives granularity, hourCycle, locale, disabled, and readonly. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" {...args} />
    </div>
  {/snippet}
</Story>

<!-- Segmented entry: each part is a spinbutton; stepping the day segment with the keyboard round-trips bind:value. -->
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

<!-- Disabled: segments aren't editable; group is visually dimmed (opacity-50). -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: /day/i })).toHaveAttribute("aria-disabled", "true");
    // F18: the input group must be visually dimmed — data-[disabled]:opacity-50 on FIELD_CONTROL_BASE is what achieves
    // this (CSS :disabled never matches a <div role="group">).
    const group = canvas.getByRole("group", { name: /Due date/ });
    await expect(getComputedStyle(group).opacity).toBe("0.5");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" disabled value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the segment group inherits the a11y contract. Stepping any segment fires onValueChange and clears
the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: /Due date/ });
    // Initial state: invalid wiring is present.
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Enter a valid date.");
    await expect(group).toHaveAttribute("aria-describedby", message.id);
    // Stepping the day segment fires a value change — error clears.
    const day = canvas.getByRole("spinbutton", { name: /day/i });
    day.focus();
    await userEvent.keyboard("{ArrowUp}");
    await expect(group).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Enter a valid date.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Due date" {...dateFieldError ? { error: dateFieldError } : {}}>
        <DateField
          bind:value={dateFieldValue}
          onValueChange={(v) => {
            dateFieldValue = v;
            dateFieldError = v ? undefined : "Enter a valid date.";
          }}
        />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Default locale: segments render in dd/mm/yyyy order (European, en-GB). -->
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
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Explicit en-US locale: segments render in mm/dd/yyyy order. -->
<Story
  name="Locale en-US (mm/dd)"
  play={async ({ canvas }) => {
    const spinbuttons = canvas.getAllByRole("spinbutton");
    const names = spinbuttons.map((el) => el.getAttribute("aria-label")?.toLowerCase() ?? "");
    // month must appear before day in the rendered order.
    const monthIdx = names.findIndex((n) => n.includes("month"));
    const dayIdx = names.findIndex((n) => n.includes("day"));
    // Both segments must exist, so the ordering assertion can't pass vacuously on a -1.
    await expect(monthIdx).toBeGreaterThanOrEqual(0);
    await expect(dayIdx).toBeGreaterThanOrEqual(0);
    await expect(monthIdx).toBeLessThan(dayIdx);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" locale="en-US" value={new CalendarDate(2026, 6, 15)} />
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

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <DateField aria-label="Due date" value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>
