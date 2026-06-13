import { useMemo } from "react";
import { useVisitorStats } from "../hooks/useVisitorStats.js";

export function VisitorStatsPanel() {
  const { incrementClick, isLive, isSyncing, stats } = useVisitorStats();
  const countFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);
  const liveLabel = isLive ? "Live" : isSyncing ? "Syncing" : "Seeded";

  return (
    <section className="section stats" aria-label="Website counters">
      <div className="surface-card stats__card">
        <div className="stats__item">
          <span className="stats__label">Community clicks</span>
          <span className="stats__value" aria-live="polite">
            {countFormatter.format(stats.clicks)}
          </span>
          <button className="button" type="button" onClick={() => void incrementClick()}>
            Click counter
          </button>
        </div>
        <div className="stats__item">
          <span className="stats__label">
            <span className={`status-dot ${isLive ? "" : "is-offline"}`.trim()} />
            Views · {liveLabel}
          </span>
          <span className="stats__value" aria-live="polite">
            {countFormatter.format(stats.views)}
          </span>
          <span className="stats__copy">People who have viewed this website.</span>
        </div>
      </div>
    </section>
  );
}
