---
"@qovira/ui": patch
---

Separator now paints with the `divider` token instead of the hairline, so it reads clearly as a divider in both themes. Its vertical orientation also gains an intrinsic minimum height (`min-h-[1em]`), so a vertical separator stays visible outside a flex/grid parent instead of collapsing to zero height; the stretch-to-fill behavior inside a flex/grid parent is unchanged.
