<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { getFieldContext } from "../internal/field-context.js";

  interface Props extends HTMLInputAttributes {
    class?: string;
  }

  let { class: klass, id, "aria-invalid": invalidProp, "aria-describedby": describedbyProp, ...rest }: Props = $props();

  // Inherit the Field contract from context, but an explicit prop always wins
  // (so the control also works standalone, outside a Field).
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
</script>

<input
  {...rest}
  id={resolvedId}
  aria-invalid={ariaInvalid}
  aria-describedby={ariaDescribedby}
  class={cn("flex h-10", FIELD_CONTROL_BASE, klass, "focus-ring")}
/>
