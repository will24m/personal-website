const { useDeferredValue, useEffect, useMemo, useRef, useState, startTransition } = React;
const {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} = MaterialUI;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#f5f7fa" },
    secondary: { main: "#9aa3af" },
    background: { default: "transparent", paper: "rgba(18,20,25,0.78)" },
    text: { primary: "#f3f5f7", secondary: "#a5adb8" },
  },
  shape: { borderRadius: 24 },
  typography: {
    fontFamily: '"Sora", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
          paddingInline: 20,
          minHeight: 52,
        },
        containedPrimary: {
          color: "#0c0d10",
          background: "linear-gradient(135deg, #f5f7fa, #cdd3db)",
          boxShadow: "0 14px 30px rgba(0, 0, 0, 0.24)",
        },
        outlined: {
          borderColor: "rgba(255,255,255,0.14)",
          color: "#f3f5f7",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(18,20,25,0.78)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(18,20,25,0.78)",
          borderColor: "rgba(255,255,255,0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#f3f5f7",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(90deg, #f5f7fa, rgba(255,255,255,0.35))",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#8f98a5",
          textTransform: "none",
          "&.Mui-selected": {
            color: "#f3f5f7",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255,255,255,0.04)",
            borderRadius: 20,
          },
        },
      },
    },
  },
});

const site = {
  name: "Will Wu",
  email: "will@williamwu.ca",
  linkedin: "https://www.linkedin.com/in/will24m",
  github: "https://github.com/will24m",
  location: "Toronto, ON",
  school: "Queen's University Computer Science (Software Design Specialization)",
  currentRole: "Technical Program Management Intern at Lockheed Martin",
  nextRole: "Previous Lockheed roles: Software Engineering Intern and Systems Engineering Intern",
};

const navItems = [
  { href: "#profile", label: "Profile", key: "profile" },
  { href: "#timeline", label: "Timeline", key: "timeline" },
  { href: "#skills", label: "Skills", key: "skills" },
  { href: "#contact", label: "Contact", key: "contact" },
];

const experiences = [
  {
    id: "lockheed-tpm",
    label: "Lockheed Martin",
    title: "Technical Program Management Intern",
    timeframe: "2025-Present",
    summary: "Built scripts and reporting workflows for program tracking and delivery.",
    detail: "Pulled, cleaned, validated, and reported engineering metrics across Jira, Tableau, and Confluence.",
    bullets: [
      "Visualized 30+ KPIs (150+ parameters) across 20+ Jira and Tableau dashboards.",
      "Authored 20+ pages of Agile process documentation for large multi-team delivery.",
      "Communicated metrics and direction updates with senior management.",
    ],
    accent: "technical program management",
  },
  {
    id: "gac",
    label: "Global Affairs Canada",
    title: "Junior Software Engineer / Business Analyst",
    timeframe: "2024-2025",
    summary: "Built internal case-management apps and reporting systems for Global Affairs Canada.",
    detail: "Built 13 PowerApps/Azure DevOps applications and Power BI dashboards covering 50+ reporting metrics.",
    bullets: [
      "Automated DevOps environment variable generation with custom TypeScript.",
      "Refactored existing scripts to improve efficiency by up to 7200%.",
      "Elicited requirements with clients and iterated solutions to 100% satisfaction.",
    ],
    accent: "software engineering",
  },
  {
    id: "lockheed-se",
    label: "Lockheed Martin",
    title: "Software Engineering Intern",
    timeframe: "2024",
    summary: "Automated baseline and database workflows with DXL, C, and Python.",
    detail: "Built tools used by 50+ engineers to speed documentation and data-linking workflows.",
    bullets: [
      "Reduced baseline change workflow time from 2 hours to 10 minutes.",
      "Converted 1000+ relational objects into classified, customer-ready documentation.",
      "Automated linking across 3000+ database objects to save hours of manual work.",
    ],
    accent: "software automation",
  },
  {
    id: "lockheed-systems",
    label: "Lockheed Martin",
    title: "Systems Engineering Intern",
    timeframe: "2023",
    summary: "Supported model-based systems engineering and requirements workflows.",
    detail: "Built and iterated system models and artifacts with CAMEO, DOORS, Windchill, and senior engineering teams.",
    bullets: [
      "Designed intricate system data models for architecture and certification visualization.",
      "Iterated 50+ data artifacts tied to project milestones and requirement traceability.",
      "Updated 90+ classified design documents through requirements analysis and trade-study reviews.",
    ],
    accent: "mbse + requirements",
  },
];

