# @qovira/ui

## 2.0.0

### Major Changes

- f5d1c30: `Button` and `IconButton` now default to `type="button"`. A bare `<button>` defaults to `type="submit"`, so a button placed inside a `<form>` previously submitted it on click; the new default prevents that surprise. Pass `type="submit"` explicitly to opt into form submission.
- f5d1c30: Raise the `@qovira/theme` peer dependency floor to `^1.1.0` (from `^1.0.2`). Consumers must upgrade `@qovira/theme` to at least `1.1.0`.

### Patch Changes

- f5d1c30: Accessibility, correctness, and performance fixes from a codebase review:
  - `Field` no longer emits a dangling `<label for>` when it wraps a group control (`RadioGroup`, `Calendar`) that names itself via `aria-labelledby`.
  - `Button` (as a link) no longer strips a consumer-supplied `tabindex`/`aria-busy` passed through on an active anchor.
  - `Toast`'s auto-dismiss timer no longer re-arms when a sibling toast is added or dismissed; the pause/resume timing is now covered by unit tests.
  - `Combobox` computes its filter needle once per keystroke instead of once per option.

## 1.0.0

### Major Changes

- 8915708: Initial public release of `@qovira/ui` — Qovira's Svelte 5 component library
  built on `@qovira/theme`'s tokens.

  Ships the foundational set: layout primitives (`Box`, `Stack`, `Grid`,
  `Container`, `Divider`), core controls (`Button`, `Icon`, `Link`), form controls
  (text/select/checkbox/radio/switch fields and their labels), overlays and
  navigation (`Modal`, `Popover`, `Tooltip`, `Menu`, `Tabs`), and feedback, status
  and data display (`Alert`, `Badge`, `Chip`, `Spinner`, `Skeleton`, `Avatar`,
  `Table`). Every component is authored entirely in `@qovira/theme` semantic
  utilities and applies the theme's `focus-ring` on each interactive part.
