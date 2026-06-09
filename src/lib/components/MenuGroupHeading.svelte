<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: klass }: Props = $props();
</script>

<!-- Names the enclosing `Menu.Group` (Bits wires aria-labelledby). Not itself a
     menuitem, so it's skipped in keyboard navigation. -->
<DropdownMenu.GroupHeading
  class={cn("px-3 py-1.5 text-label font-sans uppercase text-text-muted", klass)}
>
  {@render children()}
</DropdownMenu.GroupHeading>
