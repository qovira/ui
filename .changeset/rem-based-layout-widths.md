---
"@qovira/ui": patch
---

Layout widths now use Tailwind's rem-based scale tokens instead of hard-coded pixel/literal values: the Modal (`max-w-120`), the toast viewport (`max-w-90`), the Container's content cap (`max-w-240`), and the menu/submenu panel (`min-w-40`). At the default 16px root font these render identically to before (480px / 360px / 960px / 10rem); the difference is that they now scale with the user's root font-size, which is the more accessible default. The prose Container width stays `max-w-[70ch]` (a deliberate character-measure with no scale-token equivalent).
