<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";
  import Spinner from "./Spinner.svelte";
  import { VARIANTS, type ButtonVariant } from "./button-variants.js";

  interface Props {
    /** Visual variant. Defaults to `secondary` per the API conventions. */
    variant?: ButtonVariant;
    /** Given an `href`, the button morphs into an `<a>` with identical styling. */
    href?: string;
    /** Shows a spinner, sets `aria-busy`, and blocks interaction. */
    loading?: boolean;
    disabled?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    variant = "secondary",
    href,
    loading = false,
    disabled = false,
    class: klass,
    children,
    ...rest
  }: Props & (HTMLButtonAttributes | HTMLAnchorAttributes) = $props();

  // Shared shape from the theme's Button recipe; `text-button` carries no font-family, so the wrapper pairs Figtree
  // (font-sans) like the type primitives do. `focus-ring` is appended LAST in cn() below (not here) so the consumer's
  // `class` can never merge it away — the most-enforced a11y rule. The transparent border equalizes box geometry across
  // variants: only `secondary` carries a visible border, and since the button's width is content-driven, that 1px each
  // side would otherwise make it ~2px wider — a layout jump when toggling to/from secondary. The secondary variant just
  // recolors this border to `border-divider` (tailwind-merge keeps the later color).
  const BASE =
    "inline-flex items-center justify-center gap-2 rounded-md border border-transparent font-sans text-button h-10 px-4 " +
    "select-none transition-[background,box-shadow,transform] duration-micro ease-qovira " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const inactive = $derived(disabled || loading);
  const classes = $derived(cn(BASE, VARIANTS[variant], klass, "focus-ring"));
</script>

{#snippet body()}
  {#if loading}
    <!-- The signature Spinner, in `current` tone so it inherits the button's text color (visible on every fill), and
         decorative since the button already carries aria-busy + the visible label. -->
    <Spinner size="sm" tone="current" decorative />
  {/if}
  {@render children()}
{/snippet}

{#if href}
  <!-- Anchors can't be natively `disabled`, so an inactive link drops its href, leaves the tab order, and mirrors the
       disabled visual treatment. -->
  <!-- eslint-disable svelte/no-navigation-without-resolve -- a generic library control forwards the consumer's arbitrary href verbatim; resolve() is for an app's own route links, not here. -->
  <a
    href={inactive ? undefined : href}
    class={cn(classes, inactive && "opacity-50 pointer-events-none")}
    {...rest as HTMLAnchorAttributes}
    aria-disabled={inactive ? "true" : undefined}
    {...inactive ? { tabindex: -1 } : {}}
    {...loading ? { "aria-busy": "true" } : {}}
  >
    {@render body()}
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <!-- `type="button"` precedes ...rest so it defaults to a non-submitting button (a bare <button> defaults to
       type="submit"), yet a consumer can still pass type="submit" through ...rest. -->
  <button
    class={classes}
    type="button"
    {...rest as HTMLButtonAttributes}
    disabled={inactive}
    {...loading ? { "aria-busy": "true" } : {}}
  >
    {@render body()}
  </button>
{/if}
