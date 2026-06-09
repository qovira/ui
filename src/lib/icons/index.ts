// Curated Phosphor icon re-exports. `@qovira/ui` standardizes on one weight
// (Regular, enforced by <Icon>) and re-exports the working set the library and
// its consumers draw from — so call sites import icons from `@qovira/ui`, not
// directly from phosphor-svelte. Grow this set as components need more glyphs.
//
// The `*Icon`-suffixed names are Phosphor's non-deprecated exports.

export { default as Icon } from "./Icon.svelte";
export type { IconProps, IconComponent } from "./types.js";

export {
  // Status — always paired with a semantic color (the "never color alone" rule);
  // used by Alert, Toast, status Badge/Chip.
  CheckCircleIcon,
  WarningIcon,
  WarningCircleIcon,
  XCircleIcon,
  InfoIcon,
  // Common actions / affordances.
  CheckIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  SpinnerIcon,
  // Identity — the Avatar's icon fallback when there are no initials.
  UserIcon,
  // Directional carets — menus, selects, accordions, pagination.
  CaretDownIcon,
  CaretUpIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "phosphor-svelte";
