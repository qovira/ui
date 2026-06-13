export interface DismissTimer {
  /** Start, or resume after a pause, counting down the time it has left. Idempotent — a call while already running is a no-op. */
  resume(): void;
  /** Pause the countdown, banking the elapsed time so a later `resume()` continues from where it left off. Idempotent. */
  pause(): void;
}

/**
 * A pause/resume auto-dismiss countdown, decoupled from any framework so the
 * remaining-time arithmetic is unit-testable with fake timers (see
 * `dismiss-timer.test.ts`). `<Toast>` drives it from a single `$effect` keyed on
 * its `paused` state; `onDismiss` is captured here (not read inside that effect),
 * so a sibling toast adding/dismissing can't re-arm an unrelated toast's timer.
 */
export function createDismissTimer(duration: number, onDismiss: () => void): DismissTimer {
  let remaining = Math.max(0, duration);
  let startedAt = 0;
  let handle: ReturnType<typeof setTimeout> | undefined;

  return {
    resume() {
      if (handle !== undefined || remaining <= 0) return;
      startedAt = Date.now();
      handle = setTimeout(() => {
        handle = undefined;
        onDismiss();
      }, remaining);
    },
    pause() {
      if (handle === undefined) return;
      clearTimeout(handle);
      handle = undefined;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    },
  };
}
