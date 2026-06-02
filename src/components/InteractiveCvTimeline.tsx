import { useState, useMemo, useEffect } from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { cvTimelineEntries, type TimelineEntry } from "../utils/timeline.js";
import { useIsNarrowViewport } from "../hooks/useIsNarrowViewport.js";
import { InteractiveCard } from "./InteractiveCard.js";

interface TypeConfig {
  label: string;
  color: string;
  chipBg: string;
  chipBorder: string;
}

const typeConfig: Record<string, TypeConfig> = {
  all: {
    label: "All",
    color: "rgba(243, 245, 247, 0.95)",
    chipBg: "rgba(255, 255, 255, 0.12)",
    chipBorder: "rgba(255, 255, 255, 0.26)",
  },
  work: {
    label: "Work",
    color: "rgba(109, 195, 255, 1)",
    chipBg: "rgba(109, 195, 255, 0.18)",
    chipBorder: "rgba(109, 195, 255, 0.45)",
  },
  extracurricular: {
    label: "Extracurricular",
    color: "rgba(133, 226, 166, 1)",
    chipBg: "rgba(133, 226, 166, 0.16)",
    chipBorder: "rgba(133, 226, 166, 0.42)",
  },
};

const filterOptions = [typeConfig.all, typeConfig.work, typeConfig.extracurricular];
const railColor =
  "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.45), rgba(255,255,255,0.2))";
const maxSlopeDropPx = 56;
const laneWidthPx = 236;

