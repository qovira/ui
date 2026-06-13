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

export interface ResolvedFieldAria {
  readonly resolvedId: string | undefined;
  readonly ariaInvalid: AriaAttributes["aria-invalid"];
  readonly ariaDescribedby: string | undefined;
  /** The Field's label id, for a non-labelable part (e.g. a listbox panel) that
   *  names itself via `aria-labelledby`. */
  readonly labelId: string | undefined;
}

/**
 * Resolve a labelable control's `id` + `aria-invalid`/`aria-describedby` against
 * an enclosing `Field`'s context, with an explicit prop always winning (so the
 * control also works standalone). Pass the overrides as a getter so they stay
 * reactive; the returned values are reactive too. Single source of truth for
 * Input/Textarea/Checkbox/Switch — the resolution was previously copied verbatim
 * across all four.
 */
export function resolveFieldAria(overrides: () => FieldAriaOverrides): ResolvedFieldAria {
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const o = $derived(overrides());
  const resolvedId = $derived(o.id ?? ctx?.id);
  const ariaInvalid = $derived(o.invalid ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(o.describedby ?? ctx?.describedby);
  const labelId = $derived(ctx?.labelId);
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
  };
}
