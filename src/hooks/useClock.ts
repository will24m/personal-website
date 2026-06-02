import { useState, useEffect } from "react";

export function useClock(): Date {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let timeoutId = 0;
    let intervalId = 0;

    const clearTimers = () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      timeoutId = 0;
      intervalId = 0;
    };

    const syncNow = () => setNow(new Date());
    const schedule = () => {
      clearTimers();
      if (document.visibilityState === "hidden") return;

      const msUntilNextMinute = 60000 - (Date.now() % 60000);
      timeoutId = window.setTimeout(() => {
        syncNow();
        intervalId = window.setInterval(syncNow, 60000);
      }, msUntilNextMinute);
    };

    const handleVisibilityChange = () => {
      syncNow();
      schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimers();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return now;
}
