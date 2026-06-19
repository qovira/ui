// Shared class recipes for the month-grid parts, so the standalone <Calendar> and the <DatePicker> popover calendar
// stay visually identical. They render different bits-ui namespaces (Calendar.* vs DatePicker.*), so a shared snippet
// is impossible — but the class strings can live in one place. Internal — not exported from the barrel. @qovira/theme
// utilities only.

// The prev/next month nav buttons.
export const CALENDAR_NAV_BUTTON =
  "focus-ring inline-flex size-8 items-center justify-center rounded-md text-fg hover:bg-surface disabled:opacity-50";

// The native <select> elements for month and year in the calendar header. A native select is used deliberately (bits-ui
// spreads restProps directly onto <select>); no need for the kit's bits-ui Select wrapper. Matches nav-button height
// (h-8) and uses the same surface/fg tokens so both themes render cleanly.
export const CALENDAR_SELECT =
  "focus-ring h-8 cursor-pointer rounded-md bg-surface-raised px-2 text-body font-sans text-fg " +
  "border border-border disabled:opacity-50";

// A single day cell. Static (no conditionals/consumer input), so callers reference it directly rather than re-running
// cn() per cell. The `data-*` hooks are the attributes bits sets per day (selected/today/disabled/outside-month).
// Adjacent-month days (the leading/trailing fixed-weeks padding) stay interactive — clicking one selects it and bits
// snaps the view to its month — so they can't use `pointer-events-none`, nor the `opacity-40` dim used for genuinely
// disabled days: an enabled control must clear AA contrast (opacity-40 lands at ~3.4:1). The muted secondary colour
// de-emphasises them while staying legible (~7:1).
export const CALENDAR_DAY =
  "focus-ring inline-flex size-9 items-center justify-center rounded-md text-body font-sans text-fg " +
  "hover:bg-surface data-disabled:opacity-40 data-unavailable:text-fg-muted data-unavailable:line-through " +
  "data-outside-month:text-fg-muted " +
  "data-selected:bg-accent data-selected:text-warm-900 data-today:font-semibold";
