import { Paper, Typography } from "@mui/material";
import { site } from "../config.js";
import { useClock } from "../hooks/useClock.js";
import { useTorontoAvailability } from "../hooks/useTorontoAvailability.js";

export function Footer() {
  const now = useClock();
  const availability = useTorontoAvailability(now);

  return (
    <footer className="site-footer">
      <Paper className="site-footer__inner" elevation={0}>
        <Typography className="footer-copy">
          Queen's University Bachelor of Computing (Honours), Software Design Specialization,
          Dean's Honour List (GPA 3.8). Experience across software engineering, systems
          engineering, and technical program management. Toronto time: {availability.timeLabel}.
        </Typography>
        <div className="footer-links">
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </Paper>
    </footer>
  );
}
