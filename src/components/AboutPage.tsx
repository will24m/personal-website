import { useState, useDeferredValue, startTransition } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { site } from "../config.js";
import { stackGroups, stackNarratives } from "../data/skills.js";
import {
  profileReviewQuotes,
  educationHighlights,
  principles,
  technicalHighlights,
  projects,
} from "../data/content.js";
import { InteractiveCard } from "./InteractiveCard.js";
import { Reveal } from "./Reveal.js";
import { TypedSectionTitle } from "./TypedSectionTitle.js";
import { RotatingPhotoGallery } from "./RotatingPhotoGallery.js";
import { InteractiveCvTimeline } from "./InteractiveCvTimeline.js";
import { VisitorStatsPanel } from "./VisitorStatsPanel.js";

const defaultStackKey = Object.keys(stackGroups)[0] ?? "";

export function AboutPage() {
  const [tab, setTab] = useState(defaultStackKey);
  const deferredTab = useDeferredValue(tab);
  const stackContext = stackNarratives[deferredTab] ?? stackNarratives[defaultStackKey];
  const [profileReviewIndex, setProfileReviewIndex] = useState(0);
  const activeProfileReview =
    profileReviewQuotes[profileReviewIndex % profileReviewQuotes.length] ?? profileReviewQuotes[0];

  return (
    <>
      <Reveal>
        <section id="profile" className="section contact-panel-grid profile-grid">
          <InteractiveCard className="about-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.2} className="parallax-layer">
              <Paper
                variant="outlined"
                className="profile-review-card"
                sx={{ p: { xs: 2.2, md: 2.5 } }}
              >
                <Stack spacing={1.15}>
                  <Typography className="profile-review-quote" variant="h3">
                    &ldquo;{activeProfileReview.quote}&rdquo;
                  </Typography>
                  <div className="dynamic-divider" />
                  <Typography className="mini-label">{activeProfileReview.author}</Typography>
                  <Typography color="text.secondary">{activeProfileReview.context}</Typography>
                </Stack>
              </Paper>
              <Stack spacing={0.55}>
                {educationHighlights.map((line) => (
                  <Typography key={line} color="text.secondary">
                    {line}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          </InteractiveCard>

          <InteractiveCard
            className="hero-panel profile-gallery-panel"
            sx={{ p: 2, alignSelf: "flex-start", height: "auto", minHeight: 0 }}
          >
            <Stack spacing={2} className="parallax-layer">
              <Stack
                className="profile-gallery-meta"
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={1}
              >
                <Box>
                  <Typography className="panel-meta">
                    Bachelor of Computing (Honours) | Class of 2026
                  </Typography>
                </Box>
                <Chip label={site.location} variant="outlined" />
              </Stack>
              <RotatingPhotoGallery onIndexChange={setProfileReviewIndex} />
            </Stack>
          </InteractiveCard>
        </section>
      </Reveal>

      <VisitorStatsPanel />

      <Reveal rotate="left">
        <section id="timeline" className="section timeline-section--wide">
          <div className="section-heading">
            <span className="eyebrow">CV timeline</span>
            <TypedSectionTitle text="Timeline of work and extracurricular experience." />
          </div>
          <InteractiveCvTimeline />
        </section>
      </Reveal>

      <Reveal>
        <section className="section">
          <div className="section-heading">
            <span className="eyebrow">Technical focus</span>
            <TypedSectionTitle text="Types of work completed in internships." />
          </div>
          <Stack spacing={1.2} className="technical-focus-shell">
            <InteractiveCard className="technical-focus-intro" sx={{ p: { xs: 2.3, md: 2.8 } }}>
              <Stack spacing={1.3}>
                <Typography color="text.secondary">
                  Work spans implementation, reporting systems, and systems engineering support,
                  with each area tied to measurable delivery outcomes.
                </Typography>
                <div className="technical-focus-stat-grid">
                  {technicalHighlights.map((item) => (
                    <Paper
                      key={`${item.label}-${item.value}`}
                      variant="outlined"
                      className="technical-focus-stat"
                      sx={{ p: 1.5 }}
                    >
                      <Typography className="technical-focus-stat__value">{item.value}</Typography>
                      <Typography className="mini-label">{item.label}</Typography>
                      <Typography color="text.secondary">{item.detail}</Typography>
                    </Paper>
                  ))}
                </div>
              </Stack>
            </InteractiveCard>
            {principles.map((item, index) => (
              <Accordion
                key={item.title}
                className="technical-focus-accordion"
                disableGutters
                sx={{
                  bgcolor: "rgba(255,255,255,0.04)",
                  borderRadius: "22px !important",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <AccordionSummary
                  className="technical-focus-summary"
                  expandIcon={
                    <span className="technical-focus-expand-icon" aria-hidden="true">
                      <span className="technical-focus-expand-index">{index + 1}</span>
                      <span className="technical-focus-expand-chevron">v</span>
                    </span>
                  }
                >
                  <Stack spacing={0.75}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography color="text.secondary">{item.copy}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails className="technical-focus-details">
                  <div className="technical-focus-columns">
                    <div className="technical-focus-column">
                      <Typography className="mini-label">Representative deliverables</Typography>
                      <Stack spacing={0.6}>
                        {item.deliverables.map((entry) => (
                          <Typography key={entry} color="text.secondary">
                            - {entry}
                          </Typography>
                        ))}
                      </Stack>
                    </div>
                    <div className="technical-focus-column">
                      <Typography className="mini-label">Observed outcomes</Typography>
                      <Stack spacing={0.6}>
                        {item.outcomes.map((entry) => (
                          <Typography key={entry} color="text.secondary">
                            - {entry}
                          </Typography>
                        ))}
                      </Stack>
                    </div>
                  </div>
                  <div className="pill-cloud">
                    {item.tools.map((tool) => (
                      <Chip key={tool} label={tool} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                    ))}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </section>
      </Reveal>

      <Reveal rotate="left">
        <section id="skills" className="section">
          <div className="section-heading">
            <span className="eyebrow">Tech stack</span>
            <TypedSectionTitle text="Languages, platforms, and tools used in work terms." />
          </div>
          <InteractiveCard className="stack-panel stack-panel--expanded" sx={{ p: { xs: 2.3, md: 3 } }}>
            <Stack spacing={2}>
              <Tabs
                value={deferredTab}
                onChange={(_, value: string) => startTransition(() => setTab(value))}
                variant="scrollable"
                scrollButtons={false}
              >
                {Object.keys(stackGroups).map((group) => (
                  <Tab key={group} value={group} label={group} />
                ))}
              </Tabs>
              <Typography className="stack-panel__intro" color="text.secondary">
                {stackContext.intro}
              </Typography>
              <div className="pill-cloud">
                {(stackGroups[deferredTab] ?? []).map((item) => (
                  <Chip key={item} label={item} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ))}
              </div>
              <div className="stack-deep-grid">
                {stackContext.deepDive.map((item) => (
                  <Paper
                    key={item.title}
                    variant="outlined"
                    className="stack-deep-card"
                    sx={{ p: 1.5 }}
                  >
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography color="text.secondary">{item.detail}</Typography>
                  </Paper>
                ))}
              </div>
              <Paper variant="outlined" className="stack-note-strip" sx={{ p: 1.6 }}>
                <Typography className="mini-label">Engineering preferences</Typography>
                <Stack spacing={0.65} sx={{ mt: 1 }}>
                  {stackContext.emphasis.map((item) => (
                    <Typography
                      key={item}
                      className="stack-note-strip__item"
                      color="text.secondary"
                    >
                      - {item}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </InteractiveCard>
        </section>
      </Reveal>

      <Reveal>
        <section id="projects" className="section">
          <div className="section-heading">
            <span className="eyebrow">Projects</span>
            <TypedSectionTitle text="Selected live links and personal builds." />
          </div>
          <div className="experience-grid">
            {projects.map((item) => (
              <InteractiveCard key={item.title} className="mini-surface" sx={{ p: 2.4 }}>
                <Stack spacing={1.5}>
                  <Chip
                    label="Live project"
                    variant="outlined"
                    color="secondary"
                    sx={{ width: "fit-content" }}
                  />
                  <Typography variant="h5">{item.title}</Typography>
                  <Typography className="panel-meta">{item.meta}</Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                  <div className="pill-cloud">
                    {item.tags.map((tag) => (
                      <Chip key={tag} label={tag} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                    ))}
                  </div>
                  <Button
                    variant="contained"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ alignSelf: "flex-start" }}
                  >
                    {item.cta}
                  </Button>
                </Stack>
              </InteractiveCard>
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}
