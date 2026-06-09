<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  // svelte types <caption> with the generic element attribute set.
  interface Props extends HTMLAttributes<HTMLElement> {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<!-- The table's accessible name/summary. Muted, as secondary descriptive text. -->
<caption
  class={cn("caption-bottom px-4 py-2 text-left text-small text-text-muted", klass)}
  {...rest}
>
  {@render children()}
</caption>
