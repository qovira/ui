export interface DismissTimer {
  /**
   * Start, or resume after a pause, counting down the time it has left. Idempotent — a call while
   * already running is a no-op.
   */
  resume(): void;
  /**
   * Pause the countdown, banking the elapsed time so a later `resume()` continues from where it left
   * off. Idempotent.
   */
  pause(): void;
  /**
   * The fraction of time REMAINING, in [0, 1] (1 = full, 0 = done). While running, this is
   * live — it reflects elapsed wall-clock time so a rAF loop can read it every frame. While
   * paused (or before the first `resume()`), it returns the banked fraction, frozen until the
   * next `resume()`. Returns 0 for a zero-duration timer.
   */
  progress(): number;
}

/**
 * A pause/resume auto-dismiss countdown, decoupled from any framework so the
 * remaining-time arithmetic is unit-testable with fake timers (see
 * `dismiss-timer.test.ts`). `<Toast>` drives it from a single `$effect` keyed on
 * its `paused` state; `onDismiss` is captured here (not read inside that effect),
 * so a sibling toast adding/dismissing can't re-arm an unrelated toast's timer.
 */
export function createDismissTimer(duration: number, onDismiss: () => void): DismissTimer {
  const total = Math.max(0, duration);
  let remaining = total;
  let startedAt = 0;
  let handle: ReturnType<typeof setTimeout> | undefined;

  return {
    resume() {
      if (handle !== undefined || remaining <= 0) {
        return;
      }
      startedAt = Date.now();
      handle = setTimeout(() => {
        handle = undefined;
        remaining = 0;
        onDismiss();
      }, remaining);
    },
    pause() {
      if (handle === undefined) {
        return;
      }
      clearTimeout(handle);
      handle = undefined;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
    },
    progress() {
      if (total <= 0) {
        return 0;
      }
      // Running: compute the live remaining by subtracting elapsed time from the banked ms.
      // Paused / not-started: `handle` is undefined, so just use the banked `remaining`.
      const live = handle !== undefined ? Math.max(0, remaining - (Date.now() - startedAt)) : remaining;
      return Math.min(1, Math.max(0, live / total));
    },
  };
}
