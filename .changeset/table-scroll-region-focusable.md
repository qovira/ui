---
"@qovira/ui": minor
---

`Table` now makes its horizontal-scroll wrapper a keyboard-focusable, named region (`role="region"` + `tabindex="0"`) while — and only while — the table actually overflows its container, so keyboard-only users can scroll a wide table (WCAG 2.1.1). A new `scrollRegionLabel` prop names that region (defaults to `"Table"`). A table that fits is unchanged — no extra tab stop.
