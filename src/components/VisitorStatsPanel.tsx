import { useMemo } from "react";
import { Button, Chip, Stack, Typography } from "@mui/material";
import { useVisitorStats } from "../hooks/useVisitorStats.js";
import { InteractiveCard } from "./InteractiveCard.js";
import { Reveal } from "./Reveal.js";

export function VisitorStatsPanel() {
  const { clickPulse, incrementClick, isLive, isSyncing, stats } = useVisitorStats();
  const countFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);
  const liveLabel = isLive ? "Live" : isSyncing ? "Syncing" : "Seeded";

  return (
    <Reveal rotate="left">
      <section id="site-stats" className="section site-stats-section" aria-label="Website counters">
        <div className="section-heading site-stats-heading">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            Site pulse
          </span>
        </div>
        <div className="site-stats-grid">
          <InteractiveCard
            className="site-stat-card site-stat-card--clicks"
            sx={{ p: { xs: 2.4, md: 2.8 } }}
          >
            <Stack spacing={2.1} className="parallax-layer">
              <div className="site-stat-card__header">
                <Typography className="mini-label">Community clicks</Typography>
                <Chip label="Press friendly" variant="outlined" size="small" />
              </div>
              <Typography
                key={`click-${clickPulse}`}
                className="site-stat-value site-stat-value--pop"
                aria-live="polite"
              >
                {countFormatter.format(stats.clicks)}
              </Typography>
              <div className="site-stat-card__footer">
                <Button
                  variant="contained"
                  onClick={() => void incrementClick()}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Click counter
                </Button>
              </div>
            </Stack>
          </InteractiveCard>

          <InteractiveCard
            className="site-stat-card site-stat-card--views"
            sx={{ p: { xs: 2.4, md: 2.8 } }}
          >
            <Stack spacing={2.1} className="parallax-layer">
              <div className="site-stat-card__header">
                <span className="site-stat-live-label">
                  <span className={`status-dot ${isLive ? "" : "is-offline"}`} />
                  {liveLabel}
                </span>
                <Chip label="Views" variant="outlined" size="small" />
              </div>
              <Typography className="site-stat-value" aria-live="polite">
                {countFormatter.format(stats.views)}
              </Typography>
              <Typography color="text.secondary" className="site-stat-copy">
                People who have viewed this website.
              </Typography>
            </Stack>
          </InteractiveCard>
        </div>
      </section>
    </Reveal>
  );
}
