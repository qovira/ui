<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";
  import { GAP, type SpacingStep } from "../internal/spacing.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Vertical gap between children, on the theme spacing scale. */
    gap?: SpacingStep;
    align?: "start" | "center" | "end" | "stretch";
    class?: string;
    children: Snippet;
  }

  let { gap = 4, align = "stretch", class: klass, children, ...rest }: Props = $props();

  const ALIGN = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  } as const;
</script>

<div class={cn("flex flex-col", GAP[gap], ALIGN[align], klass)} {...rest}>
  {@render children()}
</div>
