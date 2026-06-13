// Shared class recipes for the month-grid parts, so the standalone <Calendar>
// and the <DatePicker> popover calendar stay visually identical. They render
// different bits-ui namespaces (Calendar.* vs DatePicker.*), so a shared snippet
// is impossible — but the class strings can live in one place. Internal — not
// exported from the barrel. @qovira/theme utilities only.

// The prev/next month nav buttons.
export const CALENDAR_NAV_BUTTON =
  "focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-text hover:bg-surface disabled:opacity-50";

// A single day cell. Static (no conditionals/consumer input), so callers
// reference it directly rather than re-running cn() per cell. The `data-*` hooks
// are the attributes bits sets per day (selected/today/disabled/outside-month).
export const CALENDAR_DAY =
  "focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md text-body font-sans text-text " +
  "hover:bg-surface data-[disabled]:opacity-40 data-[unavailable]:text-text-muted data-[unavailable]:line-through " +
  "data-[outside-month]:pointer-events-none data-[outside-month]:opacity-40 " +
  "data-[selected]:bg-accent data-[selected]:text-warm-900 data-[today]:font-semibold";