const quickStats = [
  { value: 13, suffix: "", label: "custom apps built" },
  { value: 30, suffix: "+", label: "KPIs visualized" },
  { value: 7200, suffix: "%", label: "max efficiency improvement" },
  { value: 3000, suffix: "+", label: "objects auto-linked" },
];

const principles = [
  {
    title: "Software engineering work",
    copy: "Built applications, scripts, and deployment workflows using Python, TypeScript, JavaScript, C, and DXL.",
  },
  {
    title: "Data and reporting systems",
    copy: "Built Power BI, Tableau, and Jira dashboards, including KPI pipelines and reporting for engineering teams.",
  },
  {
    title: "Systems and requirements tooling",
    copy: "Worked in CAMEO, IBM DOORS/DXL, and PTC Windchill to model systems and maintain requirements traceability.",
  },
];

const stackGroups = {
  Languages: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "C++", "C", "DXL"],
  Platforms: ["React", "Django", "Power Apps", "Power BI", "Tableau", "Azure DevOps", "Docker", "Kubernetes"],
  Tools: ["Jira", "Confluence", "Dataverse", "IBM DOORS", "CAMEO", "PTC Windchill", "Postman", "PyTest"],
};

const cvTimelineEntries = [
  {
    id: "extra-quantt",
    type: "extracurricular",
    date: "Sep 2021-Aug 2023",
    org: "QUANTT",
    role: "Algorithm Team Software Developer",
    summary:
      "Developed and tested algorithmic trading strategies in Python, including simulation setup, model tuning, and performance evaluation.",
    bullets: [
      "Built Python-based trading logic in QuantConnect and iterated indicator selection and entry/exit rules.",
      "Ran backtests against historical datasets to evaluate risk-adjusted behavior and stability across market regimes.",
      "Improved strategy behavior through repeated tuning and validation, with average simulated return around 82%.",
    ],
  },
  {
    id: "extra-qsig-analyst",
    type: "extracurricular",
    date: "2022-2023",
    org: "Queen's Student Investors Group",
    role: "Senior Data Analyst",
    summary:
      "Led financial data modeling experiments, including feature engineering, alternative data collection, and predictive evaluation.",
    bullets: [
      "Built a Python classification model using Yahoo Finance market data with average prediction accuracy around 73%.",
      "Collected and cleaned data from 20+ news sources and 500,000+ tweets for NLP-based signal experiments.",
      "Prepared analysis outputs and model findings for investment-focused discussion and iteration.",
    ],
  },
  {
    id: "work-lockheed-systems",
    type: "work",
    date: "2023",
    org: "Lockheed Martin",
    role: "Systems Engineering Intern",
    summary:
      "Supported model-based systems engineering for defense platform development, including requirements decomposition, architecture modeling, and design package reviews.",
    bullets: [
      "Built and iterated SysML/UML models in CAMEO to represent subsystem behavior, interfaces, and certification workflows.",
      "Performed requirements analysis in IBM DOORS and validated alignment with baseline artifacts in PTC Windchill.",
      "Reviewed and updated 90+ classified engineering documents through trade-study and change-request workflows.",
      "Coordinated documentation status through Jira and Confluence so model and requirement updates stayed synchronized.",
    ],
  },
  {
    id: "extra-qsig-tech",
    type: "extracurricular",
    date: "May 2023-Aug 2023",
    org: "Queen's Student Investors Group",
    role: "Director of Technology",
    summary:
      "Owned technical infrastructure and reporting enablement for investment and market-report workflows.",
    bullets: [
      "Maintained and improved internal technical resources used by investment and reporting teams.",
      "Expanded access to structured reporting data so teams could build stronger market analyses and stock pitches.",
      "Oversaw usage standards and continuity of the group's technical reporting workflows.",
    ],
  },
  {
    id: "extra-qdaa-ai",
    type: "extracurricular",
    date: "May 2023-Apr 2024",
    org: "Queen's Data Analytics Association",
    role: "Director of Artificial Intelligence",
    summary:
      "Led AI-focused education initiatives, including curriculum design, workshop delivery, and technical support for project teams.",
    bullets: [
      "Designed and delivered NLP and applied-ML workshops for 50+ students with implementation-focused exercises.",
      "Built internal educational content covering supervised learning workflows and model development fundamentals.",
      "Supported project teams in scoping and applying AI approaches to real problem statements.",
    ],
  },
  {
    id: "work-lockheed-tpm-2023",
    type: "work",
    date: "2023-2024",
    org: "Lockheed Martin",
    role: "Technical Program Management Intern",
    summary:
      "Supported Agile program execution and delivery reporting for defense engineering teams.",
    bullets: [
      "Visualized 30+ KPIs (150+ parameters) across 20+ Jira and Tableau dashboards using Jira API data.",
      "Produced 20+ pages of Agile process documentation and tool guidance for engineering delivery teams.",
      "Refactored 50+ Jira program milestones and supported requirement-delivery tracking across 100+ design requirements.",
      "Led recurring Scrum-of-Scrums style coordination and built Jira queries for daily progression/risk analysis.",
    ],
  },
  {
    id: "work-lockheed-software",
    type: "work",
    date: "2024",
    org: "Lockheed Martin",
    role: "Software Engineering Intern",
    summary:
      "Built internal automation tooling for configuration management and engineering database workflows used by multiple teams.",
    bullets: [
      "Wrote DXL and C scripts used by 50+ engineers to execute design-baseline and version-control tasks.",
      "Reduced baseline change operations from approximately 2 hours to 10 minutes by automating manual workflow steps.",
      "Built Python tooling to transform relational database content into classified, customer-ready documentation.",
      "Automated attribute linking across 3000+ objects to improve consistency and remove repetitive manual maintenance.",
    ],
  },
  {
    id: "work-gac",
    type: "work",
    date: "2024-2025",
    org: "Global Affairs Canada",
    role: "Junior Software Engineer / Business Analyst",
    summary:
      "Owned end-to-end internal application delivery, including requirements gathering, implementation, reporting, and iterative process improvement.",
    bullets: [
      "Built and maintained 13 custom applications using Power Apps and Azure DevOps for case-management workflows.",
      "Elicited requirements from stakeholders, translated business rules into technical workflows, and iterated UI/process behavior.",
      "Built Power BI dashboards across 50+ metrics to provide operational visibility for embassy officials and leadership.",
      "Refactored scripts with efficiency gains up to 7200% and automated DevOps environment/config workflows with TypeScript.",
    ],
  },
  {
    id: "extra-smith-tech",
    type: "extracurricular",
    date: "May 2024-Apr 2025",
    org: "Smith Business and Technology",
    role: "Co-Chair",
    summary:
      "Co-led planning and operations for business/technology events, including team staffing, execution workflows, and stakeholder alignment.",
    bullets: [
      "Managed a 23-person organizing team responsible for planning and executing large student-facing events.",
      "Built execution plans and operating timelines for event logistics, communications, and delivery handoffs.",
      "Led partner communication and compliance coordination with institutional and regulatory stakeholders.",
    ],
  },
  {
    id: "extra-qhacks",
    type: "extracurricular",
    date: "May 2025-Present",
    org: "QHacks",
    role: "Co-Chair",
    summary:
      "Co-led planning and delivery for a large student hackathon, covering team management, budgeting, sponsorship, and execution systems.",
    bullets: [
      "Directed a 30+ person cross-functional organizing team across logistics, partnerships, marketing, and technology.",
      "Managed a $60K+ budget and coordinated sponsor relationships with major external partners.",
      "Defined operational workflows and documentation to improve event readiness and continuity between organizing cycles.",
    ],
  },
  {
    id: "extra-qcsa",
    type: "extracurricular",
    date: "May 2025-Present",
    org: "Queen's Computing Students Association",
    role: "Vice President of Student Affairs",
    summary:
      "Led student affairs operations, including representation, team management, program delivery, and internal process standardization.",
    bullets: [
      "Represented 2000+ students in faculty and board-level discussions on academic and community priorities.",
      "Managed a 50+ person team responsible for professional-development and community-focused initiatives.",
      "Implemented standardized onboarding/training workflows to improve retention and reduce ramp-up time for new team members.",
    ],
  },
  {
    id: "work-lockheed-tpm",
    type: "work",
    date: "2025-Present",
    org: "Lockheed Martin",
    role: "Technical Program Management Intern",
    summary:
      "Built program-metric scripting and leadership reporting for a large-scale defense program.",
    bullets: [
      "Created scripts to pull, clean, validate, and display program metrics for a multi-billion-dollar program.",
      "Built reporting outputs for leadership reviews and program-direction planning discussions.",
      "Communicated metric trends and execution risks with senior management and cross-functional teams.",
    ],
  },
];

