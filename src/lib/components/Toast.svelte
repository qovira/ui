<script lang="ts">
  import { untrack } from "svelte";
  import CheckCircleIcon from "phosphor-svelte/lib/CheckCircleIcon";
  import InfoIcon from "phosphor-svelte/lib/InfoIcon";
  import WarningIcon from "phosphor-svelte/lib/WarningIcon";
  import XCircleIcon from "phosphor-svelte/lib/XCircleIcon";
  import XIcon from "phosphor-svelte/lib/XIcon";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
  import { createDismissTimer } from "../internal/dismiss-timer.js";
  import type { ToastData } from "../internal/toast-store.svelte.js";

  let { toast, ondismiss }: { toast: ToastData; ondismiss: () => void } = $props();

  // Semantic color AND an icon — never color alone. Tint/text pairs are the
  // theme's AA-verified status pairings; the icon inherits the text color.
  const ICON = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: WarningIcon,
    info: InfoIcon,
  } as const;
  const TONE = {
    success: "bg-tint-success text-fg-success",
    error: "bg-tint-error text-fg-error",
    warning: "bg-tint-warning text-fg-warning",
    info: "bg-tint-info text-fg-info",
  } as const;

  // Auto-dismiss timer that pauses on hover/focus and resumes with the time it
  // had left (the remaining-time arithmetic lives in, and is unit-tested via,
  // `dismiss-timer.ts`). The timer captures `ondismiss` once, so `paused` is the
  // ONLY dependency of the effect below — a sibling toast adding/dismissing
  // never re-arms this one's timer.
  let paused = $state(false);
  let progress = $state(1);

  // The duration never changes for a toast; capture it once (untrack documents
  // that, and keeps this off the effect's dependency set).
  const duration = untrack(() => toast.duration);
  const timer = createDismissTimer(duration, () => ondismiss());

  // Show the bar only for finite, positive-duration toasts.
  const showBar = Number.isFinite(duration) && duration > 0;

  $effect(() => {
    if (paused) {
      timer.pause();
    } else {
      timer.resume();
    }
    return () => timer.pause();
  });

  // Drive the progress bar via a rAF loop while the timer is running. The loop
  // is skipped entirely under prefers-reduced-motion so the bar doesn't spin
  // needlessly (the bar itself is also hidden via `motion-reduce:hidden`, but
  // skipping the loop avoids the rAF overhead too). When paused, the rAF is
  // cancelled so the bar freezes at its current width — the timer is already
  // paused, keeping both in sync.
  $effect(() => {
    if (!showBar) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Track paused reactively: when the value is true we cancel; when false we start.
    if (paused) {
      // Bar is frozen — nothing to do; the rAF from the last running phase was
      // already cancelled by the cleanup below.
      return;
    }

    let rafId: number;

    const tick = () => {
      progress = timer.progress();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  });
</script>

<!-- pointer-events-auto: the stack container is click-through when empty; each
     toast re-enables its own interactions. relative + overflow-hidden creates the
     stacking context for the absolute progress bar. -->
<div
  role="status"
  class={cn(
    "pointer-events-auto relative overflow-hidden flex items-center gap-2 rounded-md border border-border p-3 shadow-[var(--shadow-md)]",
    TONE[toast.variant],
  )}
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
  onfocusout={() => (paused = false)}
>
  <Icon icon={ICON[toast.variant]} decorative />
  <span class="text-small font-sans">{toast.message}</span>
  <!-- Inherits the toast's semantic text color via currentColor; meets the
       hit-target floor and keeps the focus ring. -->
  <button
    type="button"
    aria-label="Dismiss"
    class="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md hover:bg-fg/5 focus-ring"
    onclick={ondismiss}
  >
    <Icon icon={XIcon} decorative />
  </button>

  {#if showBar}
    <!-- aria-hidden: the bar is a visual affordance only; the live-region
         announcement and dismiss button cover the accessible experience.
         motion-reduce:hidden: hidden for users who prefer reduced motion (the
         toast still auto-dismisses; only the visual bar is suppressed).
         GPU-composited scaleX is used rather than animating width, so the
         deplete does not trigger layout. -->
    <div
      aria-hidden="true"
      class="motion-reduce:hidden absolute bottom-0 left-0 h-1 w-full origin-left bg-current/30"
      style="transform: scaleX({progress})"
    ></div>
  {/if}
</div>
