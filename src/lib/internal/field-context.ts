import { getContext, setContext } from "svelte";

/**
 * The accessibility contract a `Field` exposes to whatever control it wraps.
 * `Input`, `Textarea`, and the later Bits-backed controls all consume this same
 * shape so labels, validity, and help/error wiring are correct by construction.
 */
export interface FieldContext {
  /** The control's `id` — links it to the `<label for>`. */
  id: string;
  /** The label's `id` — for group controls (e.g. a radiogroup) that name
   *  themselves via `aria-labelledby` rather than a `<label for>`. */
  labelId: string;
  /** The label's text — for controls that name themselves with a string prop
   *  rather than an id reference (e.g. the calendar's `calendarLabel`). */
  labelText: string;
  /** Whether the field is in an error state (drives `aria-invalid`). */
  invalid: boolean;
  /** Space-separated ids of the help/error text (drives `aria-describedby`). */
  describedby: string | undefined;
}

const KEY = Symbol("qovira-field");

/**
 * Seed the field contract for descendant controls. Pass a getter (not a plain
 * object) so the values stay reactive across the context boundary — a control
 * reading it inside `$derived` re-runs when the `Field`'s `error` changes.
 */
export function setFieldContext(get: () => FieldContext): void {
  setContext(KEY, get);
}

/** Read the enclosing field contract, if any (controls also work standalone). */
export function getFieldContext(): (() => FieldContext) | undefined {
  return getContext<(() => FieldContext) | undefined>(KEY);
}

const GROUP_KEY = Symbol("qovira-field-group");

/**
 * Seed a callback a group control (a radiogroup, a calendar grid) can invoke to
 * tell its `Field` that it names itself via `aria-labelledby`. The `Field` then
 * drops the `<label for>` it would otherwise point at the group — a `for` can
 * only target a single labelable element, so on a group it would dangle.
 */
export function setFieldGroupRegistrar(registerGroup: () => void): void {
  setContext(GROUP_KEY, registerGroup);
}

/** Read the enclosing field's group registrar, if any. */
export function getFieldGroupRegistrar(): (() => void) | undefined {
  return getContext<(() => void) | undefined>(GROUP_KEY);
}
