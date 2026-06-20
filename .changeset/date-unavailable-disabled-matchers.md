---
"@qovira/ui": minor
---

`Calendar`, `DateField`, and `DatePicker` now accept `isDateUnavailable` and `isDateDisabled` matchers, so consumers can mark specific dates (e.g. a booked slot) unavailable — struck-through and not selectable — or disabled, distinct from the range-bounding `minValue`/`maxValue`. This also makes the calendar's existing `data-unavailable` day styling reachable.
