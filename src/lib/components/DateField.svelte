<script lang="ts">
  import { DateField, type DateMatcher } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria, type FieldAriaProps } from "../internal/field-aria.svelte.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";

  type Granularity = "day" | "hour" | "minute" | "second";

  interface Props extends FieldAriaProps {
    /** The entered date/time. */
    value?: DateValue | undefined;
    minValue?: DateValue;
    maxValue?: DateValue;
    /** Mark dates unavailable (e.g. a booked slot): struck-through (`data-unavailable`) and not selectable. */
    isDateUnavailable?: DateMatcher;
    /** Mark dates disabled: dimmed and non-interactive. (`minValue`/`maxValue` already disable out-of-range dates.) */
    isDateDisabled?: DateMatcher;
    disabled?: boolean;
    readonly?: boolean;
    /** Smallest editable unit — `"day"` (default) through `"second"` for time. */
    granularity?: Granularity;
    hourCycle?: 12 | 24;
    /** BCP-47 locale tag; controls segment order. Defaults to `"en-GB"` (dd/mm/yyyy). */
    locale?: string;
    /** Name for the hidden form input (submits the ISO value). */
    name?: string;
    id?: string;
    class?: string;
    /** Fires whenever the value changes. */
    onValueChange?: (value: DateValue | undefined) => void;
  }

  let {
    value = $bindable(),
    minValue,
    maxValue,
    isDateUnavailable,
    isDateDisabled,
    disabled = false,
    readonly = false,
    granularity,
    hourCycle,
    locale = "en-GB",
    name,
    id,
    class: klass,
    onValueChange,
    "aria-label": ariaLabel,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
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

<!-- Bits owns the segmented-entry behavior (per-segment focus, arrow stepping, ARIA spinbuttons, the hidden form
     input). The wrapper styles the group and segments; each segment carries `focus-ring` (it's the focusable
     element). -->
<!-- Controlled value via one-way prop + writeback: passing `undefined` to the non-optional Bits `value` is rejected
     under exactOptionalPropertyTypes; the cast lets the legitimate empty/clear `undefined` flow through at runtime. -->
<DateField.Root
  value={value as DateValue}
  onValueChange={(v) => {
    value = v;
    onValueChange?.(v);
  }}
  {disabled}
  {readonly}
  {locale}
  {...opts}
>
  <DateField.Input
    {...aria.resolvedId ? { id: aria.resolvedId } : {}}
    {...groupName}
    {...name ? { name } : {}}
    aria-invalid={aria.ariaInvalid}
    aria-describedby={aria.ariaDescribedby}
    class={cn(FIELD_CONTROL_BASE, "inline-flex h-10 w-auto items-center gap-px", klass)}
  >
    {#snippet children({ segments })}
      {#each segments as { part, value: segValue }, i (i)}
        <DateField.Segment
          {part}
          class={cn(
            "focus-ring rounded-sm px-0.5 tabular-nums text-fg",
            "data-placeholder:text-fg-muted",
            part === "literal" && "px-0 text-fg-muted",
          )}
        >
          {segValue}
        </DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
