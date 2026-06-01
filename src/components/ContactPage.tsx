import { Avatar, Button, CardContent, Chip, Stack, Typography } from "@mui/material";
import { contactMethods } from "../data/content.js";
import { InteractiveCard } from "./InteractiveCard.js";
import { Reveal } from "./Reveal.js";
import { TypedSectionTitle } from "./TypedSectionTitle.js";
import { ContactFormCard } from "./ContactFormCard.js";
import { AvailabilityCard } from "./AvailabilityCard.js";

export function ContactPage() {
  return (
    <>
      <Reveal>
        <section id="contact" className="section contact-panel-grid">
          <InteractiveCard className="contact-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.2} className="parallax-layer">
              <Chip label="Contact" variant="outlined" color="secondary" sx={{ width: "fit-content" }} />
              <TypedSectionTitle
                text="Open to software engineering and technical program roles."
                variant="h2"
              />
              <Typography color="text.secondary">
                Experience includes Lockheed Martin internships in TPM, software engineering, and
                systems engineering, plus application development at Global Affairs Canada.
              </Typography>
              <div className="pill-cloud">
                <Chip label="Software engineering" />
                <Chip label="Systems engineering" />
                <Chip label="Technical program management" />
              </div>
            </Stack>
          </InteractiveCard>
          <AvailabilityCard />
        </section>
      </Reveal>

      <Reveal rotate="left">
        <section className="section">
          <div className="section-heading">
            <span className="eyebrow">Reach out</span>
            <TypedSectionTitle text="Contact channels." />
          </div>
          <div className="experience-grid">
            {contactMethods.map((item) => (
              <InteractiveCard key={item.title} className="mini-surface" sx={{ p: 2.2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Stack spacing={1.3}>
                    <Avatar
                      sx={{
                        bgcolor:
                          item.title === "GitHub"
                            ? "secondary.main"
                            : "rgba(255,255,255,0.82)",
                        color: "#0c0d10",
                        width: 42,
                        height: 42,
                      }}
                    >
                      {item.title.slice(0, 1)}
                    </Avatar>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography className="panel-meta">{item.meta}</Typography>
                    <Typography color="text.secondary">{item.description}</Typography>
                    <Button
                      variant="text"
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      sx={{ alignSelf: "flex-start", px: 0 }}
                    >
                      Open -&gt;
                    </Button>
                  </Stack>
                </CardContent>
              </InteractiveCard>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section contact-panel-grid">
          <ContactFormCard />
          <InteractiveCard className="contact-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2}>
              <Chip
                label="What helps most"
                variant="outlined"
                color="secondary"
                sx={{ width: "fit-content" }}
              />
              <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif' }}>
                Include technical context.
              </Typography>
              <Typography color="text.secondary">
                Share the role, team, and technical area so I can respond with relevant details.
              </Typography>
              <div className="story-list">
                <div className="story-item">
                  <span className="story-step">A</span>
                  <div>
                    <strong>Role or opportunity</strong>
                    <div className="card-copy">Software, recruiting, collaboration, or leadership.</div>
                  </div>
                </div>
                <div className="story-item">
                  <span className="story-step">B</span>
                  <div>
                    <strong>Team or problem space</strong>
                    <div className="card-copy">Domain, product area, or organization.</div>
                  </div>
                </div>
                <div className="story-item">
                  <span className="story-step">C</span>
                  <div>
                    <strong>Timeline or next step</strong>
                    <div className="card-copy">Chat, role share, or project discussion.</div>
                  </div>
                </div>
              </div>
            </Stack>
          </InteractiveCard>
        </section>
      </Reveal>
    </>
  );
}
