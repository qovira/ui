// The status vocabulary's three carriers, defined once so Alert, Badge, and Chip stay in lockstep. A status is shown
// with ALL of them — never color alone:
//   STATUS_TINT — the surface background (a theme status tint),
//   STATUS_TEXT — the foreground/icon color (the theme's AA-verified pairing
//                 against that tint),
//   STATUS_ICON — the glyph that carries the meaning without relying on color.
// Internal — not part of the public surface.

import CheckCircleIcon from "phosphor-svelte/lib/CheckCircleIcon";
import InfoIcon from "phosphor-svelte/lib/InfoIcon";
import WarningIcon from "phosphor-svelte/lib/WarningIcon";
import XCircleIcon from "phosphor-svelte/lib/XCircleIcon";
import type { IconComponent } from "../icons/types.js";
import type { BadgeVariant, StatusVariant } from "../components/status-variants.js";

export const STATUS_ICON: Record<StatusVariant, IconComponent> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: XCircleIcon,
};

export const STATUS_TINT: Record<StatusVariant, string> = {
  info: "bg-tint-info",
  success: "bg-tint-success",
  warning: "bg-tint-warning",
  error: "bg-tint-error",
};

export const STATUS_TEXT: Record<StatusVariant, string> = {
  info: "text-fg-info",
  success: "text-fg-success",
  warning: "text-fg-warning",
  error: "text-fg-error",
};

// The shape/typography recipe shared by Badge and Chip (the pill geometry, gap, and small label type). Defined once,
// alongside BADGE_TONE, so the two compact-label components never drift.
export const BADGE_BASE = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-small font-sans";

// The recipe shared by Badge and Chip. Every tone carries a border so the pills read as discrete chips. Neutral has no
// status tint to carry its contrast, so it uses the stronger `border-divider` edge to stay legible against the Evening
// surfaces (where surface-raised barely clears the background); the status tones keep the hairline `border-border` and
// lean on their AA-verified tint/text pairing. The components add the glyph, so meaning is never carried by color
// alone. Defined once so the two never drift.
export const BADGE_TONE: Record<BadgeVariant, string> = {
  neutral: "border border-divider bg-surface-raised text-fg",
  info: `border border-border ${STATUS_TINT.info} ${STATUS_TEXT.info}`,
  success: `border border-border ${STATUS_TINT.success} ${STATUS_TEXT.success}`,
  warning: `border border-border ${STATUS_TINT.warning} ${STATUS_TEXT.warning}`,
  error: `border border-border ${STATUS_TINT.error} ${STATUS_TEXT.error}`,
};
