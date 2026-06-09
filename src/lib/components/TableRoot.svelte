<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLTableAttributes {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<!-- A calm table: comfortable density, hairline row rules, no zebra/grid noise.
     Wrapped in a horizontal-scroll container so a wide table stays usable on
     narrow viewports without forcing the page to scroll. -->
<div class="w-full overflow-x-auto">
  <table
    class={cn("w-full border-collapse text-left font-sans text-body text-text", klass)}
    {...rest}
  >
    {@render children()}
  </table>
</div>
