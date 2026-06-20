<script lang="ts">
  import { DatePicker, type DateMatcher } from "bits-ui";
  import CalendarBlankIcon from "phosphor-svelte/lib/CalendarBlankIcon";
  import CaretLeftIcon from "phosphor-svelte/lib/CaretLeftIcon";
  import CaretRightIcon from "phosphor-svelte/lib/CaretRightIcon";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../internal/cn.js";
  import { CALENDAR_DAY, CALENDAR_NAV_BUTTON, CALENDAR_SELECT } from "../internal/calendar-grid.js";
  import { resolveFieldAria, type FieldAriaProps } from "../internal/field-aria.svelte.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";

  type Granularity = "day" | "hour" | "minute" | "second";

  interface Props extends FieldAriaProps {
    /** The selected date/time. */
    value?: DateValue | undefined;
    /** Whether the calendar popover is open. */
    open?: boolean;
    minValue?: DateValue;
    maxValue?: DateValue;
    /** Mark dates unavailable (e.g. a booked slot): struck-through (`data-unavailable`) and not selectable. */
    isDateUnavailable?: DateMatcher;
    /** Mark dates disabled: dimmed and non-interactive. (`minValue`/`maxValue` already disable out-of-range dates.) */
    isDateDisabled?: DateMatcher;
    disabled?: boolean;
    readonly?: boolean;
    granularity?: Granularity;
    hourCycle?: 12 | 24;
    weekdayFormat?: Intl.DateTimeFormatOptions["weekday"];
    /** BCP-47 locale tag; controls segment order. Defaults to `"en-GB"` (dd/mm/yyyy). */
    locale?: string;
    name?: string;
    id?: string;
    /** Merged onto the segment-input group (the labelable control). */
    class?: string;
    /** Merged onto the popover content panel. */
    contentClass?: string;
    /** Fires whenever the selected date changes. */
    onValueChange?: (value: DateValue | undefined) => void;
    /** Fires whenever the popover open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** Where to portal the popover. Defaults to `<body>`. */
    portalTo?: DatePicker.PortalProps["to"];
  }

  let {
    value = $bindable(),
    open = $bindable(false),
    minValue,
    maxValue,
    isDateUnavailable,
    isDateDisabled,
    disabled = false,
    readonly = false,
    granularity,
    hourCycle,
    weekdayFormat = "short",
    locale = "en-GB",
    name,
    id,
    class: klass,
    contentClass,
    onValueChange,
    onOpenChange,
    "aria-label": ariaLabel,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
    portalTo,
  }: Props = $props();

  // Inherit the Field contract from context; explicit props win (works standalone).
  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));
  // Optional configuration passed through only when set (exactOptionalPropertyTypes).
  const opts = $derived({
    ...(minValue ? { minValue } : {}),
    ...(maxValue ? { maxValue } : {}),
    ...(isDateUnavailable ? { isDateUnavailable } : {}),
    ...(isDateDisabled ? { isDateDisabled } : {}),
    ...(granularity ? { granularity } : {}),
    ...(hourCycle ? { hourCycle } : {}),
  });
  // The segment group needs its own accessible name (it isn't a labelable input).
  const groupName = $derived(
    ariaLabel ? { "aria-label": ariaLabel } : aria.labelId ? { "aria-labelledby": aria.labelId } : {},
  );
</script>

<!-- Bits owns the whole picker: segmented entry, the collision-handled, portalled popover, calendar keyboard nav, and
     ARIA. The wrapper styles the parts and consumes the Field contract on the segment group. Each focusable part
     (segments, trigger, nav buttons, days) carries its own `focus-ring`. -->
<!-- Controlled value via one-way prop + writeback: passing `undefined` to the non-optional Bits `value` is rejected
     under exactOptionalPropertyTypes; the cast lets the legitimate empty/clear `undefined` flow through at runtime.
     `open` is a plain boolean, so it round-trips through `bind:open`. -->
