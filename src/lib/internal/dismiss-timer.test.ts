import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDismissTimer } from "./dismiss-timer.js";

describe("createDismissTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires onDismiss once the full duration elapses", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(999);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("does not fire while paused", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(400);
    timer.pause();
    vi.advanceTimersByTime(10_000);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("resumes with exactly the time it had left", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(400);
    timer.pause();
    timer.resume();
    vi.advanceTimersByTime(599);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("conserves total lifetime across multiple pause/resume cycles", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(300);
    timer.pause();
    timer.resume();
    vi.advanceTimersByTime(300);
    timer.pause();
    timer.resume();
    vi.advanceTimersByTime(399);
    expect(onDismiss).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("is idempotent: a repeated resume does not double-arm the timer", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);

    timer.resume();
    timer.resume();
    vi.advanceTimersByTime(1000);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("is idempotent: a repeated pause does not subtract time twice", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(400);
    timer.pause();
    timer.pause();
    timer.resume();
    vi.advanceTimersByTime(600);
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
