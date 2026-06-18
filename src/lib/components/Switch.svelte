<script lang="ts">
  import { Switch } from "bits-ui";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria } from "../internal/field-aria.svelte.js";

  interface Props extends Switch.RootProps {
    class?: string;
  }

  let {
    checked = $bindable(false),
    id,
    class: klass,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
    ...rest
  }: Props = $props();

  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));
</script>

<!-- The `rounded-full` exception to the radius system (documented brand rule).
     Bits owns role="switch" + keyboard; the thumb slides on state. -->
<Switch.Root
  bind:checked
  {...aria.resolvedId ? { id: aria.resolvedId } : {}}
  aria-invalid={aria.ariaInvalid}
  aria-describedby={aria.ariaDescribedby}
  class={cn(
    "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-surface-raised px-0.5 transition-colors",
    "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
    "disabled:opacity-50",
    // Hover treatment is :enabled-gated so disabled switches never show a hover state.
    // Unchecked: border lights to accent. Checked (filled): accent deepens one honey step.
    "enabled:data-[state=unchecked]:hover:border-accent",
    "enabled:data-[state=checked]:hover:bg-honey-600 enabled:data-[state=checked]:hover:border-honey-600",
    klass,
    "focus-ring",
  )}
  {...rest}
>
  <Switch.Thumb
    class="h-4 w-4 rounded-full bg-surface shadow-[var(--shadow-sm)] transition-transform data-[state=checked]:translate-x-5"
  />
</Switch.Root>
