<script lang="ts">
  import { Calendar, type DateMatcher } from "bits-ui";
  import CaretLeftIcon from "phosphor-svelte/lib/CaretLeftIcon";
  import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../internal/cn.js";
  import { CALENDAR_DAY, CALENDAR_NAV_BUTTON, CALENDAR_SELECT } from "../internal/calendar-grid.js";
  import { resolveFieldAria, type FieldAriaProps } from "../internal/field-aria.svelte.js";
  import { getFieldGroupRegistrar } from "../internal/field-context.js";

  // Bits doesn't publicly export its calendar snippet-prop type; this covers the shape we read from each month (the
  // Root `children` snippet supplies it).
  type CalendarMonth = { value: DateValue; weeks: DateValue[][] };

  interface Props extends FieldAriaProps {
    /** Selected date — a `DateValue` for single, `DateValue[]` for multiple. */
    value?: DateValue | DateValue[] | undefined;
    /** Single selection (default) or multiple. */
    type?: "single" | "multiple";
    minValue?: DateValue;
    maxValue?: DateValue;
    /** Mark dates unavailable (e.g. a booked slot): struck-through (`data-unavailable`) and not selectable. */
    isDateUnavailable?: DateMatcher;
    /** Mark dates disabled: dimmed and non-interactive. (`minValue`/`maxValue` already disable out-of-range dates.) */
    isDateDisabled?: DateMatcher;
    disabled?: boolean;
    /** How weekday headers are formatted. */
    weekdayFormat?: Intl.DateTimeFormatOptions["weekday"];
    /** BCP-47 locale tag; sets the first day of week and date formatting. Defaults to `"en-GB"` (Monday-first). */
    locale?: string;
    id?: string;
    class?: string;
    /** Fires whenever the selection changes. */
    onValueChange?: (value: DateValue | DateValue[] | undefined) => void;
  }

  let {
    value = $bindable(),
    type = "single",
    minValue,
    maxValue,
    isDateUnavailable,
    isDateDisabled,
    disabled = false,
    weekdayFormat = "short",
    locale = "en-GB",
    id,
    class: klass,
    onValueChange,
    "aria-label": ariaLabel,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
  }: Props = $props();

  // Inherit the Field contract from context; explicit props win (works standalone).
  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));
  // The grid names itself through bits' `calendarLabel` (it builds the root's aria-label as `<calendarLabel> <month
  // year>` and wins the prop merge, so a plain aria-label/aria-labelledby here would be silently overridden). Use the
  // explicit label, else the Field's label text.
  const calLabel = $derived(ariaLabel ?? aria.labelText);
  const calName = $derived(calLabel ? { calendarLabel: calLabel } : {});
  // Optional bounds/matchers passed through only when set (exactOptionalPropertyTypes).
  const bounds = $derived({
    ...(minValue ? { minValue } : {}),
    ...(maxValue ? { maxValue } : {}),
    ...(isDateUnavailable ? { isDateUnavailable } : {}),
    ...(isDateDisabled ? { isDateDisabled } : {}),
  });

  // The grid self-labels via calendarLabel, so tell an enclosing Field to drop the `<label for>` it would otherwise
  // point at this non-labelable group.
  const registerGroup = getFieldGroupRegistrar();
  $effect(() => {
    registerGroup?.();
  });

  // Everything the two type-branched Roots share. Only `type`, `value`, and the value-typed `onValueChange` stay inline
  // per branch — hoisting those would break bits' discriminated-union narrowing on `type`.
  const rootProps = $derived({
    disabled,
    weekdayFormat,
    locale,
    // Always render six week-rows so the calendar's height never shifts month to month; the leading/trailing slots are
    // filled with adjacent-month days.
    fixedWeeks: true,
    // Keep those adjacent-month days selectable (bits disables them by default). Clicking one selects it and snaps the
    // view to its month — see CALENDAR_DAY, which drops the `pointer-events-none` bits' default would otherwise want.
    disableDaysOutsideMonth: false,
    ...bounds,
    ...(aria.resolvedId ? { id: aria.resolvedId } : {}),
    ...calName,
    "aria-invalid": aria.ariaInvalid,
    "aria-describedby": aria.ariaDescribedby,
    class: cn("inline-block rounded-xl border border-border bg-surface-raised p-4 text-fg", klass, "focus-ring"),
  });
</script>

<!-- Bits owns the calendar behavior: month grid, roving focus, keyboard nav, ARIA. The wrapper dresses its parts in
     @qovira/theme utilities and consumes the Field contract. `focus-ring` is appended last so a consumer class can't
     strip it; nav buttons and day cells carry their own. The Root is branched on `type` so the single/multiple value
     union narrows to a concrete literal; the month grid is shared via the `grid` snippet. -->
{#snippet grid(months: CalendarMonth[], weekdays: string[])}
  <!-- A plain div, not Calendar.Header: that renders a <header> (a banner landmark) which axe flags when nested. The
       parts work standalone. -->
  <div class="flex items-center justify-between gap-2 pb-3">
    <Calendar.PrevButton class={CALENDAR_NAV_BUTTON}>
      <CaretLeftIcon size={18} color="currentColor" aria-hidden="true" />
    </Calendar.PrevButton>
    <Calendar.MonthSelect class={CALENDAR_SELECT} />
    <Calendar.YearSelect class={CALENDAR_SELECT} />
    <Calendar.NextButton class={CALENDAR_NAV_BUTTON}>
      <CaretRightIcon size={18} color="currentColor" aria-hidden="true" />
    </Calendar.NextButton>
  </div>
  {#each months as month (month.value.toString())}
    <Calendar.Grid class="w-full border-collapse select-none">
      <Calendar.GridHead>
        <Calendar.GridRow class="flex w-full justify-center">
          {#each weekdays as day, i (i)}
            <Calendar.HeadCell class="text-small w-9 pb-1 text-center font-sans font-normal text-fg-muted">
              {day}
            </Calendar.HeadCell>
          {/each}
        </Calendar.GridRow>
      </Calendar.GridHead>
      <Calendar.GridBody>
        {#each month.weeks as weekDates (weekDates[0]?.toString())}
          <Calendar.GridRow class="flex w-full justify-center">
            {#each weekDates as date (date.toString())}
              <Calendar.Cell {date} month={month.value} class="p-0">
                <Calendar.Day class={CALENDAR_DAY} />
              </Calendar.Cell>
            {/each}
          </Calendar.GridRow>
        {/each}
      </Calendar.GridBody>
    </Calendar.Grid>
  {/each}
{/snippet}

{#if type === "multiple"}
  <Calendar.Root
    type="multiple"
    value={Array.isArray(value) ? value : []}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    {...rootProps}
  >
    {#snippet children({ months, weekdays })}
      {@render grid(months, weekdays)}
    {/snippet}
  </Calendar.Root>
{:else}
  <Calendar.Root
    type="single"
    value={(Array.isArray(value) ? undefined : value) as DateValue}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    {...rootProps}
  >
    {#snippet children({ months, weekdays })}
      {@render grid(months, weekdays)}
    {/snippet}
  </Calendar.Root>
{/if}
