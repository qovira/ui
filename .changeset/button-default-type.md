---
"@qovira/ui": major
---

`Button` and `IconButton` now default to `type="button"`. A bare `<button>` defaults to `type="submit"`, so a button placed inside a `<form>` previously submitted it on click; the new default prevents that surprise. Pass `type="submit"` explicitly to opt into form submission.
