<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { SpinnerIcon } from "phosphor-svelte";
  import { cn } from "../internal/cn.js";
  import Icon from "../icons/Icon.svelte";
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

  let { variant = "secondary", href, loading = false, disabled = false, class: klass, children, ...rest }: Props & (HTMLButtonAttributes | HTMLAnchorAttributes) = $props();

  // Shared shape from the theme's Button recipe; `text-button` carries no
  // font-family, so the wrapper pairs Figtree (font-sans) like the type
  // primitives do. `focus-ring` is appended LAST in cn() below (not here) so the
  // consumer's `class` can never merge it away — the most-enforced a11y rule.
  const BASE =
    "inline-flex items-center justify-center gap-2 rounded-md font-sans text-button h-10 px-4 " +
    "select-none transition-[background,box-shadow,transform] duration-micro ease-qovira " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const inactive = $derived(disabled || loading);
  const classes = $derived(cn(BASE, VARIANTS[variant], klass, "focus-ring"));
</script>

{#snippet body()}
  {#if loading}
    <Icon icon={SpinnerIcon} decorative class="animate-spin" />
  {/if}
  {@render children()}
{/snippet}

{#if href}
  <!-- Anchors can't be natively `disabled`, so an inactive link drops its href,
       leaves the tab order, and mirrors the disabled visual treatment. -->
  <!-- eslint-disable svelte/no-navigation-without-resolve -- a generic library control forwards the consumer's arbitrary href verbatim; resolve() is for an app's own route links, not here. -->
  <a
    href={inactive ? undefined : href}
    class={cn(classes, inactive && "opacity-50 pointer-events-none")}
    {...rest as HTMLAnchorAttributes}
    aria-disabled={inactive ? "true" : undefined}
    tabindex={inactive ? -1 : undefined}
    aria-busy={loading ? "true" : undefined}
  >
    {@render body()}
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <button class={classes} {...rest as HTMLButtonAttributes} disabled={inactive} aria-busy={loading ? "true" : undefined}>
    {@render body()}
  </button>
{/if}