const contactMethods = [
  {
    title: "Email",
    meta: site.email,
    href: `mailto:${site.email}`,
    description: "Best for technical opportunities and recruiting outreach.",
  },
  {
    title: "LinkedIn",
    meta: "@will24m",
    href: site.linkedin,
    description: "Best for background, roles, and networking.",
  },
  {
    title: "GitHub",
    meta: "will24m",
    href: site.github,
    description: "Best for code samples and projects.",
  },
];

const galleryPhotos = [
  { src: "images/headshot.jpg", alt: "Will Wu headshot" },
  { src: "images/sldc headshot.JPG", alt: "Will Wu formal headshot" },
  { src: "images/qhacks team photo.JPG", alt: "Will Wu with QHacks team" },
  { src: "images/principal reception.jpg", alt: "Will Wu at principal reception" },
  { src: "images/neuromech collect.jpg", alt: "Will Wu at Neuromech event" },
];

function useAmbientPointer() {
  useEffect(() => {
    const handleMove = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);
}

function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return now;
}

function useTorontoAvailability(now) {
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

    const isLive = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday) && hour >= 10 && hour < 18;
    return {
      dateLabel,
      timeLabel,
      isLive,
      statusLabel: isLive ? "Likely active right now" : "Likely replies next work block",
    };
  }, [now]);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const next = total > 0 ? window.scrollY / total : 0;
      setProgress(Math.min(1, Math.max(0, next)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(Boolean(entries[0]?.isIntersecting));
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Reveal({ children, rotate = "right" }) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className={`reveal-shell ${visible ? "is-visible" : ""} ${rotate === "left" ? "rotate-left" : "rotate-right"}`}
    >
      <div className="reveal-rotate">{children}</div>
    </div>
  );
}

