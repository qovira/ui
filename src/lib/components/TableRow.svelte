<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLAttributes<HTMLTableRowElement> {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<!-- A hairline rule under every row — the only separation a calm table needs. -->
<tr class={cn("border-b border-border", klass)} {...rest}>
  {@render children()}
</tr>
