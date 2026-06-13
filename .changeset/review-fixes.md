---
"@qovira/ui": patch
---

Accessibility, correctness, and performance fixes from a codebase review:

- `Field` no longer emits a dangling `<label for>` when it wraps a group control (`RadioGroup`, `Calendar`) that names itself via `aria-labelledby`.
- `Button` (as a link) no longer strips a consumer-supplied `tabindex`/`aria-busy` passed through on an active anchor.
- `Toast`'s auto-dismiss timer no longer re-arms when a sibling toast is added or dismissed; the pause/resume timing is now covered by unit tests.
- `Combobox` computes its filter needle once per keystroke instead of once per option.
