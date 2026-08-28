import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getAmbientVisitorStats,
  getStoredStatExtra,
  incrementStoredStatExtra,
  normalizeVisitorStats,
  visitorStatsConfig,
} from "./stats.js";

describe("getAmbientVisitorStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the base values at the epoch", () => {
    vi.setSystemTime(visitorStatsConfig.epochMs);
    expect(getAmbientVisitorStats()).toEqual({
      clicks: visitorStatsConfig.clickBase,
      views: visitorStatsConfig.viewBase,
    });
  });

  it("accrues one click per 103 minutes and one view per 181 minutes", () => {
    vi.setSystemTime(visitorStatsConfig.epochMs + 181 * 60_000);
    expect(getAmbientVisitorStats()).toEqual({
      clicks: visitorStatsConfig.clickBase + 1,
      views: visitorStatsConfig.viewBase + 1,
    });
  });

  it("never goes below the base values before the epoch", () => {
    vi.setSystemTime(visitorStatsConfig.epochMs - 86_400_000);
    expect(getAmbientVisitorStats()).toEqual({
      clicks: visitorStatsConfig.clickBase,
      views: visitorStatsConfig.viewBase,
    });
  });
});

describe("stored stat extras", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("treats missing or invalid values as zero", () => {
    expect(getStoredStatExtra("missing-key")).toBe(0);
    window.localStorage.setItem("bad-key", "not-a-number");
    expect(getStoredStatExtra("bad-key")).toBe(0);
    window.localStorage.setItem("negative-key", "-3");
    expect(getStoredStatExtra("negative-key")).toBe(0);
  });

  it("increments persistently", () => {
    expect(incrementStoredStatExtra("counter-key")).toBe(1);
    expect(incrementStoredStatExtra("counter-key")).toBe(2);
    expect(getStoredStatExtra("counter-key")).toBe(2);
  });
});

describe("normalizeVisitorStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(visitorStatsConfig.epochMs);
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses server values when they exceed the local fallback", () => {
    const result = normalizeVisitorStats({ clicks: 999999, views: 888888 });
    expect(result).toEqual({ clicks: 999999, views: 888888 });
  });

  it("never reports less than the local fallback", () => {
    const result = normalizeVisitorStats({ clicks: 1, views: 1 });
    expect(result.clicks).toBeGreaterThanOrEqual(visitorStatsConfig.clickBase);
    expect(result.views).toBeGreaterThanOrEqual(visitorStatsConfig.viewBase);
  });

  it("survives malformed payloads", () => {
    for (const payload of [null, undefined, {}, { clicks: "x" }, []]) {
      const result = normalizeVisitorStats(payload);
      expect(Number.isFinite(result.clicks)).toBe(true);
      expect(Number.isFinite(result.views)).toBe(true);
    }
  });
});
