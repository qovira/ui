<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { GAP, type SpacingStep } from "../internal/spacing.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Gap between items, on the theme spacing scale. */
    gap?: SpacingStep;
    align?: "start" | "center" | "end" | "baseline" | "stretch";
    justify?: "start" | "center" | "end" | "between";
    /** Wrap onto multiple lines when the row overflows (default true). */
    wrap?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    gap = 2,
    align = "center",
    justify = "start",
    wrap = true,
    class: klass,
    children,
    ...rest
  }: Props = $props();

  const ALIGN = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
    stretch: "items-stretch",
  } as const;
  const JUSTIFY = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  } as const;
</script>

<div
  class={cn("flex", wrap && "flex-wrap", GAP[gap], ALIGN[align], JUSTIFY[justify], klass)}
  {...rest}
>
  {@render children()}
</div>
