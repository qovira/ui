<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  // Wraps Bits' Dialog.Description — wires the dialog's aria-describedby via the
  // Dialog context. Body copy always uses `text-text` (never muted). Render
  // inside a <Modal>.
  interface Props extends Dialog.DescriptionProps {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<Dialog.Description class={cn("mt-2 text-body font-sans text-text", klass)} {...rest}>
  {@render children()}
</Dialog.Description>
