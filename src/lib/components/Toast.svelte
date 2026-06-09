<script lang="ts">
  import { untrack } from "svelte";
  import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, XIcon } from "phosphor-svelte";
  import Icon from "../icons/Icon.svelte";
  import { cn } from "../internal/cn.js";
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
    success: "bg-success-tint text-success-text",
    error: "bg-error-tint text-error-text",
    warning: "bg-warning-tint text-warning-text",
    info: "bg-info-tint text-info-text",
  } as const;

  // Auto-dismiss timer that pauses on hover/focus and resumes with the time it
  // had left. `remaining`/`startedAt` are plain (non-reactive) so only `paused`
  // drives the effect — reading them as state would loop.
  let paused = $state(false);
  // One-time capture of the initial duration; it never changes for a toast.
  let remaining = untrack(() => toast.duration);
  let startedAt = 0;

  $effect(() => {
    if (paused) return;
    startedAt = Date.now();
    const timer = setTimeout(ondismiss, remaining);
    return () => {
      clearTimeout(timer);
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    };
  });
</script>

<!-- pointer-events-auto: the stack container is click-through when empty; each
     toast re-enables its own interactions. -->
<div
  role="status"
  class={cn(
    "pointer-events-auto flex items-center gap-2 rounded-md border border-border p-3 shadow-[var(--shadow-md)]",
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
    class="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md hover:bg-text/5 focus-ring"
    onclick={ondismiss}
  >
    <Icon icon={XIcon} decorative />
  </button>
</div>
