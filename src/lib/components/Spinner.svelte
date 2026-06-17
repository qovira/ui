<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";
  import type { SpinnerSize } from "./status-variants.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Glow diameter. */
    size?: SpinnerSize;
    /** Accessible status text, announced via role="status". */
    label?: string;
    /** Show the label beside the glow instead of only to assistive tech. */
    showLabel?: boolean;
    class?: string;
  }

  let { size = "md", label = "Loading…", showLabel = false, class: klass, ...rest }: Props = $props();

  // The honey dot's diameter; the lamp-glow halo (a fixed-radius box-shadow) and
  // the pulse are the theme's.
  const DOT = { sm: "size-3", md: "size-4", lg: "size-6" } as const;
</script>

<!-- Qovira's signature wait state: a honey dot wearing the theme's lamp-glow
     halo, pulsing on the qovira-pulse keyframe (via lamp-glow-pulse). The
     meaning is never trapped in motion — role="status" announces the text (the
     glow itself is aria-hidden), and the theme's global prefers-reduced-motion
     guard collapses lamp-glow-pulse to a static glow. -->
<div role="status" class={cn("inline-flex items-center gap-2", klass)} {...rest}>
  <span class={cn("rounded-full bg-accent lamp-glow lamp-glow-pulse", DOT[size])} aria-hidden="true"></span>
  <span class={showLabel ? "text-small font-sans text-fg" : "sr-only"}>{label}</span>
</div>
