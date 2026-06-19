/**
 * The five Button variants, mapped 1:1 to `@qovira/theme`'s canonical button recipes (theme README → Button). Shared by
 * `Button` and `IconButton` so both stay on the exact brand recipe — change a fill here and both follow.
 *
 * Each string carries only fill / text / hover / active (the variant's identity). The shared shape (radius, type role,
 * transition), the focus ring, and the disabled treatment live in the components' own base classes.
 */
export type ButtonVariant = "primary" | "key" | "secondary" | "ghost" | "destructive";

/** `IconButton` hit-target size: `md` = 40px floor (desktop), `touch` = 44px. */
export type IconButtonSize = "md" | "touch";

export const VARIANTS: Record<ButtonVariant, string> = {
  // Espresso (Daylight) ↔ honey (Evening), automatic via the `--btn-primary` token.
  primary:
    "bg-btn-primary text-btn-primary-fg hover:bg-btn-primary-hover active:bg-btn-primary-active active:scale-[.99]",
  // Key CTA — raw honey in both themes; at most one per view (the ≤10% accent rule).
  key: "bg-accent text-warm-900 hover:bg-honey-600 active:bg-honey-700",
  // Secondary — divider-bordered, transparent fill. The border is the button's whole resting presence, so it uses the
  // stronger `--divider` edge (not the faint hairline) to read clearly on the cream/espresso surfaces in both themes.
  secondary: "bg-transparent text-fg border border-divider hover:bg-surface-raised active:bg-warm-200/40",
  // Ghost — text-only, tinted wash on interaction.
  ghost: "bg-transparent text-link hover:bg-link/8 active:bg-link/12",
  // Destructive — for irreversible actions; pair with a confirm.
  // `brightness()` is a CSS filter that dims the entire element including white text, so it cannot darken the fill
  // perceptibly while keeping white-on-fill contrast above WCAG AA. Instead we darken the background fill alone via
  // `color-mix(in srgb, …, black N%)`, which is pure channel scaling (× (1−N)), leaving `text-white` at #fff. Computed
  // WCAG AA ratios (white text):
  //   rest   white / #cc4029           ≈ 4.85:1  (pass — same as before)
  //   hover  white / #cc4029 × 0.90   ≈ 5.72:1  (pass, clearly darker than rest)
  //   active white / #cc4029 × 0.82   ≈ 6.65:1  (pass, clearly darker than hover)
  // IconButton shares this VARIANTS map, so both components benefit from the same change.
  destructive:
    "bg-error text-white hover:bg-[color-mix(in_srgb,var(--color-error),black_10%)] active:bg-[color-mix(in_srgb,var(--color-error),black_18%)]",
};
