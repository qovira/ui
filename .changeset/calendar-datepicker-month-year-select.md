---
"@qovira/ui": patch
---

Calendar and DatePicker now expose month and year selectors in their headers, so users can jump directly to a month and year instead of only stepping month-by-month with the prev/next buttons. The selectors render as styled native `<select>`s wired to the calendar placeholder; selection behavior, keyboard navigation, and accessibility are unchanged.
