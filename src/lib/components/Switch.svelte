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

<!-- The `rounded-full` exception to the radius system (documented brand rule). Bits owns role="switch" + keyboard; the
     thumb slides on state. -->
<Switch.Root
  bind:checked
  {...aria.resolvedId ? { id: aria.resolvedId } : {}}
  aria-invalid={aria.ariaInvalid}
  aria-describedby={aria.ariaDescribedby}
  class={cn(
    // Off-state edge uses the stronger `--divider`, not the faint hairline: like the secondary Button, the resting
    // border is the track's whole presence against the page, so the hairline (≈1.1:1 in Evening) is too weak to read.
    "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-divider bg-surface-raised px-0.5 transition-colors",
    "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
    "disabled:opacity-50",
    // Hover treatment is :enabled-gated so disabled switches never show a hover state. Unchecked: border lights to
    // accent. Checked (filled): accent deepens one honey step.
    "enabled:data-[state=unchecked]:hover:border-accent",
    "enabled:data-[state=checked]:hover:bg-honey-600 enabled:data-[state=checked]:hover:border-honey-600",
    klass,
    "focus-ring",
  )}
  {...rest}
>
  <!-- translate-x-5.5 = 22px so the on-state right gap matches the off-state 2px left gap: the track padding-box (w-11
       44px minus 2x1px border) is 42px, less px-0.5 (2px each side) and the 16px thumb; translate-x-5 (20px) left a 4px
       right gap. -->
  <!-- Off-state thumb is `fg-muted` so the knob (the state signal) clears WCAG non-text contrast against the
       surface-raised track in both themes — a `surface` thumb there is only ~1:1 in Evening. Checked, it returns to
       `surface` to read against the honey fill. -->
  <Switch.Thumb
    class="size-4 rounded-full bg-fg-muted shadow-(--shadow-sm) transition-transform data-[state=checked]:translate-x-5.5 data-[state=checked]:bg-surface"
  />
</Switch.Root>
