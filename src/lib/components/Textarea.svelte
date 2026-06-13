<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria } from "../internal/field-aria.svelte.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";

  interface Props extends HTMLTextareaAttributes {
    class?: string;
  }

  let { class: klass, id, "aria-invalid": invalidProp, "aria-describedby": describedbyProp, ...rest }: Props = $props();

  // Same Field-contract inheritance as Input; explicit props win.
  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));
</script>

<textarea
  {...rest}
  id={aria.resolvedId}
  aria-invalid={aria.ariaInvalid}
  aria-describedby={aria.ariaDescribedby}
  class={cn("flex min-h-20 py-2", FIELD_CONTROL_BASE, klass, "focus-ring")}
></textarea>
