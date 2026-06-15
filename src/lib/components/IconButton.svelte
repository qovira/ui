<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import SpinnerIcon from "phosphor-svelte/lib/SpinnerIcon";
  import { cn } from "../internal/cn.js";
  import Icon from "../icons/Icon.svelte";
  import type { IconComponent } from "../icons/types.js";
  import { VARIANTS, type ButtonVariant, type IconButtonSize } from "./button-variants.js";

  interface Props extends HTMLButtonAttributes {
    /** The Phosphor icon to render. */
    icon: IconComponent;
    /**
     * Accessible name for the action — REQUIRED. An icon-only control has no
     * visible text, so the label is its only accessible name. It sits on the
     * `<button>`; the icon itself is `aria-hidden`.
     */
    label: string;
    variant?: ButtonVariant;
    size?: IconButtonSize;
    /** Shows a spinner, sets `aria-busy`, and blocks interaction. */
    loading?: boolean;
    disabled?: boolean;
    class?: string;
  }

  let {
    icon,
    label,
    variant = "secondary",
    size = "md",
    loading = false,
    disabled = false,
    class: klass,
    ...rest
  }: Props = $props();

  // Square hit target: `md` meets the 40px desktop floor, `touch` the 44px
  // touch floor (both named in the design's a11y guardrails). `focus-ring` is
  // appended LAST so `class` can never strip it.
  const BASE =
    "inline-flex items-center justify-center rounded-md select-none " +
    "transition-[background,box-shadow,transform] duration-micro ease-qovira " +
    "disabled:opacity-50 disabled:pointer-events-none";
  const SIZE = { md: "h-10 w-10", touch: "h-11 w-11" } as const;
  const ICON_PX = { md: 20, touch: 24 } as const;

  const inactive = $derived(disabled || loading);
  const classes = $derived(cn(BASE, SIZE[size], VARIANTS[variant], klass, "focus-ring"));
</script>

<!-- `type="button"` precedes ...rest so an icon button defaults to non-submitting
     (a bare <button> defaults to type="submit"), still overridable via ...rest. -->
<button
  class={classes}
  type="button"
  {...rest}
  disabled={inactive}
  aria-label={label}
  {...loading ? { "aria-busy": "true" } : {}}
>
  <Icon icon={loading ? SpinnerIcon : icon} size={ICON_PX[size]} decorative class={loading ? "animate-spin" : ""} />
</button>
