// Curated Phosphor icon re-exports. `@qovira/ui` standardizes on one weight (Regular, enforced by <Icon>) and
// re-exports the working set the library and its consumers draw from — so call sites import icons from `@qovira/ui`,
// not directly from phosphor-svelte. Grow this set as components need more glyphs.
//
// The `*Icon`-suffixed names are Phosphor's non-deprecated exports.

export { default as Icon } from "./Icon.svelte";
export type { IconProps, IconComponent } from "./types.js";

// Deep-imported (`phosphor-svelte/lib/<Icon>`), never the barrel: phosphor ships no `sideEffects: false`, so a barrel
// re-export would defeat tree-shaking and pull all ~3,000 icons into the consumer's bundle. See
// conventions:writing-svelte.

// Status — always paired with a semantic color (the "never color alone" rule); used by Alert, Toast, status Badge/Chip.
export { default as CheckCircleIcon } from "phosphor-svelte/lib/CheckCircleIcon";
export { default as WarningIcon } from "phosphor-svelte/lib/WarningIcon";
export { default as WarningCircleIcon } from "phosphor-svelte/lib/WarningCircleIcon";
export { default as XCircleIcon } from "phosphor-svelte/lib/XCircleIcon";
export { default as InfoIcon } from "phosphor-svelte/lib/InfoIcon";
// Common actions / affordances.
export { default as CheckIcon } from "phosphor-svelte/lib/CheckIcon";
export { default as XIcon } from "phosphor-svelte/lib/XIcon";
export { default as PlusIcon } from "phosphor-svelte/lib/PlusIcon";
export { default as TrashIcon } from "phosphor-svelte/lib/TrashIcon";
export { default as MagnifyingGlassIcon } from "phosphor-svelte/lib/MagnifyingGlassIcon";
export { default as SpinnerIcon } from "phosphor-svelte/lib/SpinnerIcon";
// Identity — the Avatar's icon fallback when there are no initials.
export { default as UserIcon } from "phosphor-svelte/lib/UserIcon";
// Directional carets — menus, selects, accordions, pagination.
export { default as CaretDownIcon } from "phosphor-svelte/lib/CaretDownIcon";
export { default as CaretUpIcon } from "phosphor-svelte/lib/CaretUpIcon";
export { default as CaretLeftIcon } from "phosphor-svelte/lib/CaretLeftIcon";
export { default as CaretRightIcon } from "phosphor-svelte/lib/CaretRightIcon";
