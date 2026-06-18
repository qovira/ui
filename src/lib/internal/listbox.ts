// Shared dropdown-panel + option-row recipes for the listbox-style controls
// (Select and Combobox), defined once so the two stay visually identical — the
// sibling of MENU_PANEL_BASE/MENU_ITEM_BASE for the menu parts. Internal — not
// exported from the barrel. Authored only in @qovira/theme utilities.

// The floating dropdown panel that holds the options.
export const LISTBOX_CONTENT_BASE =
  "z-50 max-h-60 min-w-[var(--bits-floating-anchor-width)] overflow-y-auto " +
  "rounded-md border border-border bg-surface-raised p-1 shadow-[var(--shadow-lg)] " +
  "duration-overlay ease-qovira";

// A single selectable option row; `data-[highlighted]`/`data-[selected]`/`data-[disabled]` are
// the attributes Bits sets as the user navigates or commits a selection.
// `data-[selected]:` is listed before `data-[highlighted]:` in source order so the highlight
// background wins visually when a row is both selected and highlighted — the checkmark and
// `font-medium` weight carry the selected signal even when the highlight background is active.
export const LISTBOX_ITEM_BASE =
  "flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5 " +
  "text-body font-sans text-fg outline-none " +
  "data-[selected]:bg-accent/12 data-[selected]:font-medium " +
  "data-[highlighted]:bg-link/8 data-[disabled]:pointer-events-none data-[disabled]:opacity-50";
