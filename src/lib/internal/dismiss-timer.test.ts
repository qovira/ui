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

  it("treats a non-finite duration as persistent — never arms (else setTimeout clamps it to ~1ms)", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(Infinity, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(10_000_000);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("treats a duration past the 32-bit setTimeout ceiling as persistent", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(3_000_000_000, onDismiss);

    timer.resume();
    vi.advanceTimersByTime(100);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});

describe("createDismissTimer — progress()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 1 before resume() is called (full fraction remaining)", () => {
    const timer = createDismissTimer(1000, vi.fn());
    expect(timer.progress()).toBe(1);
  });

  it("returns ~0.6 after resuming and advancing 400ms of a 1000ms timer", () => {
    const timer = createDismissTimer(1000, vi.fn());
    timer.resume();
    vi.advanceTimersByTime(400);
    const p = timer.progress();
    expect(p).toBeCloseTo(0.6, 5);
  });

  it("holds its value across a pause() (the fraction does not keep dropping)", () => {
    const timer = createDismissTimer(1000, vi.fn());
    timer.resume();
    vi.advanceTimersByTime(400);
    timer.pause();
    const frozen = timer.progress();
    // Advance wall-clock while paused — progress must stay fixed.
    vi.advanceTimersByTime(5000);
    expect(timer.progress()).toBeCloseTo(frozen, 10);
  });

  it("returns 0 once the full duration has elapsed", () => {
    const onDismiss = vi.fn();
    const timer = createDismissTimer(1000, onDismiss);
    timer.resume();
    vi.advanceTimersByTime(1000);
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(timer.progress()).toBe(0);
  });

  it("returns 0 for a zero-duration timer", () => {
    const timer = createDismissTimer(0, vi.fn());
    expect(timer.progress()).toBe(0);
  });
});
