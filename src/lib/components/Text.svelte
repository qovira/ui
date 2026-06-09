<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  type Variant = "body" | "lead" | "small" | "label" | "code";

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Typographic role from the theme's `text-*` scale. */
    variant?: Variant;
    /** Color role: primary text (default) or muted (timestamps/counts/hints only). */
    tone?: "default" | "muted";
    /** Element to render. */
    as?: "p" | "span" | "div";
    class?: string;
    children: Snippet;
  }

  let { variant = "body", tone = "default", as = "p", class: klass, children, ...rest }: Props = $props();

  const ROLE = {
    body: "text-body",
    lead: "text-lead",
    small: "text-small",
    label: "text-label uppercase", // Label is uppercase per Brand & Design.
    code: "text-code",
  } as const;
  const font = $derived(variant === "code" ? "font-mono" : "font-sans");
  // Brand rule: body copy always uses `text-text`; muted is for secondary text only.
  const color = $derived(tone === "muted" ? "text-text-muted" : "text-text");
</script>

<svelte:element this={as} class={cn(font, ROLE[variant], color, klass)} {...rest}>
  {@render children()}
</svelte:element>