<DatePicker.Root
  value={value as DateValue}
  onValueChange={(v) => {
    value = v;
    onValueChange?.(v);
  }}
  bind:open
  {disabled}
  {readonly}
  {weekdayFormat}
  {locale}
  fixedWeeks
  disableDaysOutsideMonth={false}
  {...opts}
  {...onOpenChange ? { onOpenChange } : {}}
>
  <div class="relative inline-block">
    <DatePicker.Input
      {...aria.resolvedId ? { id: aria.resolvedId } : {}}
      {...groupName}
      {...name ? { name } : {}}
      aria-invalid={aria.ariaInvalid}
      aria-describedby={aria.ariaDescribedby}
      class={cn(FIELD_CONTROL_BASE, "inline-flex h-10 w-auto items-center gap-px pr-10", klass)}
    >
      {#snippet children({ segments })}
        {#each segments as { part, value: segValue }, i (i)}
          <DatePicker.Segment
            {part}
            class={cn(
              "focus-ring rounded-sm px-0.5 tabular-nums text-fg",
              "data-placeholder:text-fg-muted",
              part === "literal" && "px-0 text-fg-muted",
            )}
          >
            {segValue}
          </DatePicker.Segment>
        {/each}
      {/snippet}
    </DatePicker.Input>
    <DatePicker.Trigger
      aria-label="Open calendar"
      class="focus-ring absolute inset-y-0 right-0 flex items-center rounded-md px-2.5 text-fg-muted hover:text-fg disabled:opacity-50"
    >
      <CalendarBlankIcon size={18} color="currentColor" aria-hidden="true" />
    </DatePicker.Trigger>
  </div>
  <DatePicker.Portal {...portalTo ? { to: portalTo } : {}}>
    <DatePicker.Content
      sideOffset={8}
      class={cn(
        "z-50 rounded-xl border border-border bg-surface-raised p-4 text-fg shadow-(--shadow-lg)",
        "duration-overlay ease-qovira",
        contentClass,
      )}
    >
      <DatePicker.Calendar>
        {#snippet children({ months, weekdays })}
          <!-- A plain div, not DatePicker.Header: that renders a <header> (a banner landmark) which axe flags when
               nested. -->
          <div class="flex items-center justify-between gap-2 pb-3">
            <DatePicker.PrevButton class={CALENDAR_NAV_BUTTON}>
              <CaretLeftIcon size={18} color="currentColor" aria-hidden="true" />
            </DatePicker.PrevButton>
            <DatePicker.MonthSelect class={CALENDAR_SELECT} />
            <DatePicker.YearSelect class={CALENDAR_SELECT} />
            <DatePicker.NextButton class={CALENDAR_NAV_BUTTON}>
              <CaretRightIcon size={18} color="currentColor" aria-hidden="true" />
            </DatePicker.NextButton>
          </div>
          {#each months as month (month.value.toString())}
            <DatePicker.Grid class="w-full border-collapse select-none">
              <DatePicker.GridHead>
                <DatePicker.GridRow class="flex w-full justify-center">
                  {#each weekdays as day, i (i)}
                    <DatePicker.HeadCell class="text-small w-9 pb-1 text-center font-sans font-normal text-fg-muted">
                      {day}
                    </DatePicker.HeadCell>
                  {/each}
                </DatePicker.GridRow>
              </DatePicker.GridHead>
              <DatePicker.GridBody>
                {#each month.weeks as weekDates (weekDates[0]?.toString())}
                  <DatePicker.GridRow class="flex w-full justify-center">
                    {#each weekDates as date (date.toString())}
                      <DatePicker.Cell {date} month={month.value} class="p-0">
                        <DatePicker.Day class={CALENDAR_DAY} />
                      </DatePicker.Cell>
                    {/each}
                  </DatePicker.GridRow>
                {/each}
              </DatePicker.GridBody>
            </DatePicker.Grid>
          {/each}
        {/snippet}
      </DatePicker.Calendar>
    </DatePicker.Content>
  </DatePicker.Portal>
</DatePicker.Root>
