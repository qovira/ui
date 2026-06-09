// Shared, consumer-importable item shapes for the items-driven navigation
// components. Plain `.ts` (not re-exported from a `.svelte` module) so the
// named types survive `tsc`/`svelte-check` and reach consumers via the barrel.

/** One tab: its `value` (the binding key) and visible `label`. */
export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/** One accordion section: its `value` (the open-state key) and `title`. */
export interface AccordionItem {
  value: string;
  title: string;
  disabled?: boolean;
}
