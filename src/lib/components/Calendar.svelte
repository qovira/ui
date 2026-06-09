<script lang="ts">
  import { Calendar } from "bits-ui";
  import { CaretLeftIcon, CaretRightIcon } from "phosphor-svelte";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../internal/cn.js";
  import { getFieldContext } from "../internal/field-context.js";

  // Bits doesn't publicly export its calendar snippet-prop type; this covers the
  // shape we read from each month (the Root `children` snippet supplies it).
  type CalendarMonth = { value: DateValue; weeks: DateValue[][] };

  interface Props {
    /** Selected date — a `DateValue` for single, `DateValue[]` for multiple. */
    value?: DateValue | DateValue[] | undefined;
    /** Single selection (default) or multiple. */
    type?: "single" | "multiple";
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
    /** How weekday headers are formatted. */
    weekdayFormat?: Intl.DateTimeFormatOptions["weekday"];
    id?: string;
    class?: string;
    /** Fires whenever the selection changes. */
    onValueChange?: (value: DateValue | DateValue[] | undefined) => void;
    "aria-label"?: string;
    "aria-invalid"?: boolean | "true" | "false" | undefined;
    "aria-describedby"?: string | undefined;
  }

  let {
    value = $bindable(),
    type = "single",
    minValue,
    maxValue,
    disabled = false,
    weekdayFormat = "short",
    id,
    class: klass,
    onValueChange,
    "aria-label": ariaLabel,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
  }: Props = $props();

  // Inherit the Field contract from context; explicit props win (works standalone).
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
  // The grid names itself through bits' `calendarLabel` (it builds the root's
  // aria-label as `<calendarLabel> <month year>` and wins the prop merge, so a
  // plain aria-label/aria-labelledby here would be silently overridden). Use the
  // explicit label, else the Field's label text.
  const calLabel = $derived(ariaLabel ?? ctx?.labelText);
  const calName = $derived(calLabel ? { calendarLabel: calLabel } : {});
  // Optional bounds passed through only when set (exactOptionalPropertyTypes).
  const bounds = $derived({
    ...(minValue ? { minValue } : {}),
    ...(maxValue ? { maxValue } : {}),
  });
</script>

<!-- Bits owns the calendar behavior: month grid, roving focus, keyboard nav,
     ARIA. The wrapper dresses its parts in @qovira/theme utilities and consumes
     the Field contract. `focus-ring` is appended last so a consumer class can't
     strip it; nav buttons and day cells carry their own. The Root is branched on
     `type` so the single/multiple value union narrows to a concrete literal; the
     month grid is shared via the `grid` snippet. -->
{#snippet grid(months: CalendarMonth[], weekdays: string[])}
  <!-- A plain div, not Calendar.Header: that renders a <header> (a banner
       landmark) which axe flags when nested. The parts work standalone. -->
  <div class="flex items-center justify-between pb-3">
    <Calendar.PrevButton
      class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-text hover:bg-surface disabled:opacity-50"
    >
      <CaretLeftIcon size={18} color="currentColor" aria-hidden="true" />
    </Calendar.PrevButton>
    <Calendar.Heading class="text-body font-sans font-medium text-text" />
    <Calendar.NextButton
      class="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-text hover:bg-surface disabled:opacity-50"
    >
      <CaretRightIcon size={18} color="currentColor" aria-hidden="true" />
    </Calendar.NextButton>
  </div>
  {#each months as month (month.value.toString())}
    <Calendar.Grid class="w-full border-collapse select-none">
      <Calendar.GridHead>
        <Calendar.GridRow class="flex">
          {#each weekdays as day (day)}
            <Calendar.HeadCell
              class="text-small w-9 pb-1 text-center font-sans font-normal text-text-muted"
            >
              {day}
            </Calendar.HeadCell>
          {/each}
        </Calendar.GridRow>
      </Calendar.GridHead>
      <Calendar.GridBody>
        {#each month.weeks as weekDates (weekDates[0]?.toString())}
          <Calendar.GridRow class="flex w-full">
            {#each weekDates as date (date.toString())}
              <Calendar.Cell {date} month={month.value} class="p-0">
                <Calendar.Day
                  class={cn(
                    "focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-body font-sans text-text",
                    "hover:bg-surface data-[disabled]:opacity-40 data-[unavailable]:text-text-muted data-[unavailable]:line-through",
                    "data-[outside-month]:pointer-events-none data-[outside-month]:opacity-40",
                    "data-[selected]:bg-accent data-[selected]:text-warm-900 data-[today]:font-semibold",
                  )}
                />
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
    {disabled}
    {weekdayFormat}
    {...bounds}
    {...resolvedId ? { id: resolvedId } : {}}
    {...calName}
    aria-invalid={ariaInvalid}
    aria-describedby={ariaDescribedby}
    class={cn(
      "inline-block rounded-xl border border-border bg-surface-raised p-4 text-text",
      klass,
      "focus-ring",
    )}
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
    {disabled}
    {weekdayFormat}
    {...bounds}
    {...resolvedId ? { id: resolvedId } : {}}
    {...calName}
    aria-invalid={ariaInvalid}
    aria-describedby={ariaDescribedby}
    class={cn(
      "inline-block rounded-xl border border-border bg-surface-raised p-4 text-text",
      klass,
      "focus-ring",
    )}
  >
    {#snippet children({ months, weekdays })}
      {@render grid(months, weekdays)}
    {/snippet}
  </Calendar.Root>
{/if}
