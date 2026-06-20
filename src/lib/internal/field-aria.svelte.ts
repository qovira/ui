import type { AriaAttributes } from "svelte/elements";
import { getFieldContext } from "./field-context.js";

export interface FieldAriaOverrides {
  /** Explicit control `id` — wins over the Field's. */
  id?: string | null | undefined;
  /** Explicit `aria-invalid` — wins over the Field's invalid state. */
  invalid?: AriaAttributes["aria-invalid"];
  /** Explicit `aria-describedby` — wins over the Field's. */
  describedby?: string | null | undefined;
}

/**
 * The aria props every Bits-wrapping control exposes so it can name itself / reflect validity standalone (the explicit
 * values win over an enclosing `Field`). Shared so Select/Combobox and the date controls — which wrap Bits rather than
 * an HTML element, so they can't inherit these from `HTMLAttributes` — declare the trio once instead of copying it.
 */
export interface FieldAriaProps {
  "aria-label"?: string;
  "aria-invalid"?: boolean | "true" | "false" | undefined;
  "aria-describedby"?: string | undefined;
}

export interface ResolvedFieldAria {
  readonly resolvedId: string | undefined;
  readonly ariaInvalid: AriaAttributes["aria-invalid"];
  readonly ariaDescribedby: string | undefined;
  /** The Field's label id, for a non-labelable part (e.g. a listbox panel) that names itself via `aria-labelledby`. */
  readonly labelId: string | undefined;
  /** The Field's label text, for a group control (e.g. the calendar grid) that names itself with a string prop. */
  readonly labelText: string | undefined;
}

/**
 * Resolve a labelable control's `id` + `aria-invalid`/`aria-describedby` against an enclosing `Field`'s context, with
 * an explicit prop always winning (so the control also works standalone). Pass the overrides as a getter so they stay
 * reactive; the returned values are reactive too. Single source of truth for the Bits-wrapping controls
 * (Input/Textarea/Checkbox/Switch/Select/Combobox and the date controls) — the resolution was previously copied
 * verbatim across all of them.
 */
export function resolveFieldAria(overrides: () => FieldAriaOverrides): ResolvedFieldAria {
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const o = $derived(overrides());
  const resolvedId = $derived(o.id ?? ctx?.id);
  const ariaInvalid = $derived(o.invalid ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(o.describedby ?? ctx?.describedby);
  const labelId = $derived(ctx?.labelId);
  const labelText = $derived(ctx?.labelText);
  return {
    get resolvedId() {
      return resolvedId ?? undefined;
    },
    get ariaInvalid() {
      return ariaInvalid;
    },
    get ariaDescribedby() {
      return ariaDescribedby;
    },
    get labelId() {
      return labelId;
    },
    get labelText() {
      return labelText;
    },
  };
}
