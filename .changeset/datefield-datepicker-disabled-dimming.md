---
"@qovira/ui": patch
---

Disabled DateField and DatePicker controls now visibly dim (opacity-50) like the other form controls. The shared field recipe's `disabled:opacity-50` was dead on these two — their input is a `<div role="group">`, which the CSS `:disabled` pseudo-class never matches — so a `data-[disabled]:opacity-50` selector (the attribute bits-ui sets when disabled) was added alongside it.
