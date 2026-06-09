// Shared base classes for the interactive, row-shaped menu parts (`Menu.Item`
// and `Menu.SubTrigger`) so they stay visually identical. Internal — not
// exported from the barrel. Authored only in @qovira/theme utilities; the
// `data-[highlighted]`/`data-[disabled]` hooks are the attributes Bits sets as
// the user navigates with keyboard or pointer.
export const MENU_ITEM_BASE =
  "flex cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-body font-sans text-text outline-none data-[highlighted]:bg-link/8 data-[disabled]:pointer-events-none data-[disabled]:opacity-40";
