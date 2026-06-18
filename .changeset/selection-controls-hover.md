---
"@qovira/ui": patch
---

Checkbox, Switch, and RadioItem now share a consistent, disabled-safe hover state: the border lights to accent when unchecked, and deepens to honey-600 when checked (or indeterminate for Checkbox); all hover rules are `:enabled`-gated so disabled controls show no hover feedback.
