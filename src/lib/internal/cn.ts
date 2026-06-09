import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class lists so a consumer's `class` prop wins Tailwind conflicts cleanly.
 *
 * `clsx` resolves conditionals/arrays/objects into a string; `tailwind-merge`
 * then dedupes conflicting Tailwind utilities (the last wins), so passing
 * `class="p-2"` to a component whose base is `p-4` yields `p-2` — no specificity
 * wars, no `!important`.
 *
 * Internal only: not part of the public export surface.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
