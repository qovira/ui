---
"@qovira/ui": patch
---

A `toast()` raised with a non-finite or out-of-range `duration` (e.g. `Infinity`, or a value past the ~24.8-day `setTimeout` ceiling) now stays persistent instead of self-dismissing almost immediately — `setTimeout` would otherwise coerce such a delay to ~1ms. `duration: 0` remains the canonical way to make a sticky toast.
