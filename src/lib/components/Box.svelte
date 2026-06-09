<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";

  /**
   * Smoke component for the build/pack pipeline (QOV-9): a styled surface that
   * exercises the whole shape — `@qovira/theme` semantic utilities, the `cn()`
   * class merge, `$props` + native-attribute passthrough, and a `children`
   * snippet. It proves a component authored here renders styled in a consumer.
   * Real primitives supersede it as the library fills out.
   */
  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string;
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div class={cn("bg-surface-raised text-text border-border rounded-md border p-4", klass)} {...rest}>
  {@render children?.()}
</div>
