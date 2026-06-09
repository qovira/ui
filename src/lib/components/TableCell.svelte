<script lang="ts">
  import type { HTMLTdAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLTdAttributes {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<!-- Body copy uses text-text (the brand's body color), comfortable px-4 py-3. -->
<td class={cn("px-4 py-3 align-middle text-body text-text", klass)} {...rest}>
  {@render children()}
</td>