export function InteractiveCvTimeline() {
  const isNarrowViewport = useIsNarrowViewport(980);
  const [selectedId, setSelectedId] = useState(cvTimelineEntries[0]?.id ?? "");
  const [timelineFilter, setTimelineFilter] = useState("all");

  const filteredEntries = useMemo<TimelineEntry[]>(() => {
    if (timelineFilter === "all") return cvTimelineEntries;
    return cvTimelineEntries.filter((item) => item.type === timelineFilter);
  }, [timelineFilter]);

  useEffect(() => {
    if (!filteredEntries.length) {
      setSelectedId("");
      return;
    }
    setSelectedId((current) => {
      if (filteredEntries.some((item) => item.id === current)) return current;
      return filteredEntries[0]?.id ?? "";
    });
  }, [filteredEntries]);

  const activeEntry = useMemo<TimelineEntry | undefined>(
    () =>
      filteredEntries.find((item) => item.id === selectedId) ??
      filteredEntries[0] ??
      cvTimelineEntries[0],
    [filteredEntries, selectedId]
  );

  const { nodeSlopeStepPx, effectiveSlopeDropPx, effectiveRailTiltDeg } = useMemo(() => {
    const n = filteredEntries.length;
    const stepPx = n > 1 ? Math.min(5.4, maxSlopeDropPx / (n - 1)) : 0;
    const dropPx = stepPx * Math.max(n - 1, 0);
    const tiltDeg =
      n > 1 ? (Math.atan2(dropPx, Math.max(1, n * laneWidthPx)) * 180) / Math.PI : 0;
    return {
      nodeSlopeStepPx: stepPx,
      effectiveSlopeDropPx: isNarrowViewport ? 0 : dropPx,
      effectiveRailTiltDeg: isNarrowViewport ? 0 : tiltDeg,
    };
  }, [filteredEntries.length, isNarrowViewport]);

  if (!activeEntry) return null;

  return (
    <InteractiveCard className="cv-timeline-shell" sx={{ p: { xs: 2.2, md: 2.6 } }}>
      <Stack spacing={2}>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {filterOptions.map((option) => {
            const key = option.label.toLowerCase();
            const isActive = timelineFilter === key;
            return (
              <Chip
                key={option.label}
                size="small"
                clickable
                label={option.label}
                aria-pressed={isActive}
                onClick={() => setTimelineFilter(key)}
                variant={isActive ? "filled" : "outlined"}
                sx={{
                  bgcolor: isActive ? option.chipBg : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? option.chipBorder : "rgba(255,255,255,0.12)"}`,
                  color: isActive ? option.color : "rgba(165,173,184,1)",
                }}
              />
            );
          })}
        </Stack>

        <div
          className="cv-timeline-scroll"
          style={{ overflowX: "auto", padding: "0.15rem 0.1rem 0.55rem" }}
        >
          <div
            className="cv-timeline-track"
            role="tablist"
            aria-label="combined timeline"
            style={{
              position: "relative",
              display: "flex",
              gap: "0.95rem",
              minWidth: "max-content",
              padding: "0.2rem 0.2rem 0.35rem",
            }}
          >
            <span
              aria-hidden="true"
              className="cv-timeline-rail"
              style={{
                background: railColor,
                top: `calc(1.02rem + ${effectiveSlopeDropPx.toFixed(2)}px)`,
                transform: `rotate(${-effectiveRailTiltDeg.toFixed(3)}deg)`,
              }}
            />
            {filteredEntries.map((item, i) => {
              const isActive = selectedId === item.id;
              const itemType = typeConfig[item.type] ?? typeConfig.extracurricular;
              const verticalOffsetPx = isNarrowViewport
                ? 0
                : Number((effectiveSlopeDropPx - i * nodeSlopeStepPx).toFixed(2));

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-expanded={isActive}
                  className={`cv-timeline-node ${isActive ? "is-active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                  style={
                    {
                      "--node-offset": `${verticalOffsetPx}px`,
                      "--node-color": itemType.color,
                      "--node-border": isActive
                        ? itemType.chipBorder
                        : "rgba(255,255,255,0.1)",
                      "--node-bg": isActive
                        ? "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.04)",
                      "--node-text": isActive
                        ? "rgba(243,245,247,1)"
                        : "rgba(165,173,184,1)",
                    } as React.CSSProperties
                  }
                >
                  <span className="cv-timeline-node__dot" />
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      marginBottom: "0.28rem",
                      fontSize: "0.68rem",
                      letterSpacing: "0.03em",
                      textTransform: "uppercase",
                      color: itemType.color,
                    }}
                  >
                    {itemType.label}
                  </span>
                  <span
                    className="cv-timeline-node__date"
                    style={{
                      display: "block",
                      fontSize: "0.74rem",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "rgba(125,133,145,1)",
                    }}
                  >
                    {item.date}
                  </span>
                  <span
                    className="cv-timeline-node__org"
                    style={{
                      display: "block",
                      marginTop: "0.35rem",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.org}
                  </span>
                  <span
                    className="cv-timeline-node__role"
                    style={{
                      display: "block",
                      marginTop: "0.32rem",
                      fontSize: "0.8rem",
                      color: "rgba(125,133,145,1)",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Paper
          key={activeEntry.id}
          className="cv-timeline-detail"
          variant="outlined"
          sx={{ p: 2 }}
        >
          <Stack spacing={1.4}>
            <Stack
              className="cv-timeline-detail__header"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              <div>
                <Typography className="cv-timeline-detail__title" variant="h6">
                  {activeEntry.role}
                </Typography>
                <Typography className="panel-meta">{activeEntry.org}</Typography>
              </div>
              <Stack className="cv-timeline-detail__chips" direction="row" gap={0.8}>
                <Chip
                  size="small"
                  label={(typeConfig[activeEntry.type] ?? typeConfig.extracurricular).label}
                  sx={{
                    bgcolor: (typeConfig[activeEntry.type] ?? typeConfig.extracurricular).chipBg,
                    border: `1px solid ${(typeConfig[activeEntry.type] ?? typeConfig.extracurricular).chipBorder}`,
                    color: (typeConfig[activeEntry.type] ?? typeConfig.extracurricular).color,
                  }}
                />
                <Chip size="small" label={activeEntry.date} variant="outlined" />
              </Stack>
            </Stack>
            <Typography className="cv-timeline-detail__summary" color="text.secondary">
              {activeEntry.summary}
            </Typography>
            <div className="dynamic-divider" />
            <ul className="cv-timeline-detail__list">
              {activeEntry.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </Stack>
        </Paper>
      </Stack>
    </InteractiveCard>
  );
}
