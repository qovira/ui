// The status vocabulary's three carriers, defined once so Alert, Badge, and Chip
// stay in lockstep. A status is shown with ALL of them — never color alone:
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
  info: "bg-info-tint",
  success: "bg-success-tint",
  warning: "bg-warning-tint",
  error: "bg-error-tint",
};

export const STATUS_TEXT: Record<StatusVariant, string> = {
  info: "text-info-text",
  success: "text-success-text",
  warning: "text-warning-text",
  error: "text-error-text",
};

// The shape/typography recipe shared by Badge and Chip (the pill geometry,
// gap, and small label type). Defined once, alongside BADGE_TONE, so the two
// compact-label components never drift.
export const BADGE_BASE = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-small font-sans";

// The composed compact-label recipe shared by Badge and Chip: a quiet neutral
// hairline, or a status's tint paired with its AA-verified text color (the
// components add the glyph). Defined once so the two never drift.
export const BADGE_TONE: Record<BadgeVariant, string> = {
  neutral: "border border-border bg-surface-raised text-text",
  info: `${STATUS_TINT.info} ${STATUS_TEXT.info}`,
  success: `${STATUS_TINT.success} ${STATUS_TEXT.success}`,
  warning: `${STATUS_TINT.warning} ${STATUS_TEXT.warning}`,
  error: `${STATUS_TINT.error} ${STATUS_TEXT.error}`,
};