function CountUp({ value, suffix = "" }) {
  const [ref, visible] = useInView(0.45);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    let frameId = 0;
    let startTime = 0;
    const duration = 1200;

    const tick = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [visible, value]);

  return (
    <Box ref={ref}>
      <Typography className="metric-value">
        {display}
        {suffix}
      </Typography>
    </Box>
  );
}

function RotatingWord({ words }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 2200);
    return () => window.clearInterval(interval);
  }, [words.length]);

  return (
    <span className="headline-rotator" aria-live="polite">
      {words.map((word, itemIndex) => (
        <span
          key={word}
          className={`headline-rotator__word ${itemIndex === index ? "is-active" : ""}`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

function InteractiveCard({ children, className = "", sx = {}, ...props }) {
  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = (0.5 - (y / rect.height)) * 12;
    event.currentTarget.style.setProperty("--tilt-y", `${rotateY}deg`);
    event.currentTarget.style.setProperty("--tilt-x", `${rotateX}deg`);
    event.currentTarget.style.setProperty("--lift-y", "-2px");
    event.currentTarget.style.setProperty("--card-mouse-x", `${x}px`);
    event.currentTarget.style.setProperty("--card-mouse-y", `${y}px`);
    event.currentTarget.style.setProperty("--layer-x", `${rotateY * 0.8}px`);
    event.currentTarget.style.setProperty("--layer-y", `${rotateX * -0.8}px`);
  };

  const reset = (event) => {
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--lift-y", "0px");
    event.currentTarget.style.setProperty("--layer-x", "0px");
    event.currentTarget.style.setProperty("--layer-y", "0px");
  };

  return (
    <Card
      className={`mouse-stage tilt-card ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      sx={{ overflow: "hidden", ...sx }}
      {...props}
    >
      {children}
    </Card>
  );
}

function ScrollProgressBar() {
  const progress = useScrollProgress();
  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />;
}

function RotatingPhotoGallery({ topChip, bottomChip, showSpotlight = false }) {
  const [index, setIndex] = useState(0);
  const activePhoto = galleryPhotos[index] || galleryPhotos[0];

  useEffect(() => {
    if (galleryPhotos.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % galleryPhotos.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Box className="portrait-frame portrait-frame--gallery">
      {showSpotlight ? <div className="hero-spotlight" /> : null}
      <img
        key={activePhoto.src}
        className="portrait-image portrait-image--rotating"
        src={activePhoto.src}
        alt={activePhoto.alt}
      />
      {topChip ? <span className="portrait-chip portrait-chip--top">{topChip}</span> : null}
      {bottomChip ? <span className="portrait-chip portrait-chip--bottom">{bottomChip}</span> : null}
      <div className="gallery-controls" role="tablist" aria-label="Photo gallery">
        {galleryPhotos.map((photo, itemIndex) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={itemIndex === index}
            aria-label={`Show photo ${itemIndex + 1}`}
            className={`gallery-dot ${itemIndex === index ? "is-active" : ""}`}
            onClick={() => setIndex(itemIndex)}
          />
        ))}
      </div>
    </Box>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Paper className="site-header__inner" elevation={0}>
        <a className="brand" href="#profile" aria-label="Go to profile section">
          <span className="brand__mark">WW</span>
          <span className="brand__copy">
            <span className="brand__name">{site.name}</span>
            <span className="brand__meta">TPM | software | systems</span>
          </span>
        </a>
        <button className="nav-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label="Toggle navigation">
          Menu
        </button>
        <nav className={`site-nav ${open ? "is-open" : ""}`} aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.key}
              className="nav-link"
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Paper>
    </header>
  );
}

function HeroPanel({ selectedId, onChange, onOpenDialog }) {
  const selected = experiences.find((item) => item.id === selectedId) || experiences[0];

  return (
    <InteractiveCard className="hero-panel" sx={{ p: 2 }}>
      <Box className="orbital-dots">
        <span />
        <span />
        <span />
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" className="parallax-layer">
        <Box>
          <Typography className="panel-title">Experience snapshot</Typography>
          <Typography className="panel-meta">Recent technical roles and outcomes</Typography>
        </Box>
        <Chip label="CV summary" color="secondary" variant="outlined" />
      </Stack>
      <RotatingPhotoGallery topChip="TPM intern" bottomChip="3x Lockheed intern" showSpotlight />
      <Box className="parallax-layer">
        <Tabs
          value={selectedId}
          onChange={(_, value) => startTransition(() => onChange(value))}
          variant="scrollable"
          scrollButtons={false}
        >
          {experiences.map((item) => (
            <Tab key={item.id} value={item.id} label={item.label} />
          ))}
        </Tabs>
      </Box>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: "22px", background: "rgba(255,255,255,0.04)" }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Typography variant="h6">{selected.title}</Typography>
            <Chip size="small" label={selected.accent} sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#f3f5f7" }} />
          </Stack>
          <Typography color="text.secondary">{selected.summary}</Typography>
          <div className="dynamic-divider" />
          <Typography color="text.secondary">{selected.detail}</Typography>
          <Button variant="contained" onClick={() => onOpenDialog(selected)} sx={{ alignSelf: "flex-start" }}>
            Highlights ->
          </Button>
        </Stack>
      </Paper>
    </InteractiveCard>
  );
}

function HomePage() {
  const [selectedId, setSelectedId] = useState(experiences[0].id);
  const [dialogItem, setDialogItem] = useState(null);
  const deferredId = useDeferredValue(selectedId);

  return (
    <>
      <Reveal>
        <section id="top" className="section hero-grid">
          <InteractiveCard className="hero-copy" sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={2.5} className="parallax-layer">
              <Chip label={`${site.currentRole} | ${site.nextRole}`} color="secondary" variant="outlined" sx={{ width: "fit-content" }} />
              <Typography className="hero-title" variant="h1">
                Technical experience across <RotatingWord words={["software", "systems", "analytics", "program delivery"]} />.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.85 }}>
                Completed internships in software engineering, systems engineering, and technical program management at Lockheed Martin, plus software delivery work at Global Affairs Canada.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1.2}>
                <Button variant="contained" href="#timeline">
                  Jump to timeline ->
                </Button>
                <Button variant="outlined" href="#profile">
                  Jump to profile
                </Button>
                <Button variant="outlined" href="#contact">
                  Jump to contact
                </Button>
              </Stack>
              <div className="pill-cloud">
                <Chip className="float-chip" label="Lockheed Martin" />
                <Chip className="float-chip" label="Global Affairs Canada" />
                <Chip className="float-chip" label="Dean's Honour List" />
              </div>
              <Typography className="mouse-hint">Use the cards below for detailed results.</Typography>
            </Stack>
          </InteractiveCard>
          <HeroPanel selectedId={deferredId} onChange={setSelectedId} onOpenDialog={setDialogItem} />
        </section>
      </Reveal>

      <Reveal rotate="left">
        <section className="section quick-stat-grid">
          {quickStats.map((item) => (
            <InteractiveCard key={item.label} className="mini-surface" sx={{ p: 2.2 }}>
              <CardContent sx={{ p: 0 }}>
                <Typography className="mini-label">{item.label}</Typography>
                <CountUp value={item.value} suffix={item.suffix} />
              </CardContent>
            </InteractiveCard>
          ))}
        </section>
      </Reveal>

      <Dialog open={Boolean(dialogItem)} onClose={() => setDialogItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogItem?.title}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography color="text.secondary">{dialogItem?.detail}</Typography>
            <Divider />
            {dialogItem?.bullets?.map((bullet) => (
              <Typography key={bullet} color="text.secondary">
                - {bullet}
              </Typography>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

function InteractiveCvTimeline() {
  const [selectedId, setSelectedId] = useState(cvTimelineEntries[0].id);
  const entries = cvTimelineEntries;

  const activeEntry = useMemo(
    () => entries.find((item) => item.id === selectedId) || entries[0],
    [entries, selectedId]
  );

  const railColor = "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.45), rgba(255,255,255,0.2))";
  const typeConfig = {
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

  return (
    <InteractiveCard className="cv-timeline-shell" sx={{ p: { xs: 2.2, md: 2.6 } }}>
      <Stack spacing={2}>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip
            size="small"
            label="Work"
            sx={{
              bgcolor: typeConfig.work.chipBg,
              border: `1px solid ${typeConfig.work.chipBorder}`,
              color: typeConfig.work.color,
            }}
          />
          <Chip
            size="small"
            label="Extracurricular"
            sx={{
              bgcolor: typeConfig.extracurricular.chipBg,
              border: `1px solid ${typeConfig.extracurricular.chipBorder}`,
              color: typeConfig.extracurricular.color,
            }}
          />
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
              style={{
                position: "absolute",
                left: "1.1rem",
                right: "1.1rem",
                top: "0.95rem",
                height: "2px",
                background: railColor,
                zIndex: 0,
              }}
            />
            {entries.map((item) => {
              const isActive = selectedId === item.id;
              const itemType = typeConfig[item.type] || typeConfig.extracurricular;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-expanded={isActive}
                  className={`cv-timeline-node ${isActive ? "is-active" : ""}`}
                  onClick={() => setSelectedId(item.id)}
                  style={{
                    position: "relative",
                    textAlign: "left",
                    width: "220px",
                    minHeight: "7.2rem",
                    padding: "1.75rem 0.9rem 0.95rem",
                    borderRadius: "16px",
                    border: isActive ? `1px solid ${itemType.chipBorder}` : "1px solid rgba(255,255,255,0.1)",
                    background: isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                    color: isActive ? "rgba(243,245,247,1)" : "rgba(165,173,184,1)",
                    flex: "0 0 auto",
                    zIndex: 1,
                    cursor: "pointer",
                    appearance: "none",
                    WebkitAppearance: "none",
                  }}
                >
                  <span
                    className="cv-timeline-node__dot"
                    style={{
                      position: "absolute",
                      top: "0.62rem",
                      left: "0.86rem",
                      width: "0.72rem",
                      height: "0.72rem",
                      borderRadius: "999px",
                      background: itemType.color,
                      border: "2px solid rgba(9,11,15,0.9)",
                      boxShadow: isActive ? "0 0 0 6px rgba(255,255,255,0.16)" : "0 0 0 4px rgba(255,255,255,0.08)",
                    }}
                  />
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
                  <span className="cv-timeline-node__date" style={{ display: "block", fontSize: "0.74rem", letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(125,133,145,1)" }}>
                    {item.date}
                  </span>
                  <span className="cv-timeline-node__org" style={{ display: "block", marginTop: "0.35rem", fontSize: "0.92rem", fontWeight: 600 }}>
                    {item.org}
                  </span>
                  <span className="cv-timeline-node__role" style={{ display: "block", marginTop: "0.32rem", fontSize: "0.8rem", color: "rgba(125,133,145,1)", lineHeight: 1.35 }}>
                    {item.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Paper key={activeEntry.id} className="cv-timeline-detail" variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={1.4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              <Box>
                <Typography variant="h6">{activeEntry.role}</Typography>
                <Typography className="panel-meta">{activeEntry.org}</Typography>
              </Box>
              <Stack direction="row" gap={0.8}>
                <Chip
                  size="small"
                  label={(typeConfig[activeEntry.type] || typeConfig.extracurricular).label}
                  sx={{
                    bgcolor: (typeConfig[activeEntry.type] || typeConfig.extracurricular).chipBg,
                    border: `1px solid ${(typeConfig[activeEntry.type] || typeConfig.extracurricular).chipBorder}`,
                    color: (typeConfig[activeEntry.type] || typeConfig.extracurricular).color,
                  }}
                />
                <Chip size="small" label={activeEntry.date} variant="outlined" />
              </Stack>
            </Stack>
            <Typography color="text.secondary">{activeEntry.summary}</Typography>
            <div className="dynamic-divider" />
            {activeEntry.bullets.map((bullet) => (
              <Typography key={bullet} color="text.secondary">
                - {bullet}
              </Typography>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </InteractiveCard>
  );
}

function AboutPage() {
  const [tab, setTab] = useState(Object.keys(stackGroups)[0]);
  const deferredTab = useDeferredValue(tab);

  return (
    <>
      <Reveal>
        <section id="profile" className="section contact-panel-grid">
          <InteractiveCard className="about-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.2} className="parallax-layer">
              <Chip label="Background" variant="outlined" color="secondary" sx={{ width: "fit-content" }} />
              <Typography className="section-title" variant="h2">
                Technical work completed across software, systems, and program roles.
              </Typography>
              <Typography color="text.secondary">
                Queen's University Computer Science (Software Design Specialization), graduating 2026. Dean's Honour List, GPA 3.8.
              </Typography>
              <div className="story-list">
                <div className="story-item">
                  <span className="story-step">1</span>
                  <div>
                    <strong>Three internships at Lockheed Martin.</strong>
                    <div className="card-copy">
                      Systems engineering, software engineering, and technical program management.
                    </div>
                  </div>
                </div>
                <div className="story-item">
                  <span className="story-step">2</span>
                  <div>
                    <strong>Hands-on delivery at Global Affairs Canada.</strong>
                    <div className="card-copy">
                      Built 13 custom apps, 50+ reporting metrics, and modernized deployment workflows.
                    </div>
                  </div>
                </div>
                <div className="story-item">
                  <span className="story-step">3</span>
                  <div>
                    <strong>Additional technical projects.</strong>
                    <div className="card-copy">
                      Additional project and data work in student organizations (QUANTT, QSIG, QDAA).
                    </div>
                  </div>
                </div>
              </div>
            </Stack>
          </InteractiveCard>

          <InteractiveCard className="hero-panel" sx={{ p: 2 }}>
            <Stack spacing={2} className="parallax-layer">
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography className="panel-title">Current and previous roles</Typography>
                  <Typography className="panel-meta">Queen's University | graduating 2026</Typography>
                </Box>
                <Chip label="Dean's Honour List" variant="outlined" />
              </Stack>
              <RotatingPhotoGallery
                topChip="3 Lockheed internships"
                bottomChip="Software + systems + TPM"
              />
              <Paper variant="outlined" sx={{ p: 2, borderRadius: "22px", background: "rgba(255,255,255,0.04)" }}>
                <Stack spacing={1.2}>
                  <Typography className="mini-label">Current role</Typography>
                  <Typography color="text.secondary">
                    {site.currentRole}. Previously held Lockheed internships in software engineering and systems engineering.
                  </Typography>
                  <div className="pill-cloud">
                    <Chip label="Python, C, DXL" />
                    <Chip label="Jira, Tableau, Confluence" />
                    <Chip label="CAMEO, DOORS, Windchill" />
                  </div>
                </Stack>
              </Paper>
            </Stack>
          </InteractiveCard>
        </section>
      </Reveal>

      <Reveal rotate="left">
        <section id="timeline" className="section">
          <div className="section-heading">
            <span className="eyebrow">CV timeline</span>
            <h2 className="section-title">Interactive timeline of work and extracurricular experience.</h2>
          </div>
          <InteractiveCvTimeline />
        </section>
      </Reveal>

      <Reveal rotate="left">
        <section className="section">
          <div className="section-heading">
            <span className="eyebrow">Technical focus</span>
            <h2 className="section-title">Types of work completed in internships.</h2>
          </div>
          <Stack spacing={1.1}>
            {principles.map((item, index) => (
              <Accordion key={item.title} disableGutters sx={{ bgcolor: "rgba(255,255,255,0.04)", borderRadius: "22px !important", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                <AccordionSummary expandIcon={<span>{index + 1}</span>}>
                  <Typography variant="h6">{item.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{item.copy}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </section>
      </Reveal>

      <Reveal>
        <section id="skills" className="section">
          <div className="section-heading">
            <span className="eyebrow">Tech stack</span>
            <h2 className="section-title">Languages, platforms, and tools used in work terms.</h2>
          </div>
          <InteractiveCard className="stack-panel" sx={{ p: 2.3 }}>
            <Tabs value={deferredTab} onChange={(_, value) => startTransition(() => setTab(value))} variant="scrollable" scrollButtons={false}>
              {Object.keys(stackGroups).map((group) => (
                <Tab key={group} value={group} label={group} />
              ))}
            </Tabs>
            <div className="pill-cloud">
              {stackGroups[deferredTab].map((item) => (
                <Chip key={item} label={item} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
              ))}
            </div>
          </InteractiveCard>
        </section>
      </Reveal>
    </>
  );
}

function ContactFormCard() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Software opportunity",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState("Share role, team, and technical scope for a faster reply.");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "A name helps.";
    if (!form.email.trim()) {
      nextErrors.email = "An email is needed.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "That email format looks off.";
    }
    if (!form.message.trim() || form.message.trim().length < 14) {
      nextErrors.message = "Please add a bit more detail.";
    }

      setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setNote("Please fix the highlighted fields.");
      return;
    }

    const subject = `${form.topic} inquiry from ${form.name}`;
    const body = [
      "Hi Will,",
      "",
      form.message,
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Topic: ${form.topic}`,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote("Your email app should open a draft. If needed, email me directly.");
  };

  return (
    <InteractiveCard className="contact-form-card" sx={{ p: { xs: 3, md: 4 } }}>
      <Stack spacing={2.2}>
        <Box>
          <Chip label="Start the conversation" variant="outlined" color="secondary" sx={{ mb: 1.5 }} />
          <Typography variant="h4" sx={{ fontFamily: '"Fraunces", serif' }}>
            Open a prefilled email draft.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={1.4}>
            <div className="form-grid">
              <TextField label="Name" name="name" value={form.name} onChange={handleChange} error={Boolean(errors.name)} helperText={errors.name || " "} />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={Boolean(errors.email)} helperText={errors.email || " "} />
            </div>
            <TextField
              select
              label="What are you reaching out about?"
              name="topic"
              value={form.topic}
              onChange={handleChange}
              SelectProps={{ native: true }}
            >
              {[
                "Software opportunity",
                "Software engineering role",
                "Systems engineering role",
                "Technical program management role",
                "Technical project or collaboration",
                "General intro",
              ].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </TextField>
            <TextField
              label="What would you like to discuss?"
              name="message"
              multiline
              minRows={5}
              value={form.message}
              onChange={handleChange}
              error={Boolean(errors.message)}
              helperText={errors.message || "Share role, team, or project."}
            />
            <Stack direction="row" flexWrap="wrap" gap={1.2}>
              <Button variant="contained" type="submit">
                Create draft ->
              </Button>
              <Button variant="outlined" href={`mailto:${site.email}`}>
                Email directly
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: "18px", bgcolor: "rgba(255,255,255,0.04)" }}>
          <Typography color="text.secondary">{note}</Typography>
        </Paper>
      </Stack>
    </InteractiveCard>
  );
}

function AvailabilityCard() {
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

function ContactPage() {
  return (
    <>
      <Reveal>
        <section id="contact" className="section contact-panel-grid">
          <InteractiveCard className="contact-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.2} className="parallax-layer">
              <Chip label="Contact" variant="outlined" color="secondary" sx={{ width: "fit-content" }} />
              <Typography className="section-title" variant="h2">
                Open to software engineering and technical program roles.
              </Typography>
              <Typography color="text.secondary">
                Experience includes Lockheed Martin internships in TPM, software engineering, and systems engineering, plus application development at Global Affairs Canada.
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
            <h2 className="section-title">Contact channels.</h2>
          </div>
          <div className="experience-grid">
            {contactMethods.map((item) => (
              <InteractiveCard key={item.title} className="mini-surface" sx={{ p: 2.2 }}>
                <CardContent sx={{ p: 0 }}>
                  <Stack spacing={1.3}>
                    <Avatar sx={{ bgcolor: item.title === "GitHub" ? "secondary.main" : "rgba(255,255,255,0.82)", color: "#0c0d10", width: 42, height: 42 }}>
                      {item.title.slice(0, 1)}
                    </Avatar>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography className="panel-meta">{item.meta}</Typography>
                    <Typography color="text.secondary">{item.description}</Typography>
                    <Button variant="text" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} sx={{ alignSelf: "flex-start", px: 0 }}>
                      Open ->
                      
                    </Button>
                  </Stack>
                </CardContent>
              </InteractiveCard>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal rotate="left">
        <section className="section contact-panel-grid">
          <ContactFormCard />
          <InteractiveCard className="contact-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2}>
              <Chip label="What helps most" variant="outlined" color="secondary" sx={{ width: "fit-content" }} />
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

function Footer() {
  const now = useClock();
  const availability = useTorontoAvailability(now);

  return (
    <footer className="site-footer">
      <Paper className="site-footer__inner" elevation={0}>
        <Typography className="footer-copy">
          Queen's CS (Software Design Specialization), Dean's Honour List (GPA 3.8). Experience across software engineering, systems engineering, and technical program management. Toronto time: {availability.timeLabel}.
        </Typography>
        <div className="footer-links">
          <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </Paper>
    </footer>
  );
}

function App() {
  useAmbientPointer();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="site-root mui-shell">
        <ScrollProgressBar />
        <span className="ambient-orb ambient-orb--a" />
        <span className="ambient-orb ambient-orb--b" />
        <span className="ambient-orb ambient-orb--c" />
        <Header />
        <main className="page page--single">
          <AboutPage />
          <ContactPage />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("app");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
