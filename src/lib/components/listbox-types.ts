/**
 * One option in a listbox-style control (`Select`, `Combobox`). Mirrors the shape Bits UI's `Item` expects: `value` is
 * what's committed, `label` is what the user reads and (in `Combobox`) types against. Lives in a plain `.ts` so the
 * type is importable by consumers — a `*.svelte` module only carries its default export, so a named type re-exported
 * from one is invisible to `tsc`.
 */
export interface ListboxItem {
  /** The value committed when this option is chosen. */
  value: string;
  /** The human-readable label shown in the list and the trigger. */
  label: string;
  /** Whether this option is non-selectable. */
  disabled?: boolean;
}
