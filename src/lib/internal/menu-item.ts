// Shared base classes for the menu parts, so the matching parts stay visually
// identical. Internal — not exported from the barrel. Authored only in
// @qovira/theme utilities; the `data-[highlighted]`/`data-[disabled]` hooks are
// the attributes Bits sets as the user navigates with keyboard or pointer.

// The interactive, row-shaped parts (`Menu.Item` and `Menu.SubTrigger`).
export const MENU_ITEM_BASE =
  "flex cursor-default select-none items-center gap-2 rounded-md px-3 py-2 " +
  "text-body font-sans text-text outline-none " +
  "data-[highlighted]:bg-link/8 data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

// The floating panel surface shared by `Menu.Content` and `Menu.SubContent` (a
// submenu panel is the same surface as its parent menu, so the two must match).
export const MENU_PANEL_BASE =
  "z-50 min-w-[10rem] rounded-xl border border-border bg-surface-raised p-1.5 " +
  "text-text shadow-[var(--shadow-lg)] duration-overlay ease-qovira";
