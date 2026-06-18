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

<!-- Qovira's signature wait state: a honey dot wearing the theme's lamp-glow halo, with accent-colored radiating rings
     (ripple) that read clearly against both Daylight (cream) and Evening (espresso) backgrounds. The ::before and
     ::after pseudo-elements animate `scale` + `opacity` to produce a staggered two-ring wave. The theme's global
     prefers-reduced-motion guard collapses all animations (including the pseudo-elements); an explicit in-component
     rule additionally hides the rings entirely for a clean static dot rather than a frozen mid-ripple state.
     Meaning is never trapped in motion: role="status" announces the text, and the glow/rings are aria-hidden. -->
<div role="status" class={cn("inline-flex items-center gap-2", klass)} {...rest}>
  <span class={cn("spinner-dot rounded-full bg-accent lamp-glow lamp-glow-pulse", DOT[size])} aria-hidden="true"></span>
  <span class={showLabel ? "text-small font-sans text-fg" : "sr-only"}>{label}</span>
</div>

<style>
  /*
   * Radiating accent-colored rings — drawn as pseudo-elements so no DOM nodes are needed and the parent's aria-hidden
   * is inherited. Two rings at different animation-delay values give a continuous staggered wave effect.
   *
   * Scale: starts at 1 (same size as dot), expands to ~2.5× before fading out.
   * Color: var(--color-accent) = honey, which contrasts against both cream (Daylight) and espresso (Evening).
   * Easing: var(--ease-qovira) — the brand ease (cubic-bezier(0.2, 0.8, 0.2, 1)).
   * Duration: 1400ms — slightly slower than the dot's 1200ms breathe so the waves feel independent but harmonious.
   */
  .spinner-dot::before,
  .spinner-dot::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background-color: var(--color-accent);
    opacity: 0;
    animation: spinner-ripple 1400ms var(--ease-qovira) infinite;
    /* Pseudo-elements do not inherit position from the parent inline element; explicitly reset to avoid paint
     * artifacts when the parent sits in a flex/grid context. */
    pointer-events: none;
  }

  .spinner-dot {
    /* `position: relative` is needed so the absolutely-positioned pseudo-elements are contained by the dot. */
    position: relative;
  }

  /* Second ring offset by half the duration for a continuous, unbroken wave feel. */
  .spinner-dot::after {
    animation-delay: 700ms;
  }

  @keyframes spinner-ripple {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(2.5);
      opacity: 0;
    }
  }

  /*
   * Explicit reduced-motion suppression: hide the rings entirely so the component shows a calm static dot
   * rather than a ring frozen at an arbitrary mid-animation scale. The theme's global guard already forces
   * animation-duration to 0.01ms on ::before/::after, but that collapses — not removes — the element, which
   * could leave a scaled ring visible for that one frame. `display: none` is the safest clean-state.
   */
  @media (prefers-reduced-motion: reduce) {
    .spinner-dot::before,
    .spinner-dot::after {
      display: none;
    }
  }
</style>
