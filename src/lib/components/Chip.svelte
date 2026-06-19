<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
  import { BADGE_BASE, BADGE_TONE, STATUS_ICON } from "../internal/status.js";
  import type { BadgeVariant } from "./status-variants.js";

  interface Props {
    /** Quiet neutral label, or a semantic status (tint + glyph). */
    variant?: BadgeVariant;
    /** Given an `href`, the chip morphs into a navigable `<a>` with the same look. */
    href?: string;
    class?: string;
    children: Snippet;
  }

  let {
    variant = "neutral",
    href,
    class: klass,
    children,
    ...rest
  }: Props & (HTMLAttributes<HTMLSpanElement> | HTMLAnchorAttributes) = $props();

  // Shares Badge's BADGE_BASE shape + BADGE_TONE recipe (neutral's divider edge, or a status's AA-verified tint/text
  // pairing); status chips also carry a glyph (never color alone).
</script>

{#snippet body()}
  {#if variant !== "neutral"}
    <Icon icon={STATUS_ICON[variant]} decorative />
  {/if}
  {@render children()}
{/snippet}

<!-- A Chip morphs to an <a> when given `href` — same look, now navigable. The anchor gets a subtle adaptive hover (text
     color at low alpha works on every tint and in both themes) and the focus-ring appended LAST so a consumer class
     can't merge it away. The static span carries no focus state. -->
{#if href}
  <!-- eslint-disable svelte/no-navigation-without-resolve -- a generic library control forwards the consumer's arbitrary href verbatim; resolve() is for an app's own route links, not here. -->
  <a
    {href}
    class={cn(BADGE_BASE, BADGE_TONE[variant], "transition-colors duration-micro hover:bg-fg/5", klass, "focus-ring")}
    {...rest as HTMLAnchorAttributes}
  >
    {@render body()}
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <span class={cn(BADGE_BASE, BADGE_TONE[variant], klass)} {...rest as HTMLAttributes<HTMLSpanElement>}>
    {@render body()}
  </span>
{/if}
