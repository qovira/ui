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
    /**
     * `accent` (default) is the honey lamp-glow signature, for cream/espresso surfaces. `current` drops the honey
     * fill/halo and inherits the surrounding text color (the pulse + ripple motion is unchanged), so it stays visible
     * on colored fills — e.g. inside a Button, on a honey or red variant.
     */
    tone?: "accent" | "current";
    /**
     * Decorative mode: drop role="status" and the label. Use when the host already conveys the busy state (e.g. a
     * Button with aria-busy), so the spinner isn't announced twice nor folded into the host's accessible name.
     */
    decorative?: boolean;
    class?: string;
  }

  let {
    size = "md",
    label = "Loading…",
    showLabel = false,
    tone = "accent",
    decorative = false,
    class: klass,
    ...rest
  }: Props = $props();

  // The honey dot's diameter; the lamp-glow halo (a fixed-radius box-shadow) and the pulse are the theme's.
  const DOT = { sm: "size-3", md: "size-4", lg: "size-6" } as const;
</script>

<!-- Qovira's signature wait state: a honey dot wearing the theme's lamp-glow halo, with accent-colored radiating rings
     (ripple) that read clearly against both Daylight (cream) and Evening (espresso) backgrounds. The ::before and
     ::after pseudo-elements animate `scale` + `opacity` to produce a staggered two-ring wave. The theme's global
     prefers-reduced-motion guard collapses all animations (including the pseudo-elements); an explicit in-component
     rule additionally hides the rings entirely for a clean static dot rather than a frozen mid-ripple state. Meaning is
     never trapped in motion: role="status" announces the text, and the glow/rings are aria-hidden. -->
<div role={decorative ? undefined : "status"} class={cn("inline-flex items-center gap-2", klass)} {...rest}>
  <span
    class={cn(
      "spinner-dot rounded-full lamp-glow-pulse",
      // `current` inherits the host text color (no honey halo); `accent` is the signature glow.
      tone === "current" ? "spinner-dot--current bg-current" : "bg-accent lamp-glow",
      DOT[size],
    )}
    aria-hidden="true"
  ></span>
  {#if !decorative}
    <span class={showLabel ? "text-small font-sans text-fg" : "sr-only"}>{label}</span>
  {/if}
</div>

<style>
  /*
   * Radiating accent-colored rings — drawn as pseudo-elements so no DOM nodes are needed and the parent's aria-hidden
   * is inherited. Two rings at different animation-delay values give a continuous staggered wave effect.
   *
   * Scale: starts at 1 (same size as dot), expands to ~2.5× before fading out.
   * Color: --spinner-ink, defaulting to var(--color-accent) = honey (contrasts against both cream and espresso); the
   *        `current` tone overrides it to currentColor so the rings match the host text on a colored fill.
   * Easing: var(--ease-qovira) — the brand ease (cubic-bezier(0.2, 0.8, 0.2, 1)).
   * Duration: 1200ms — matched to the dot's breathe so the rings stay phase-locked to the pulse, not drifting.
   */
  .spinner-dot::before,
  .spinner-dot::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background-color: var(--spinner-ink, var(--color-accent));
    opacity: 0;
    animation: spinner-ripple 1200ms var(--ease-qovira) infinite;
    /* Decorative rings never intercept pointer events. */
    pointer-events: none;
  }

  /* `current` tone: dot fill, halo (none), and rings all follow the host text color. */
  .spinner-dot--current {
    --spinner-ink: currentColor;
  }

  .spinner-dot {
    /* `position: relative` is needed so the absolutely-positioned pseudo-elements are contained by the dot. */
    position: relative;
  }

  /* Second ring offset by half the duration for a continuous, unbroken wave feel. */
  .spinner-dot::after {
    animation-delay: 600ms;
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
   * Explicit reduced-motion suppression: hide the rings entirely so the component shows a calm static dot rather than a
   * ring frozen at an arbitrary mid-animation scale. The theme's global guard already forces animation-duration to
   * 0.01ms on ::before/::after, but that collapses — not removes — the element, which could leave a scaled ring visible
   * for that one frame. `display: none` is the safest clean-state.
   */
  @media (prefers-reduced-motion: reduce) {
    .spinner-dot::before,
    .spinner-dot::after {
      display: none;
    }
  }
</style>
