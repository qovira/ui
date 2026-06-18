---
"@qovira/ui": patch
---

Fix the Destructive button and IconButton hover and active states: the old `brightness()` CSS filter dimmed the whole element including the white text, yielding a near-imperceptible hover step and dropping white-on-fill contrast below WCAG AA on the active state. The background is now darkened with `color-mix(in srgb, …, black N%)`, leaving `text-white` at pure #fff; computed WCAG AA ratios improve from 4.85:1 at rest to 5.72:1 on hover and 6.65:1 on active.
