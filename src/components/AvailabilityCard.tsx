import { Box, Chip, Stack, Typography } from "@mui/material";
import { site } from "../config.js";
import { useClock } from "../hooks/useClock.js";
import { useTorontoAvailability } from "../hooks/useTorontoAvailability.js";
import { InteractiveCard } from "./InteractiveCard.js";

export function AvailabilityCard() {
  const now = useClock();
  const availability = useTorontoAvailability(now);

  return (
    <InteractiveCard className="availability-card" sx={{ p: 3 }}>
      <Stack spacing={1.8} className="parallax-layer">
        <Chip label="Live status" color="secondary" variant="outlined" sx={{ width: "fit-content" }} />
        <Box className="availability-status">
          <span className={`status-dot ${availability.isLive ? "" : "is-offline"}`} />
          {availability.statusLabel}
        </Box>
        <Typography className="availability-time">{availability.timeLabel}</Typography>
        <Typography color="text.secondary">
          {availability.dateLabel} in Toronto. Open to software and technical roles.
        </Typography>
        <Stack spacing={1}>
          <div className="detail-row">
            <span className="detail-label">Location</span>
            <strong>{site.location}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Current role</span>
            <strong>{site.currentRole}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Background</span>
            <strong>{site.nextRole}</strong>
          </div>
          <div className="detail-row">
            <span className="detail-label">Best contact</span>
            <strong>{site.email}</strong>
          </div>
        </Stack>
      </Stack>
    </InteractiveCard>
  );
}
