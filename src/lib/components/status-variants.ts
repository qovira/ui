// Shared status vocabulary for the feedback set (Alert, Badge, Chip) plus the
// Spinner's sizes. Exported as plain types (not from a `.svelte` module) so
// `tsc`/`svelte-check` can see them and consumers can import them.

/** Semantic status tones — each pairs a tint, an AA-verified text color, and a
 * glyph, so meaning never rides on color alone. Shared by Alert, Badge, Chip. */
export type StatusVariant = "info" | "success" | "warning" | "error";

/** Badge/Chip add a quiet, non-status `neutral` label to the status tones. */
export type BadgeVariant = "neutral" | StatusVariant;

/** Spinner glow sizes. */
export type SpinnerSize = "sm" | "md" | "lg";
