# @qovira/ui

## 2.1.0

### Minor Changes

- 60ffb9e: Adopt `@qovira/theme` 2.x and raise the peer range to `^2.1.0`. Components use theme 2.0.0's renamed utilities — foreground `text-fg`/`text-fg-muted` (was `text-text`/`text-text-muted`) and property-first status utilities `bg-tint-{role}`/`text-fg-{role}` (was `bg-{role}-tint`/`text-{role}-text`) — and theme 2.1.0's new `divider` token (`bg-divider`/`border-divider`). No `@qovira/ui` API or prop changed; consumers must upgrade `@qovira/theme` to `>=2.1.0`, whose tokens these classes resolve against.
- 8894639: DateField, DatePicker, and Calendar now accept a `locale` prop (BCP-47 tag) and default it to `"en-GB"`, so dates render in European style out of the box: DateField and DatePicker segments order dd/mm (previously the en-US mm/dd default) and both the standalone Calendar and the DatePicker's calendar start the week on Monday. Pass an explicit `locale` (e.g. `"en-US"`) to override. Note this changes the default rendered date format and week start for consumers who relied on the previous en-US default.
- f7a92ec: `Calendar`, `DateField`, and `DatePicker` now accept `isDateUnavailable` and `isDateDisabled` matchers, so consumers can mark specific dates (e.g. a booked slot) unavailable — struck-through and not selectable — or disabled, distinct from the range-bounding `minValue`/`maxValue`. This also makes the calendar's existing `data-unavailable` day styling reachable.
- c098eb0: `Table` now makes its horizontal-scroll wrapper a keyboard-focusable, named region (`role="region"` + `tabindex="0"`) while — and only while — the table actually overflows its container, so keyboard-only users can scroll a wide table (WCAG 2.1.1). A new `scrollRegionLabel` prop names that region (defaults to `"Table"`). A table that fits is unchanged — no extra tab stop.

### Patch Changes

- 910e259: Avatar now borders with the `divider` token instead of the hairline, so the circle silhouette is clearly distinguishable from the page background in the Evening theme — where the hairline previously dissolved into the near-identical warm-brown surface. The fill and initials are unchanged, so initials contrast is unaffected.
- c915728: Border every Badge and Chip tone consistently: the four status tones (`info` / `success` / `warning` / `error`) now carry the same hairline border (`border-border`) as the neutral tone, which previously was the only tone with a border. Badges and chips now read consistently across tones in both themes; the tint/text pairings are unchanged.
- a36c377: Calendar and DatePicker now expose month and year selectors in their headers, so users can jump directly to a month and year instead of only stepping month-by-month with the prev/next buttons. The selectors render as styled native `<select>`s wired to the calendar placeholder; selection behavior, keyboard navigation, and accessibility are unchanged.
- 607c83e: The Combobox now opens its options list when the search input is clicked, not only when the trigger icon is clicked. Typeahead filtering, the trigger toggle, and keyboard behavior are unchanged; the list is intentionally not opened on focus so that tabbing through a form doesn't auto-open it.
- 1550e36: Fix the single-select `Combobox` input text: a preset `value` now renders its option's label on mount (it previously showed an empty field), and typing a filter then dismissing the listbox without selecting now reverts the input to the committed selection's label instead of leaving the abandoned search text behind. The wrapper now renders the input itself (via Bits' `child` snippet) so its displayed value tracks the committed selection. No API change.
- 69dd5be: Disabled DateField and DatePicker controls now visibly dim (opacity-50) like the other form controls. The shared field recipe's `disabled:opacity-50` was dead on these two — their input is a `<div role="group">`, which the CSS `:disabled` pseudo-class never matches — so a `data-[disabled]:opacity-50` selector (the attribute bits-ui sets when disabled) was added alongside it.
- 2f8b602: Fix the Destructive button and IconButton hover and active states: the old `brightness()` CSS filter dimmed the whole element including the white text, yielding a near-imperceptible hover step and dropping white-on-fill contrast below WCAG AA on the active state. The background is now darkened with `color-mix(in srgb, …, black N%)`, leaving `text-white` at pure #fff; computed WCAG AA ratios improve from 4.85:1 at rest to 5.72:1 on hover and 6.65:1 on active.
- c098eb0: `Field` error messages are now an `aria-live="polite"` region, so a validation error that appears after the user has moved past the control is announced to screen readers (the `aria-describedby` wiring alone only surfaced it on focus). No API change.
- a5ab033: Selected options are now clearly distinguished in the open Select and Combobox listboxes: a selected row carries an accent-tinted background and medium weight in addition to the existing checkmark, in both single and multiple modes. Previously the only selected cue was a faint checkmark, which was hard to scan — especially in a multi-select list.
- de62643: Layout widths now use Tailwind's rem-based scale tokens instead of hard-coded pixel/literal values: the Modal (`max-w-120`), the toast viewport (`max-w-90`), the Container's content cap (`max-w-240`), and the menu/submenu panel (`min-w-40`). At the default 16px root font these render identically to before (480px / 360px / 960px / 10rem); the difference is that they now scale with the user's root font-size, which is the more accessible default. The prose Container width stays `max-w-[70ch]` (a deliberate character-measure with no scale-token equivalent).
- 851338a: Checkbox, Switch, and RadioItem now share a consistent, disabled-safe hover state: the border lights to accent when unchecked, and deepens to honey-600 when checked (or indeterminate for Checkbox); all hover rules are `:enabled`-gated so disabled controls show no hover feedback.
- 8723fcc: Separator now paints with the `divider` token instead of the hairline, so it reads clearly as a divider in both themes. Its vertical orientation also gains an intrinsic minimum height (`min-h-[1em]`), so a vertical separator stays visible outside a flex/grid parent instead of collapsing to zero height; the stretch-to-fill behavior inside a flex/grid parent is unchanged.
- b5d3ef5: Spinner now radiates accent-colored rings (ripple) that read clearly against both Daylight and Evening backgrounds; under `prefers-reduced-motion` the rings are hidden for a calm static dot.
- cea3bfb: Switch thumb now sits with equal clearance from the near track edge in both the off and on states.
- de72cc6: Sortable table header cells now render uppercase, matching the non-sortable ones. The casing lives on the `<th>` and was meant to inherit into the sortable header's inner `<button>`, but a UA-stylesheet quirk could suppress `text-transform` inheritance on the button — so `uppercase` is now set on the button explicitly.
- 9dd50b9: Auto-dismissing toasts now show a hover-pausing countdown progress bar; the bar is absent for sticky toasts and hidden under prefers-reduced-motion.
- 8a4c78d: A `toast()` raised with a non-finite or out-of-range `duration` (e.g. `Infinity`, or a value past the ~24.8-day `setTimeout` ceiling) now stays persistent instead of self-dismissing almost immediately — `setTimeout` would otherwise coerce such a delay to ~1ms. `duration: 0` remains the canonical way to make a sticky toast.

## 2.0.1

### Patch Changes

- Deep-import phosphor-svelte icons so they tree-shake. Every icon was imported from the `phosphor-svelte` barrel, which ships no `sideEffects: false` — so a single component (e.g. `Badge`, `Button`, `Toast`) pulled the library's entire ~3,000-icon set (~8 MB) into the consumer's bundle, regardless of `@qovira/ui`'s own `sideEffects: false`. Icons are now imported from `phosphor-svelte/lib/<Icon>` throughout, the curated `@qovira/ui` icon re-exports use the same deep paths, and an ESLint rule prevents regressions. No public API change — the same icon names export from `@qovira/ui`.

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
