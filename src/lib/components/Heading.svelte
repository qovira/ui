<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  type Size = "display" | "h1" | "h2" | "h3" | "h4";

  interface Props extends HTMLAttributes<HTMLHeadingElement> {
    /** Semantic heading level — renders `<h1>`–`<h4>`. */
    level?: 1 | 2 | 3 | 4;
    /** Visual type role; defaults to match `level`. Decouples size from level. */
    size?: Size;
    class?: string;
    children: Snippet;
  }

  let { level = 2, size, class: klass, children, ...rest }: Props = $props();

  const resolved = $derived(size ?? (`h${level}` as Size));
  const ROLE = {
    display: "text-display",
    h1: "text-h1",
    h2: "text-h2",
    h3: "text-h3",
    h4: "text-h4",
  } as const;
  // Display/H1–H3 are Fraunces (font-display); H4 is Figtree (font-sans) — the
  // font isn't carried by the text-* role, so the wrapper applies it so call
  // sites can't forget it (see Brand & Design typography).
  const font = $derived(resolved === "h4" ? "font-sans" : "font-display");
</script>

<svelte:element this={`h${level}`} class={cn(font, ROLE[resolved], "text-fg", klass)} {...rest}>
  {@render children()}
</svelte:element>
