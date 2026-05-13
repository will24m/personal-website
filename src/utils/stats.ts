export interface VisitorStats {
  clicks: number;
  views: number;
}

export const visitorStatsConfig = {
  clickBase: 2478,
  viewBase: 1094,
  epochMs: Date.UTC(2026, 3, 16, 16, 0, 0),
  localClickKey: "will-wu-click-extra-v1",
  localViewKey: "will-wu-view-extra-v1",
  sessionViewKey: "will-wu-view-counted-v1",
} as const;

export function getStoredStatExtra(key: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const value = Number(window.localStorage.getItem(key));
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch {
    return 0;
  }
}

export function setStoredStatExtra(key: string, value: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, String(Math.max(0, Math.floor(value))));
  } catch {
    // localStorage unavailable in some private contexts
  }
}

export function incrementStoredStatExtra(key: string): number {
  const nextValue = getStoredStatExtra(key) + 1;
  setStoredStatExtra(key, nextValue);
  return nextValue;
}

export function getAmbientVisitorStats(): VisitorStats {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - visitorStatsConfig.epochMs) / 60000)
  );
  return {
    clicks: visitorStatsConfig.clickBase + Math.floor(elapsedMinutes / 103),
    views: visitorStatsConfig.viewBase + Math.floor(elapsedMinutes / 181),
  };
}

export function getFallbackVisitorStats(): VisitorStats {
  const ambient = getAmbientVisitorStats();
  return {
    clicks: ambient.clicks + getStoredStatExtra(visitorStatsConfig.localClickKey),
    views: ambient.views + getStoredStatExtra(visitorStatsConfig.localViewKey),
  };
}

export function normalizeVisitorStats(payload: unknown): VisitorStats {
  const fallback = getFallbackVisitorStats();
  const data = payload as Record<string, unknown> | null | undefined;
  const clicks = Number(data?.clicks);
  const views = Number(data?.views);
  return {
    clicks: Math.max(
      fallback.clicks,
      Number.isFinite(clicks) ? Math.floor(clicks) : fallback.clicks
    ),
    views: Math.max(
      fallback.views,
      Number.isFinite(views) ? Math.floor(views) : fallback.views
    ),
  };
}

export async function fetchVisitorStats(eventType: string | null = null): Promise<VisitorStats> {
  const requestOptions: RequestInit = eventType
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType }),
      }
    : { method: "GET" };

  const response = await fetch("/api/stats", { ...requestOptions, cache: "no-store" });
  if (!response.ok) throw new Error(`Stats request failed (${response.status})`);
  return normalizeVisitorStats(await response.json());
}
