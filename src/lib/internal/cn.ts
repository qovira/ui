import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// @qovira/theme adds custom `text-<role>` typographic utilities (text-display,
// text-h1…text-h4, text-lead, text-body, text-small, text-button, text-label,
// text-code). Out of the box tailwind-merge has no idea these are font-size
// utilities, so it lumps them into the text-COLOR group and drops one when a
// recipe legitimately combines a role with a color (e.g. `text-body text-fg`,
// straight from the theme's Input recipe). Registering them under `font-size`
// keeps role and color in separate conflict groups — both survive, while two
// roles (or two colors) still correctly collapse to the last.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display", "h1", "h2", "h3", "h4", "lead", "body", "small", "button", "label", "code"],
        },
      ],
    },
  },
});

/**
 * Merge class lists so a consumer's `class` prop wins Tailwind conflicts cleanly.
 *
 * `clsx` resolves conditionals/arrays/objects into a string; `tailwind-merge`
 * then dedupes conflicting Tailwind utilities (the last wins), so passing
 * `class="p-2"` to a component whose base is `p-4` yields `p-2` — no specificity
 * wars, no `!important`. It's extended above to understand the theme's custom
 * typographic `text-*` roles.
 *
 * Internal only: not part of the public export surface.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
