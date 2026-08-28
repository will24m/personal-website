import { useState, useEffect } from "react";
import {
  visitorStatsConfig,
  canUseVisitorStatsApi,
  incrementStoredStatExtra,
  getFallbackVisitorStats,
  getInitialVisitorStats,
  readCachedLiveStats,
  writeCachedLiveStats,
  fetchVisitorStats,
  type VisitorStats,
} from "../utils/stats.js";

interface UseVisitorStatsReturn {
  clickPulse: number;
  incrementClick: () => Promise<void>;
  isLive: boolean;
  isSyncing: boolean;
  stats: VisitorStats;
}

export function useVisitorStats(): UseVisitorStatsReturn {
  const [stats, setStats] = useState<VisitorStats>(() => getInitialVisitorStats());
  const [isLive, setIsLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [clickPulse, setClickPulse] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const canUseApi = canUseVisitorStatsApi();

    // Live counts are authoritative and only ever increase, so adopt them directly and
    // cache for the next first paint.
    const applyLive = (next: VisitorStats) => {
      if (cancelled) return;
      setStats(next);
      writeCachedLiveStats(next);
      setIsLive(true);
    };

    const applyOffline = () => {
      if (cancelled) return;
      setStats(getFallbackVisitorStats());
      setIsLive(false);
    };

    const syncStats = async (eventType: string | null = null) => {
      if (!canUseApi || document.visibilityState === "hidden") {
        if (eventType === "view") incrementStoredStatExtra(visitorStatsConfig.localViewKey);
        applyOffline();
        return;
      }

      setIsSyncing(true);
      try {
        applyLive(await fetchVisitorStats(eventType));
      } catch {
        if (eventType === "view") incrementStoredStatExtra(visitorStatsConfig.localViewKey);
        applyOffline();
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    };

    let viewEvent: string | null = null;
    try {
      if (window.sessionStorage.getItem(visitorStatsConfig.sessionViewKey) !== "1") {
        window.sessionStorage.setItem(visitorStatsConfig.sessionViewKey, "1");
        viewEvent = "view";
        setStats((current) => ({ ...current, views: current.views + 1 }));
      }
    } catch {
      viewEvent = "view";
      setStats((current) => ({ ...current, views: current.views + 1 }));
    }

    void syncStats(viewEvent);

    const intervalId = canUseApi ? window.setInterval(() => void syncStats(), 30000) : 0;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void syncStats();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === visitorStatsConfig.liveCacheKey) {
        const cached = readCachedLiveStats();
        if (cached && !cancelled) setStats(cached);
      } else if (
        event.key === visitorStatsConfig.localClickKey ||
        event.key === visitorStatsConfig.localViewKey
      ) {
        if (!cancelled) setStats(getFallbackVisitorStats());
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const incrementClick = async (): Promise<void> => {
    setClickPulse((current) => current + 1);
    setStats((current) => ({ ...current, clicks: current.clicks + 1 }));

    if (!canUseVisitorStatsApi()) {
      incrementStoredStatExtra(visitorStatsConfig.localClickKey);
      setStats(getFallbackVisitorStats());
      setIsLive(false);
      return;
    }

    try {
      const nextStats = await fetchVisitorStats("click");
      setStats(nextStats);
      writeCachedLiveStats(nextStats);
      setIsLive(true);
    } catch {
      incrementStoredStatExtra(visitorStatsConfig.localClickKey);
      setStats(getFallbackVisitorStats());
      setIsLive(false);
    }
  };

  return { clickPulse, incrementClick, isLive, isSyncing, stats };
}
