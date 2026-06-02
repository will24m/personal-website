import { useState, useEffect } from "react";
import {
  visitorStatsConfig,
  canUseVisitorStatsApi,
  incrementStoredStatExtra,
  getFallbackVisitorStats,
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
  const [stats, setStats] = useState<VisitorStats>(() => getFallbackVisitorStats());
  const [isLive, setIsLive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [clickPulse, setClickPulse] = useState(0);

  const mergeStats = (nextStats: VisitorStats) => {
    setStats((current) => ({
      clicks: Math.max(current.clicks, nextStats.clicks),
      views: Math.max(current.views, nextStats.views),
    }));
  };

  useEffect(() => {
    let cancelled = false;
    const canUseApi = canUseVisitorStatsApi();

    const syncStats = async (eventType: string | null = null) => {
      if (!canUseApi || document.visibilityState === "hidden") {
        if (eventType === "view") incrementStoredStatExtra(visitorStatsConfig.localViewKey);
        mergeStats(getFallbackVisitorStats());
        setIsLive(false);
        return;
      }

      setIsSyncing(true);
      try {
        const nextStats = await fetchVisitorStats(eventType);
        if (!cancelled) {
          mergeStats(nextStats);
          setIsLive(true);
        }
      } catch {
        if (eventType === "view") incrementStoredStatExtra(visitorStatsConfig.localViewKey);
        if (!cancelled) {
          mergeStats(getFallbackVisitorStats());
          setIsLive(false);
        }
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
      if (
        [visitorStatsConfig.localClickKey, visitorStatsConfig.localViewKey].includes(
          event.key ?? ""
        )
      ) {
        mergeStats(getFallbackVisitorStats());
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
      mergeStats(getFallbackVisitorStats());
      setIsLive(false);
      return;
    }

    try {
      const nextStats = await fetchVisitorStats("click");
      mergeStats(nextStats);
      setIsLive(true);
    } catch {
      incrementStoredStatExtra(visitorStatsConfig.localClickKey);
      mergeStats(getFallbackVisitorStats());
      setIsLive(false);
    }
  };

  return { clickPulse, incrementClick, isLive, isSyncing, stats };
}
