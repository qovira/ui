<script lang="ts">
  import { DateField } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  import { cn } from "../internal/cn.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { getFieldContext } from "../internal/field-context.js";

  type Granularity = "day" | "hour" | "minute" | "second";

  interface Props {
    /** The entered date/time. */
    value?: DateValue | undefined;
    minValue?: DateValue;
    maxValue?: DateValue;
    disabled?: boolean;
    readonly?: boolean;
    /** Smallest editable unit — `"day"` (default) through `"second"` for time. */
    granularity?: Granularity;
    hourCycle?: 12 | 24;
    /** Name for the hidden form input (submits the ISO value). */
    name?: string;
    id?: string;
    class?: string;
    /** Fires whenever the value changes. */
    onValueChange?: (value: DateValue | undefined) => void;
    "aria-label"?: string;
    "aria-invalid"?: boolean | "true" | "false" | undefined;
    "aria-describedby"?: string | undefined;
  }

  let {
    value = $bindable(),
    minValue,
    maxValue,
    disabled = false,
    readonly = false,
    granularity,
    hourCycle,
    name,
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

<!-- Bits owns the segmented-entry behavior (per-segment focus, arrow stepping,
     ARIA spinbuttons, the hidden form input). The wrapper styles the group and
     segments; each segment carries `focus-ring` (it's the focusable element). -->
<!-- Controlled value via one-way prop + writeback: passing `undefined` to the
     non-optional Bits `value` is rejected under exactOptionalPropertyTypes; the
     cast lets the legitimate empty/clear `undefined` flow through at runtime. -->
<DateField.Root
  value={value as DateValue}
  onValueChange={(v) => {
    value = v;
    onValueChange?.(v);
  }}
  {disabled}
  {readonly}
  {...opts}
>
  <DateField.Input
    {...resolvedId ? { id: resolvedId } : {}}
    {...groupName}
    {...name ? { name } : {}}
    aria-invalid={ariaInvalid}
    aria-describedby={ariaDescribedby}
    class={cn(FIELD_CONTROL_BASE, "inline-flex h-10 w-auto items-center gap-px", klass)}
  >
    {#snippet children({ segments })}
      {#each segments as { part, value: segValue }, i (i)}
        <DateField.Segment
          {part}
          class={cn(
            "focus-ring rounded-sm px-0.5 tabular-nums text-text",
            "data-[placeholder]:text-text-muted",
            part === "literal" && "px-0 text-text-muted",
          )}
        >
          {segValue}
        </DateField.Segment>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root>
