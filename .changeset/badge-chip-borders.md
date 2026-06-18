---
"@qovira/ui": patch
---

Border every Badge and Chip tone consistently: the four status tones (`info` / `success` / `warning` / `error`) now carry the same hairline border (`border-border`) as the neutral tone, which previously was the only tone with a border. Badges and chips now read consistently across tones in both themes; the tint/text pairings are unchanged.
