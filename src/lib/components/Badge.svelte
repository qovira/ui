<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
  import { BADGE_TONE, STATUS_ICON } from "../internal/status.js";
  import type { BadgeVariant } from "./status-variants.js";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Quiet neutral label, or a semantic status (tint + glyph). */
    variant?: BadgeVariant;
    class?: string;
    children: Snippet;
  }

  let { variant = "neutral", class: klass, children, ...rest }: Props = $props();
</script>

<!-- Neutral is a quiet hairline label; status variants use the theme's
     AA-verified tint/text pairing (BADGE_TONE) AND a glyph, so meaning is never
     color alone. -->
<span
  class={cn(
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-small font-sans",
    BADGE_TONE[variant],
    klass,
  )}
  {...rest}
>
  {#if variant !== "neutral"}
    <Icon icon={STATUS_ICON[variant]} decorative />
  {/if}
  {@render children()}
</span>
