<script lang="ts">
  import { Checkbox } from "bits-ui";
  import { CheckIcon, MinusIcon } from "phosphor-svelte";
  import { cn } from "../internal/cn.js";
  import { getFieldContext } from "../internal/field-context.js";

  interface Props extends Checkbox.RootProps {
    class?: string;
  }

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    id,
    class: klass,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
    ...rest
  }: Props = $props();

  // Inherit the Field contract from context; explicit props win (works standalone).
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
</script>

<!-- Bits owns the role/keyboard/ARIA; the wrapper paints the box and swaps the
     glyph by state. `focus-ring` is appended last so a consumer class can't
     strip it. The check glyph is a sized indicator, not a standalone <Icon>. -->
<Checkbox.Root
  bind:checked
  bind:indeterminate
  {...resolvedId ? { id: resolvedId } : {}}
  aria-invalid={ariaInvalid}
  aria-describedby={ariaDescribedby}
  class={cn(
    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-surface-raised text-warm-900 transition-colors",
    "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
    "data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent",
    "disabled:opacity-50",
    klass,
    "focus-ring",
  )}
  {...rest}
>
  {#snippet children({ checked, indeterminate })}
    <!-- Decorative glyph: the control's state is conveyed by aria-checked, so the
         indicator is hidden from assistive tech. Sized to the box, hence a raw
         Phosphor icon rather than the size-locked <Icon> wrapper. -->
    {#if indeterminate}
      <MinusIcon size={14} weight="bold" color="currentColor" aria-hidden="true" />
    {:else if checked}
      <CheckIcon size={14} weight="bold" color="currentColor" aria-hidden="true" />
    {/if}
  {/snippet}
</Checkbox.Root>
