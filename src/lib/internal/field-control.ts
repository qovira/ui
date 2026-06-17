/**
 * Shared text-entry recipe from `@qovira/theme`'s Input recipe — warm raised
 * fill, hairline border, muted placeholder, red border only as reinforcement
 * when `aria-invalid`. Sizing differs per control (Input is `h-10`, Textarea is
 * `min-h-20 py-2`), and `focus-ring` is appended last by each so a consumer
 * `class` can't strip it. `text-body` carries no font-family, hence `font-sans`.
 */
export const FIELD_CONTROL_BASE =
  "w-full rounded-md px-3 text-body font-sans bg-surface-raised text-fg " +
  "border border-border placeholder:text-fg-muted " +
  "aria-[invalid=true]:border-error disabled:opacity-50";
