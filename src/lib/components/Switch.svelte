<script lang="ts">
  import { Switch } from "bits-ui";
  import { cn } from "../internal/cn.js";
  import { getFieldContext } from "../internal/field-context.js";

  interface Props extends Switch.RootProps {
    class?: string;
  }

  let { checked = $bindable(false), id, class: klass, "aria-invalid": invalidProp, "aria-describedby": describedbyProp, ...rest }: Props = $props();

  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
</script>

<!-- The `rounded-full` exception to the radius system (documented brand rule).
     Bits owns role="switch" + keyboard; the thumb slides on state. -->
<Switch.Root
  bind:checked
  {...resolvedId ? { id: resolvedId } : {}}
  aria-invalid={ariaInvalid}
  aria-describedby={ariaDescribedby}
  class={cn(
    "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-surface-raised px-0.5 transition-colors",
    "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
    "disabled:opacity-50",
    klass,
    "focus-ring",
  )}
  {...rest}
>
  <Switch.Thumb class="h-4 w-4 rounded-full bg-surface shadow-[var(--shadow-sm)] transition-transform data-[state=checked]:translate-x-5" />
</Switch.Root>
