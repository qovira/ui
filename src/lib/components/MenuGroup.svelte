<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    class?: string;
  }

  let { children, class: klass }: Props = $props();
</script>

<!-- A labelled group of items (role=group). Pair with `Menu.GroupHeading`, which names it via aria-labelledby. -->
<DropdownMenu.Group class={klass}>
  {@render children()}
</DropdownMenu.Group>
