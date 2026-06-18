---
"@qovira/ui": minor
---

Adopt `@qovira/theme` 2.0.0 and raise the peer range to `^2.0.0`. Components now use theme 2.0.0's renamed utilities — foreground `text-fg`/`text-fg-muted` (was `text-text`/`text-text-muted`) and property-first status utilities `bg-tint-{role}`/`text-fg-{role}` (was `bg-{role}-tint`/`text-{role}-text`). No component API or prop changed, but the raised peer range is breaking: consumers must upgrade `@qovira/theme` to `>=2.0.0`, whose tokens these classes resolve against.
