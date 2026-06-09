/**
 * The five Button variants, mapped 1:1 to `@qovira/theme`'s canonical button
 * recipes (theme README → Button). Shared by `Button` and `IconButton` so both
 * stay on the exact brand recipe — change a fill here and both follow.
 *
 * Each string carries only fill / text / hover / active (the variant's identity).
 * The shared shape (radius, type role, transition), the focus ring, and the
 * disabled treatment live in the components' own base classes.
 */
export type ButtonVariant = "primary" | "key" | "secondary" | "ghost" | "destructive";

/** `IconButton` hit-target size: `md` = 40px floor (desktop), `touch` = 44px. */
export type IconButtonSize = "md" | "touch";

export const VARIANTS: Record<ButtonVariant, string> = {
  // Espresso (Daylight) ↔ honey (Evening), automatic via the `--btn-primary` token.
  primary: "bg-btn-primary text-btn-primary-fg hover:bg-btn-primary-hover active:bg-btn-primary-active active:scale-[.99]",
  // Key CTA — raw honey in both themes; at most one per view (the ≤10% accent rule).
  key: "bg-accent text-warm-900 hover:bg-honey-600 active:bg-honey-700",
  // Secondary — hairline-bordered, transparent fill.
  secondary: "bg-transparent text-text border border-border hover:bg-surface-raised active:bg-warm-200/40",
  // Ghost — text-only, tinted wash on interaction.
  ghost: "bg-transparent text-link hover:bg-link/8 active:bg-link/12",
  // Destructive — for irreversible actions; pair with a confirm.
  destructive: "bg-error text-white hover:brightness-95 active:brightness-90",
};
