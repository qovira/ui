<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
  import { STATUS_ICON, STATUS_TEXT, STATUS_TINT } from "../internal/status.js";
  import type { StatusVariant } from "./status-variants.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Semantic tone — sets the tint, the status glyph, and the icon color. */
    variant?: StatusVariant;
    /** Optional bold lead line above the message. */
    title?: string;
    class?: string;
    children: Snippet;
  }

  let { variant = "info", title, class: klass, children, ...rest }: Props = $props();
</script>

<!-- Inline status banner: a semantic tint, the matching glyph, and the message.
     Meaning never rides on color alone — the icon (and any title/body text)
     carries it too. Defaults to a polite role="status"; pass role="alert" via
     ...rest for the rare urgent case (it wins, being spread after). Body copy is
     text-fg (the brand's body color, never text-muted); the icon uses the
     theme's AA-verified semantic text color on its tint. -->
<div role="status" class={cn("flex gap-3 rounded-md border border-border p-4", STATUS_TINT[variant], klass)} {...rest}>
  <Icon icon={STATUS_ICON[variant]} decorative class={cn("mt-0.5", STATUS_TEXT[variant])} />
  <div class="min-w-0 flex-1 font-sans">
    {#if title}
      <p class="text-body font-medium text-fg">{title}</p>
    {/if}
    <div class={cn("text-body text-fg", title && "mt-1")}>
      {@render children()}
    </div>
  </div>
</div>
