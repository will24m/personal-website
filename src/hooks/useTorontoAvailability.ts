import { useMemo } from "react";

export interface TorontoAvailability {
  dateLabel: string;
  timeLabel: string;
  isLive: boolean;
  statusLabel: string;
}

export function useTorontoAvailability(now: Date): TorontoAvailability {
  return useMemo(() => {
    const weekday = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      weekday: "short",
    }).format(now);
    const hour = Number(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        hour: "numeric",
        hour12: false,
      }).format(now)
    );
    const timeLabel = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      hour: "numeric",
      minute: "2-digit",
    }).format(now);
    const dateLabel = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      month: "short",
      day: "numeric",
    }).format(now);

    const isLive =
      ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday) && hour >= 10 && hour < 18;
    return {
      dateLabel,
      timeLabel,
      isLive,
      statusLabel: isLive ? "Likely active right now" : "Likely replies next work block",
    };
  }, [now]);
}
