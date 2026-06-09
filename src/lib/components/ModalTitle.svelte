<script lang="ts">
  import { Dialog } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  // Wraps Bits' Dialog.Title — it sets the dialog's accessible name
  // (aria-labelledby) via the Dialog context, so it must be rendered inside a
  // <Modal>. Display type per the brand (h1–h3 are font-display).
  interface Props extends Dialog.TitleProps {
    class?: string;
    children: Snippet;
  }

  let { class: klass, children, ...rest }: Props = $props();
</script>

<Dialog.Title class={cn("text-h3 font-display text-text", klass)} {...rest}>
  {@render children()}
</Dialog.Title>
