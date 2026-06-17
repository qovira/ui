<script lang="ts">
  import { RadioGroup } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props {
    /** The item's value within the group. */
    value: string;
    disabled?: boolean;
    class?: string;
    /** The visible label for this option. */
    children: Snippet;
  }

  let { value, disabled = false, class: klass, children }: Props = $props();
</script>

<!-- The label wraps the radio so its text is the accessible name and is part of
     the click target. The inner dot shows via the radio's checked data-state. -->
<label class="flex items-center gap-2 text-body font-sans text-fg">
  <RadioGroup.Item
    {value}
    {disabled}
    class={cn(
      "group inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised transition-colors",
      "data-[state=checked]:border-accent disabled:opacity-50",
      klass,
      "focus-ring",
    )}
  >
    <span class="h-2.5 w-2.5 rounded-full bg-accent opacity-0 transition-opacity group-data-[state=checked]:opacity-100"
    ></span>
  </RadioGroup.Item>
  {@render children()}
</label>
