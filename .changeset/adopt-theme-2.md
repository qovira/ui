---
"@qovira/ui": minor
---

Adopt `@qovira/theme` 2.x and raise the peer range to `^2.1.0`. Components use theme 2.0.0's renamed utilities — foreground `text-fg`/`text-fg-muted` (was `text-text`/`text-text-muted`) and property-first status utilities `bg-tint-{role}`/`text-fg-{role}` (was `bg-{role}-tint`/`text-{role}-text`) — and theme 2.1.0's new `divider` token (`bg-divider`/`border-divider`). No `@qovira/ui` API or prop changed; consumers must upgrade `@qovira/theme` to `>=2.1.0`, whose tokens these classes resolve against.
