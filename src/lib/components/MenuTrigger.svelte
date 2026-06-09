<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    class?: string;
    children?: Snippet;
    /** Delegate rendering to your own element (a Button, a link): receives
     *  `props` to spread on so Bits' behavior/ARIA stay wired. */
    child?: DropdownMenu.TriggerProps["child"];
  }

  let { class: klass, children, child }: Props = $props();
</script>

<!-- Default renders Bits' own <button>; pass `child` to delegate to a Button or
     other element. `focus-ring` is appended last so a consumer class can't strip
     it (delegated triggers bring their own focus styling). -->
{#if child}
  <DropdownMenu.Trigger {child} />
{:else}
  <DropdownMenu.Trigger class={cn(klass, "focus-ring")}>
    {@render children?.()}
  </DropdownMenu.Trigger>
{/if}
