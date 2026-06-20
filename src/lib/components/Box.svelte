<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  /**
   * The generic surface primitive: a raised, padded, rounded panel drawn from `@qovira/theme` semantic utilities. Use
   * it as the base for cards, callouts, and grouped content. Pass a `class` to retune padding/elevation — it merges via
   * `cn()`, so your class wins conflicts — and any native `<div>` attribute passes through. For directional flow inside
   * it, compose `Stack`/`Cluster`.
   */
  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string;
    children?: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<div class={cn("bg-surface-raised text-fg border-border rounded-md border p-4", klass)} {...rest}>
  {@render children?.()}
</div>
