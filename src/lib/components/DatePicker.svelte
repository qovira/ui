<script lang="ts">
  import { DatePicker } from "bits-ui";
  import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../internal/cn.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { getFieldContext } from "../internal/field-context.js";

  type Granularity = "day" | "hour" | "minute" | "second";

  interface Props {
    /** The selected date/time. */
    value?: DateValue | undefined;
    /** Whether the calendar popover is open. */
    open?: boolean;
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
    readonly?: boolean;
    granularity?: Granularity;
    hourCycle?: 12 | 24;
    weekdayFormat?: Intl.DateTimeFormatOptions["weekday"];
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
    "aria-label"?: string;
    "aria-invalid"?: boolean | "true" | "false" | undefined;
    "aria-describedby"?: string | undefined;
    /** Where to portal the popover. Defaults to `<body>`. */
    portalTo?: DatePicker.PortalProps["to"];
  }

  let {
    value = $bindable(),
    open = $bindable(false),
    minValue,
    maxValue,
    disabled = false,
    readonly = false,
    granularity,
    hourCycle,
    weekdayFormat = "short",
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
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
  // Optional configuration passed through only when set (exactOptionalPropertyTypes).
  const opts = $derived({
    ...(minValue ? { minValue } : {}),
    ...(maxValue ? { maxValue } : {}),
    ...(granularity ? { granularity } : {}),
    ...(hourCycle ? { hourCycle } : {}),
  });
  // The segment group needs its own accessible name (it isn't a labelable input).
  const groupName = $derived(
    ariaLabel
      ? { "aria-label": ariaLabel }
      : ctx?.labelId
        ? { "aria-labelledby": ctx.labelId }
        : {},
  );
</script>

<!-- Bits owns the whole picker: segmented entry, the collision-handled,
     portalled popover, calendar keyboard nav, and ARIA. The wrapper styles the
     parts and consumes the Field contract on the segment group. Each focusable
     part (segments, trigger, nav buttons, days) carries its own `focus-ring`. -->
<!-- Controlled value via one-way prop + writeback: passing `undefined` to the
     non-optional Bits `value` is rejected under exactOptionalPropertyTypes; the
     cast lets the legitimate empty/clear `undefined` flow through at runtime.
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
  {...opts}
  {...onOpenChange ? { onOpenChange } : {}}
>
  <div class="relative inline-block">
    <DatePicker.Input
      {...resolvedId ? { id: resolvedId } : {}}
      {...groupName}
      {...name ? { name } : {}}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      class={cn(FIELD_CONTROL_BASE, "inline-flex h-10 w-auto items-center gap-px pr-10", klass)}
    >
      {#snippet children({ segments })}
        {#each segments as { part, value: segValue }, i (i)}
          <DatePicker.Segment
            {part}
            class={cn(
              "focus-ring rounded-sm px-0.5 tabular-nums text-text",
              "data-[placeholder]:text-text-muted",
              part === "literal" && "px-0 text-text-muted",
            )}
          >
            {segValue}
          </DatePicker.Segment>
        {/each}
      {/snippet}
    </DatePicker.Input>
    <DatePicker.Trigger
      aria-label="Open calendar"
      class="focus-ring absolute inset-y-0 right-0 flex items-center rounded-md px-2.5 text-text-muted hover:text-text disabled:opacity-50"
    >
      <CalendarBlankIcon size={18} color="currentColor" aria-hidden="true" />
    </DatePicker.Trigger>
  </div>
  <DatePicker.Portal {...portalTo ? { to: portalTo } : {}}>
    <DatePicker.Content
      sideOffset={8}
      class={cn(
        "z-50 rounded-xl border border-border bg-surface-raised p-4 text-text shadow-[var(--shadow-lg)]",
        "duration-overlay ease-qovira",
        contentClass,
      )}
    >
      <DatePicker.Calendar>
        {#snippet children({ months, weekdays })}
          <!-- A plain div, not DatePicker.Header: that renders a <header> (a
               banner landmark) which axe flags when nested. -->
          <div class="flex items-center justify-between pb-3">
            <DatePicker.PrevButton
              class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-text hover:bg-surface disabled:opacity-50"
            >
              <CaretLeftIcon size={18} color="currentColor" aria-hidden="true" />
            </DatePicker.PrevButton>
            <DatePicker.Heading class="text-body font-sans font-medium text-text" />
            <DatePicker.NextButton
              class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-text hover:bg-surface disabled:opacity-50"
            >
              <CaretRightIcon size={18} color="currentColor" aria-hidden="true" />
            </DatePicker.NextButton>
          </div>
          {#each months as month (month.value.toString())}
            <DatePicker.Grid class="w-full border-collapse select-none">
              <DatePicker.GridHead>
                <DatePicker.GridRow class="flex">
                  {#each weekdays as day (day)}
                    <DatePicker.HeadCell
                      class="text-small w-9 pb-1 text-center font-sans font-normal text-text-muted"
                    >
                      {day}
                    </DatePicker.HeadCell>
                  {/each}
                </DatePicker.GridRow>
              </DatePicker.GridHead>
              <DatePicker.GridBody>
                {#each month.weeks as weekDates (weekDates[0]?.toString())}
                  <DatePicker.GridRow class="flex w-full">
                    {#each weekDates as date (date.toString())}
                      <DatePicker.Cell {date} month={month.value} class="p-0">
                        <DatePicker.Day
                          class={cn(
                            "focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-body font-sans text-text",
                            "hover:bg-surface data-[disabled]:opacity-40 data-[unavailable]:text-text-muted data-[unavailable]:line-through",
                            "data-[outside-month]:pointer-events-none data-[outside-month]:opacity-40",
                            "data-[selected]:bg-accent data-[selected]:text-warm-900 data-[today]:font-semibold",
                          )}
                        />
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
