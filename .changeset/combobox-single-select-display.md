---
"@qovira/ui": patch
---

Fix the single-select `Combobox` input text: a preset `value` now renders its option's label on mount (it previously showed an empty field), and typing a filter then dismissing the listbox without selecting now reverts the input to the committed selection's label instead of leaving the abandoned search text behind. The wrapper now renders the input itself (via Bits' `child` snippet) so its displayed value tracks the committed selection. No API change.
