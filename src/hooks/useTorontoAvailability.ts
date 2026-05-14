import { useMemo } from "react";

export interface TorontoAvailability {
  dateLabel: string;
  timeLabel: string;
  isLive: boolean;
  statusLabel: string;
}

const TZ = "America/Toronto";
const weekdayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, weekday: "short" });
const hourFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  hour: "numeric",
  hour12: false,
});
const timeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  hour: "numeric",
  minute: "2-digit",
});
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  month: "short",
  day: "numeric",
});
const workDays = new Set(["Mon", "Tue", "Wed", "Thu", "Fri"]);

export function useTorontoAvailability(now: Date): TorontoAvailability {
  return useMemo(() => {
    const weekday = weekdayFormatter.format(now);
    const hour = Number(hourFormatter.format(now));
    const timeLabel = timeFormatter.format(now);
    const dateLabel = dateFormatter.format(now);

    const isLive = workDays.has(weekday) && hour >= 10 && hour < 18;
    return {
      dateLabel,
      timeLabel,
      isLive,
      statusLabel: isLive ? "Likely active right now" : "Likely replies next work block",
    };
  }, [now]);
}
