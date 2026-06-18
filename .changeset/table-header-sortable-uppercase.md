---
"@qovira/ui": patch
---

Sortable table header cells now render uppercase, matching the non-sortable ones. The casing lives on the `<th>` and was meant to inherit into the sortable header's inner `<button>`, but a UA-stylesheet quirk could suppress `text-transform` inheritance on the button — so `uppercase` is now set on the button explicitly.
