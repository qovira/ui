<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Width cap: page `content` (~960px) or readable `prose` (~70ch). */
    width?: "content" | "prose";
    class?: string;
    children: Snippet;
  }

  let { width = "content", class: klass, children, ...rest }: Props = $props();

  // Brand layout rule: content caps at 60rem (~960px), prose at ~70ch (see Brand & Design). Content uses the rem scale
  // (max-w-240); prose stays arbitrary — ch has no scale token, as the theme README notes for `max-w-[70ch]`. Centered,
  // with a 24px gutter (px-6).
  const MAX = { content: "max-w-240", prose: "max-w-[70ch]" } as const;
</script>

<div class={cn("mx-auto w-full px-6", MAX[width], klass)} {...rest}>
  {@render children()}
</div>
