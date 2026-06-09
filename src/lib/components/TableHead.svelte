<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLAttributes<HTMLTableSectionElement> {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<thead class={cn(klass)} {...rest}>
  {@render children()}
</thead>
