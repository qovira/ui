<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria } from "../internal/field-aria.svelte.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";

  interface Props extends HTMLInputAttributes {
    class?: string;
  }

  let { class: klass, id, "aria-invalid": invalidProp, "aria-describedby": describedbyProp, ...rest }: Props = $props();

  // Inherit the Field contract from context, but an explicit prop always wins
  // (so the control also works standalone, outside a Field).
  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));
</script>

<input
  {...rest}
  id={aria.resolvedId}
  aria-invalid={aria.ariaInvalid}
  aria-describedby={aria.ariaDescribedby}
  class={cn("flex h-10", FIELD_CONTROL_BASE, klass, "focus-ring")}
/>
