---
"@qovira/ui": patch
---

`Field` error messages are now an `aria-live="polite"` region, so a validation error that appears after the user has moved past the control is announced to screen readers (the `aria-describedby` wiring alone only surfaced it on focus). No API change.
