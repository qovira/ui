<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { getFieldContext } from "../internal/field-context.js";

  interface Props extends HTMLTextareaAttributes {
    class?: string;
  }

  let {
    class: klass,
    id,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
    ...rest
  }: Props = $props();

  // Same Field-contract inheritance as Input; explicit props win.
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
</script>

<textarea
  {...rest}
  id={resolvedId}
  aria-invalid={ariaInvalid}
  aria-describedby={ariaDescribedby}
  class={cn("flex min-h-20 py-2", FIELD_CONTROL_BASE, klass, "focus-ring")}
></textarea>
