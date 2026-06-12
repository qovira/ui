import type { Component } from "svelte";
import type { IconComponentProps } from "phosphor-svelte";

/** A Phosphor icon component — use the curated re-exports from `@qovira/ui`. */
export type IconComponent = Component<IconComponentProps>;

// Native svg attributes Icon forwards onto its root, minus the ones it owns:
// weight/color are brand-locked, size is constrained to 20/24, class is merged
// via cn(), and every attribute that contributes an accessible name (or hides
// the element, or changes its role) is excluded — those are driven solely by
// the label/decorative decision below, so a caller can't quietly bypass it.
type ForwardedAttrs = Omit<
  IconComponentProps,
  | "weight"
  | "color"
  | "size"
  | "class"
  | "role"
  | "title"
  | "aria-label"
  | "aria-labelledby"
  | "aria-describedby"
  | "aria-hidden"
>;

/**
 * `<Icon>` forces an explicit accessible-name decision: an icon either carries
 * a `label` (meaningful — announced to assistive tech) or is `decorative`
 * (hidden from it). Exactly one is required — never neither, never both.
 */
export type IconProps = {
  /** The Phosphor icon to render (e.g. `CheckIcon`). */
  icon: IconComponent;
  /** Rendered size in px. Locked to the brand's 20 / 24. */
  size?: 20 | 24;
  /** Extra classes merged onto the `<svg>` root. */
  class?: string;
} & ({ label: string; decorative?: never } | { decorative: true; label?: never }) &
  ForwardedAttrs;
