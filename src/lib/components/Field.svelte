<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { setFieldContext, type FieldContext } from "../internal/field-context.js";

  interface Props {
    /** The label text — always rendered and linked to the control. */
    label: string;
    /** Optional help text shown under the control (non-error guidance). */
    description?: string;
    /** When set, the field is invalid: the message shows and `aria-invalid` +
     *  `aria-describedby` are wired onto the control. Error is never color-only. */
    error?: string;
    class?: string;
    /** The control. Receives the contract as an arg; nested controls also read
     *  it from context, so no prop-drilling is required either way. */
    children: Snippet<[FieldContext]>;
  }

  let { label, description, error, class: klass, children }: Props = $props();

  // SSR-safe unique base id; derive the part ids from it.
  const uid = $props.id();
  const controlId = `${uid}-control`;
  const labelId = `${uid}-label`;
  const descId = `${uid}-description`;
  const errorId = `${uid}-error`;

  const invalid = $derived(Boolean(error));
  // describedby points at whichever help/error text exists (both, if both do).
  const describedby = $derived(
    [description ? descId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined,
  );
  const ctx = $derived<FieldContext>({ id: controlId, labelId, invalid, describedby });

  // Getter keeps the contract reactive across the context boundary.
  setFieldContext(() => ctx);
</script>

<div class={cn("flex flex-col gap-2", klass)}>
  <label id={labelId} for={controlId} class="text-label font-sans uppercase text-text-muted"
    >{label}</label
  >
  {@render children(ctx)}
  {#if description}
    <p id={descId} class="text-small font-sans text-text-muted">{description}</p>
  {/if}
  {#if error}
    <p id={errorId} class="text-small font-sans text-error-text">{error}</p>
  {/if}
</div>
