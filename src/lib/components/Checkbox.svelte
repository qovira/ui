<script lang="ts">
  import { Checkbox } from "bits-ui";
  import CheckIcon from "phosphor-svelte/lib/CheckIcon";
  import MinusIcon from "phosphor-svelte/lib/MinusIcon";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria } from "../internal/field-aria.svelte.js";

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
  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));
</script>

<!-- Bits owns the role/keyboard/ARIA; the wrapper paints the box and swaps the
     glyph by state. `focus-ring` is appended last so a consumer class can't
     strip it. The check glyph is a sized indicator, not a standalone <Icon>. -->
<Checkbox.Root
  bind:checked
  bind:indeterminate
  {...aria.resolvedId ? { id: aria.resolvedId } : {}}
  aria-invalid={aria.ariaInvalid}
  aria-describedby={aria.ariaDescribedby}
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
  {#snippet children({ checked: isChecked, indeterminate: isIndeterminate })}
    <!-- Decorative glyph: the control's state is conveyed by aria-checked, so the
         indicator is hidden from assistive tech. Sized to the box, hence a raw
         Phosphor icon rather than the size-locked <Icon> wrapper. Snippet params
         are renamed so they don't shadow the outer bindable checked/indeterminate. -->
    {#if isIndeterminate}
      <MinusIcon size={14} weight="bold" color="currentColor" aria-hidden="true" />
    {:else if isChecked}
      <CheckIcon size={14} weight="bold" color="currentColor" aria-hidden="true" />
    {/if}
  {/snippet}
</Checkbox.Root>
