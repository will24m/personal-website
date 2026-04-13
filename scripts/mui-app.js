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
  CssBaseline,
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
  currentRole: "Technical Program Management Intern, Lockheed Martin",
  nextRole: "Previous internships at Lockheed Martin: Software Engineering and Systems Engineering.",
};

const navItems = [
  { href: "#profile", label: "Profile", key: "profile" },
  { href: "#timeline", label: "Timeline", key: "timeline" },
  { href: "#skills", label: "Skills", key: "skills" },
  { href: "#contact", label: "Contact", key: "contact" },
];

const profileReviewQuotes = [
  {
    quote:
      "Will consistently translated unclear asks into actionable plans. He shipped updates quickly without dropping detail.",
    author: "Technical Manager",
    context: "Program delivery review",
  },
  {
    quote:
      "As a co-chair, he kept meetings focused, made decisions fast, and followed through on operational details.",
    author: "Fellow Co-Chair",
    context: "Student leadership cycle",
  },
  {
    quote:
      "He was the person we asked when a process was blocking progress. Most issues were resolved in one pass.",
    author: "Engineering Teammate",
    context: "Systems and software workflow",
  },
  {
    quote:
      "His dashboards were clear enough for technical and non-technical stakeholders to use without extra explanation.",
    author: "Program Stakeholder",
    context: "Reporting and KPI reviews",
  },
  {
    quote:
      "He documented decisions well, which made handoffs easier and reduced rework across teams.",
    author: "Project Lead",
    context: "Cross-team collaboration",
  },
  {
    quote:
      "Strong ownership: if something slipped, he communicated early and offered practical recovery options.",
    author: "Team Manager",
    context: "Execution and reliability",
  },
];

const principles = [
  {
    title: "Software engineering work",
    copy: "Built full internal software solutions from requirements to deployed workflow, including frontend implementation, backend logic, scripting automation, and release support.",
    deliverables: [
      "Built and maintained internal apps for case-management and engineering process workflows.",
      "Designed reusable scripts for data transformation, validation, and report generation.",
      "Integrated automation into delivery pipelines to reduce repetitive manual work.",
    ],
    outcomes: [
      "Reduced baseline-change operations from ~2 hours to ~10 minutes through automation.",
      "Built applications and scripts used by cross-functional engineering and operations teams.",
      "Improved day-to-day reliability by replacing brittle manual steps with repeatable tooling.",
    ],
    tools: ["Python", "TypeScript", "JavaScript", "C", "DXL", "Power Apps", "Azure DevOps"],
  },
  {
    title: "Data and reporting systems",
    copy: "Designed KPI pipelines and reporting surfaces that helped teams understand delivery health, execution risk, and operational trends at a glance.",
    deliverables: [
      "Built dashboard ecosystems spanning Jira, Tableau, and Power BI across dozens of KPIs.",
      "Created scripted data-cleaning and validation layers before publishing metrics.",
      "Structured metric definitions so stakeholders interpreted dashboards consistently.",
    ],
    outcomes: [
      "Enabled leadership reporting and recurring execution reviews with reliable metrics.",
      "Improved traceability between source systems, dashboard views, and decision-making.",
      "Reduced time spent collecting and reconciling status updates across teams.",
    ],
    tools: ["Jira API", "Tableau", "Power BI", "Python", "SQL", "Confluence"],
  },
  {
    title: "Systems and requirements tooling",
    copy: "Supported model-based and requirements-driven engineering workflows with strong emphasis on traceability, design consistency, and documentation quality.",
    deliverables: [
      "Built and iterated SysML/UML models for subsystem behavior, interfaces, and certification paths.",
      "Validated requirements in IBM DOORS and maintained alignment with Windchill artifacts.",
      "Reviewed and updated engineering documents based on requirement and design changes.",
    ],
    outcomes: [
      "Strengthened requirement-to-design traceability across milestone-driven workflows.",
      "Improved consistency between architecture models, artifacts, and delivery documents.",
      "Helped teams move faster through review cycles with clearer technical baselines.",
    ],
    tools: ["CAMEO", "IBM DOORS", "DXL", "PTC Windchill", "Jira", "Confluence"],
  },
];

const technicalHighlights = [
  {
    value: "3",
    label: "internship tracks",
    detail: "Software engineering, systems engineering, and technical program management.",
  },
  {
    value: "50+",
    label: "engineers enabled",
    detail: "Internal automation and tooling used directly by engineering teams.",
  },
  {
    value: "30+",
    label: "KPIs visualized",
    detail: "Operational metrics surfaced in dashboard and reporting workflows.",
  },
  {
    value: "3000+",
    label: "objects linked",
    detail: "Automated consistency and traceability across large structured datasets.",
  },
];

const stackGroups = {
  Languages: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "C++", "C", "DXL"],
  Platforms: ["React", "Django", "Power Apps", "Power BI", "Tableau", "Azure DevOps", "Docker", "Kubernetes"],
  Tools: ["Jira", "Confluence", "Dataverse", "IBM DOORS", "CAMEO", "PTC Windchill", "Postman", "PyTest"],
};

const stackNarratives = {
  Languages: {
    intro:
      "Languages were selected based on delivery constraints: scripting speed for automation, typed reliability for maintainability, and lower-level control for engineering tooling.",
    deepDive: [
      {
        title: "Automation and scripting",
        detail: "Python and TypeScript for data-cleaning scripts, report generation, and workflow tooling.",
      },
      {
        title: "Frontend and app logic",
        detail: "JavaScript and TypeScript for internal app behavior, UI interactions, and deployment-ready features.",
      },
      {
        title: "Engineering tooling",
        detail: "C and DXL for systems-oriented utilities and specialized engineering database operations.",
      },
      {
        title: "Data and querying",
        detail: "SQL for metrics extraction, transformation support, and structured reporting pipelines.",
      },
    ],
    emphasis: [
      "Readable, maintainable code over one-off scripts.",
      "Strong validation and error handling for production-like internal tools.",
      "Clear interfaces between data, logic, and presentation layers.",
    ],
  },
  Platforms: {
    intro:
      "Platform choices reflected organizational reality: enterprise systems for adoption, modern frameworks for flexibility, and dashboard tools for stakeholder communication.",
    deepDive: [
      {
        title: "Application delivery",
        detail: "Power Apps and React used to rapidly ship internal tools with practical UI workflows.",
      },
      {
        title: "Data visualization",
        detail: "Power BI and Tableau for KPI tracking, status reporting, and trend visibility across teams.",
      },
      {
        title: "Engineering ops",
        detail: "Azure DevOps for workflow orchestration, environment management, and delivery support.",
      },
      {
        title: "Containerized workflows",
        detail: "Docker and Kubernetes familiarity for deployment-oriented thinking and scalable architecture context.",
      },
    ],
    emphasis: [
      "Ship usable internal tools quickly without sacrificing structure.",
      "Build dashboards that non-technical stakeholders can act on.",
      "Support repeatable delivery through documented platform workflows.",
    ],
  },
  Tools: {
    intro:
      "Tooling experience centered on traceability, collaboration, and lifecycle reliability, especially in environments where requirements, documentation, and delivery status must stay synchronized.",
    deepDive: [
      {
        title: "Program coordination",
        detail: "Jira and Confluence for backlog hygiene, milestone tracking, and team communication rhythms.",
      },
      {
        title: "Systems traceability",
        detail: "IBM DOORS and CAMEO for requirements integrity, model linkage, and architecture visibility.",
      },
      {
        title: "Configuration control",
        detail: "PTC Windchill to maintain consistency between evolving artifacts and approved baselines.",
      },
      {
        title: "Validation workflow",
        detail: "Postman and PyTest for endpoint checks, regression confidence, and automation reliability.",
      },
    ],
    emphasis: [
      "Preserve requirement-to-delivery traceability as systems evolve.",
      "Make collaboration artifacts clear enough for cross-functional teams.",
      "Use tooling standards that scale across multiple contributors.",
    ],
  },
};

const professionalExperienceFull = [
  {
    organization: "Lockheed Martin",
    role: "Technical Program Management Intern",
    location: "Ottawa, ON, Canada",
    timeframe: "Jan 2025-Apr 2026",
    bullets: [
      "Created scripts to pull, clean, validate, and display program metrics for a $XXX,000,000,000 program.",
      "Communicated with senior management on program direction and execution priorities.",
    ],
  },
  {
    organization: "Global Affairs Canada",
    role: "Junior Software Engineer / Business Analyst",
    location: "Ottawa, ON, Canada",
    timeframe: "Sep 2024-Aug 2025",
    bullets: [
      "Built 13 custom self-contained applications using PowerApps and Azure DevOps to revamp case-management processes.",
      "Created dynamic dashboards for custom applications using Power BI, covering 50+ metrics for embassy officials and leadership.",
      "Upgraded DevOps cloud pipeline infrastructure using custom TypeScript to automate environment variable generation.",
      "Elicited requirements from clients to gather feedback, assess capabilities, and iteratively improve software projects.",
      "Elicited requirements from clients and developed business process, business rules, and UI behavior.",
      "Designed system architecture, optimizing decisions to meet system and requirement constraints.",
      "Optimized and refactored scripts, improving efficiency by up to 7200%.",
      "Mentored incoming interns, consultants, and testers as a primary source of support.",
      "Developed reusable components used as templates and standalone apps.",
      "Managed data migration, database administration tasks, deployment pipelines, and Power BI reporting.",
      "Worked across MS Power Platform (Power Apps, Dataverse, Power BI, Power Pages, Power Automate) and JavaScript.",
    ],
  },
  {
    organization: "Lockheed Martin",
    role: "Software Engineering Intern",
    location: "Ottawa, ON, Canada",
    timeframe: "May 2024-Aug 2024",
    bullets: [
      "Wrote 4 original scripts using DXL and C for version control management during a military vehicle design phase.",
      "Delivered tools used by 50+ engineers, reducing baseline-change time from roughly 2 hours to 10 minutes.",
      "Converted 1000+ relational database objects into classified Excel documentation via a Python formatting workflow.",
      "Improved database architecture for 3000+ objects by automating attribute linking and reducing manual effort.",
    ],
  },
  {
    organization: "Lockheed Martin",
    role: "Technical Program Management Intern",
    location: "Ottawa, ON, Canada",
    timeframe: "Sep 2023-Apr 2024",
    bullets: [
      "Visualized 30+ weapon-program KPIs (150+ parameters) across 20+ Tableau and Jira dashboards.",
      "Developed 20+ pages of Agile documentation on Confluence for engineers on a 12-figure defense program.",
      "Refactored 50+ Jira program milestones while supporting 100+ design requirements.",
      "Authored Agile tools/process documentation and supported 200+ engineers by streamlining information channels.",
      "Coached engineering and non-engineering teams on Agile Scrum practices and resolved process conflicts.",
      "Constructed Jira queries daily for ticket progression metrics and statistical assessment.",
      "Led Scrum-of-Scrums and Agile Release Train meetings to track progress and align teams.",
    ],
  },
  {
    organization: "Lockheed Martin",
    role: "Systems Engineering Intern",
    location: "Ottawa, ON, Canada",
    timeframe: "Jan 2023-Aug 2023",
    bullets: [
      "Designed intricate system data models in CAMEO (UML/SysML) for architecture and certification visualization.",
      "Iterated 50+ data artifacts with senior engineers using PTC Windchill and IBM DOORS.",
      "Developed 10+ layered data models for integrated military-vehicle systems in CAMEO.",
      "Conducted qualitative engineering reviews across appraisal documents, ECRs, procurement packages, and design specs.",
      "Collaborated with senior engineers using Jira/Confluence, PTC Windchill, and IBM DOORS.",
      "Updated 90+ classified design documents for Canadian Surface Combatant R&D through requirements analysis and trade-study review.",
    ],
  },
  {
    organization: "En Ville",
    role: "Storefront Supervisor",
    location: "Toronto, ON, Canada",
    timeframe: "Summer 2022",
    summary:
      "En Ville (est. 1982) is a high-end catering company in Toronto.",
    bullets: [
      "Oversaw daily direct-to-consumer storefront operations serving 80-100 customers per day during peak months.",
      "Boosted weekly sales by about 25% over three months through product layout and upselling improvements.",
      "Increased customer return rate by roughly 30% by collecting feedback, offering samples, and refining product mix.",
      "Trained 3 new part-time staff and created simple SOPs for service consistency and faster onboarding.",
      "Managed restocking and inventory for 100+ SKUs to minimize shortages and improve freshness.",
      "Handled customer issues professionally, resolving 20+ escalations with positive follow-up outcomes.",
    ],
  },
  {
    organization: "Global Amusement Consulting (GAC)",
    role: "Sales Associate",
    location: "Vaughan, ON, Canada",
    timeframe: "Summer 2021",
    summary:
      "GAC operates games and attractions in amusement parks including Canada's Wonderland.",
    bullets: [
      "Learned and demonstrated a difficult carnival rope-ladder activity for customers on a daily basis.",
      "Maintained strong technical knowledge of game requirements and explained rules to prospective customers.",
      "Engaged large daily crowds consistently and supported sales generation through active outreach.",
    ],
  },
];

const extracurricularExperienceFull = [
  {
    organization: "QHacks",
    role: "Co-Chair",
    location: "Kingston, ON",
    timeframe: "May 2025-Present",
    bullets: [
      "Directed a 30+ person organizing team to plan and execute a large student-run hackathon with 800+ applicants.",
      "Oversaw a $60K+ budget and secured sponsorships including Shopify, RBC, and Microsoft.",
      "Introduced a hybrid event model and redesigned onboarding, improving participant satisfaction.",
      "Led cross-functional collaboration across tech, logistics, marketing, and partnerships.",
      "Expanded equity-focused outreach and accessibility initiatives to increase first-time and underrepresented participants.",
      "Established documentation and scalable systems for continuity across organizing cycles.",
    ],
  },
  {
    organization: "Queen's Computing Students Association",
    role: "Vice President of Student Affairs",
    location: "Kingston, ON",
    timeframe: "May 2025-Present",
    bullets: [
      "Represented 2000+ students in discussions with undergraduate board, arts and sciences board, and faculty.",
      "Managed a 50+ person team delivering 15+ professional development and community events.",
      "Advocated for and secured a $12,000 annual increase in student funding.",
      "Designed and implemented a standardized training system to improve retention and reduce onboarding time.",
      "Led faculty-wide survey campaigns with 700+ responses that informed course and mental health service changes.",
    ],
  },
  {
    organization: "Smith Business and Technology",
    role: "Co-Chair",
    location: "Kingston, ON",
    timeframe: "May 2024-Apr 2025",
    bullets: [
      "Managed planning for two large student events focused on business and technology with 200+ attendees.",
      "Hired and led a team of 23 students in preparation for 5+ events during the academic year.",
      "Led correspondence with Smith Commerce Society to ensure compliance with regulatory boards.",
    ],
  },
  {
    organization: "Queen's Conference on Business and Technology",
    role: "Logistics Director",
    location: "Kingston, ON",
    timeframe: "May 2023-Apr 2024",
    bullets: [
      "Directed a 5-person team for scheduling, budgeting, and coordination across 4 events totaling 300+ attendees.",
      "Led correspondence with 10+ external stakeholders, vendors, and student organizations.",
      "Implemented logistics timelines and coordinated with cross-functional teams and vendors.",
      "Managed the club's financial portfolio and served as head treasurer.",
      "Negotiated with venues and sponsors months ahead of events.",
      "Conducted post-event evaluations and implemented improvements for future conferences.",
    ],
  },
  {
    organization: "Queen's Data Analytics Association",
    role: "Director of Artificial Intelligence",
    location: "Kingston, ON",
    timeframe: "May 2023-Apr 2024",
    bullets: [
      "Delivered 3 NLP workshops and supported 50+ students with hands-on AI implementation.",
      "Led partnership communication for AI education opportunities including panels, talks, and workshops.",
      "Founded QDAA's AI division to focus on the intersection of data analytics and AI.",
      "Hired senior and junior AI consultants for internal content and project-team support.",
      "Consulted external clients on AI solutions to real business problems.",
    ],
  },
  {
    organization: "Queen's Student Investors Group",
    role: "Director of Technology",
    location: "Kingston, ON",
    timeframe: "May 2023-Aug 2023",
    bullets: [
      "Directed usage of proprietary QSIG financial reporting technology for investment and market-report teams.",
      "Increased quantity of information available to investment teams by 200%.",
      "Directed and maintained QSIG's independent website.",
    ],
  },
  {
    organization: "Queen's Student Investors Group",
    role: "Senior Data Analyst",
    location: "Kingston, ON",
    timeframe: "2022-2023",
    bullets: [
      "Developed a Python security-classification model using Yahoo Finance API with average accuracy around 73%.",
      "Programmed a reinforcement-learning model with LSTM components using PyTorch, TensorFlow, and Colab.",
      "Scraped 20+ news sites and 500,000+ tweets for NLP data pipelines.",
    ],
  },
  {
    organization: "Queen's Business Brigades",
    role: "Senior Advisor",
    location: "Kingston, ON",
    timeframe: "Sep 2023-Dec 2023",
    summary:
      "QBB is a financial/economic consulting chapter of Global Brigades.",
    bullets: [
      "Advised incoming directors on strategies used for the inaugural case competition.",
      "Maintained the professional development of QBB's website (qubusinessbrigades.com).",
      "Provided ongoing support for club activities during the 2023-24 season.",
    ],
  },
  {
    organization: "Queen's Business Brigades",
    role: "Co-Director of Education",
    location: "Kingston, ON",
    timeframe: "Sep 2022-May 2023",
    bullets: [
      "Led development of QBB's first intercollegiate business case competition.",
      "Directed development of QBB's independent website (qubusinessbrigades.com).",
      "Acted as liaison for partner organizations including McMaster Business Brigades and Queen's Web Development Club.",
    ],
  },
  {
    organization: "QUANTT",
    role: "Algorithm Team Software Developer",
    location: "Kingston, ON",
    timeframe: "Sep 2021-Aug 2023",
    summary:
      "QUANTT is a student-run club focused on quantitative finance and algorithmic trading.",
    bullets: [
      "Developed a Python trading algorithm in QuantConnect using indicator-based strategies.",
      "Tested and improved model performance through backtesting against historical market data.",
      "Built inverse trading strategies across oil and renewable energy equities for stable positive returns.",
    ],
  },
];

function toTimelineEntry(entry, type, index) {
  const fallbackSummary = entry.bullets?.[0] || `${entry.organization} | ${entry.location}`;
  const rawId = `${type}-${index}-${entry.organization}-${entry.role}-${entry.timeframe}`;
  const normalizedId = rawId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return {
    id: normalizedId,
    type,
    date: entry.timeframe,
    org: entry.organization,
    role: entry.role,
    summary: entry.summary || fallbackSummary,
    bullets: entry.bullets || [],
  };
}

function parseTimelineStart(dateLabel) {
  if (!dateLabel) {
    return Number.POSITIVE_INFINITY;
  }

  const text = String(dateLabel);
  const monthMap = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const yearMatch = text.match(/\b(19|20)\d{2}\b/);
  if (!yearMatch) {
    return Number.POSITIVE_INFINITY;
  }

  const year = Number(yearMatch[0]);
  const monthMatch = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);

  let month = 0;
  if (monthMatch) {
    month = monthMap[monthMatch[0].slice(0, 3).toLowerCase()] ?? 0;
  } else if (/\bSummer\b/i.test(text)) {
    month = 5;
  } else if (/\bFall|Autumn\b/i.test(text)) {
    month = 8;
  } else if (/\bSpring\b/i.test(text)) {
    month = 2;
  } else if (/\bWinter\b/i.test(text)) {
    month = 0;
  }

  return year * 12 + month;
}

const cvTimelineEntriesRaw = [
  ...professionalExperienceFull.map((entry, index) => toTimelineEntry(entry, "work", index)),
  ...extracurricularExperienceFull.map((entry, index) => toTimelineEntry(entry, "extracurricular", index)),
];

const cvTimelineEntries = cvTimelineEntriesRaw
  .map((entry, index) => ({ entry, index }))
  .sort((left, right) => {
    const startDiff = parseTimelineStart(left.entry.date) - parseTimelineStart(right.entry.date);
    return startDiff !== 0 ? startDiff : left.index - right.index;
  })
  .map(({ entry }) => entry);

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

const galleryImagePattern = /\.(avif|bmp|gif|jpe?g|png|webp)$/i;

function filenameToAlt(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  const normalized = base.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Gallery photo";
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function buildGalleryPhotosFromNames(photoNames) {
  const uniqueNames = [...new Set(photoNames)]
    .filter((name) => galleryImagePattern.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  return uniqueNames.map((name) => ({
    src: encodeURI(`images/${name}`),
    alt: filenameToAlt(name),
  }));
}

function buildGalleryPhotosFromIndex(indexHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(indexHtml, "text/html");
  const photoNames = Array.from(doc.querySelectorAll("a[href]"))
    .map((anchor) => anchor.getAttribute("href") || "")
    .map((href) => href.split("#")[0].split("?")[0])
    .filter(Boolean)
    .map((href) => {
      try {
        return decodeURIComponent(href);
      } catch (_error) {
        return href;
      }
    })
    .map((href) => href.replace(/\\/g, "/"))
    .filter((href) => !href.endsWith("/"))
    .map((href) => href.split("/").pop())
    .filter(Boolean);

  return buildGalleryPhotosFromNames(photoNames);
}

async function fetchGalleryPhotosFromApi(signal) {
  const response = await fetch("/api/gallery", { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Gallery API request failed (${response.status})`);
  }

  const payload = await response.json();
  const photoNames = Array.isArray(payload?.photos) ? payload.photos : [];
  return buildGalleryPhotosFromNames(photoNames);
}

async function fetchGalleryPhotosFromDirectoryIndex(signal) {
  const response = await fetch("images/", { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Gallery index request failed (${response.status})`);
  }

  const indexHtml = await response.text();
  return buildGalleryPhotosFromIndex(indexHtml);
}

function useGalleryPhotos() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadPhotos = async () => {
      let discovered = [];

      try {
        discovered = await fetchGalleryPhotosFromApi(controller.signal);
      } catch (_error) {
        discovered = [];
      }

      if (!discovered.length) {
        try {
          discovered = await fetchGalleryPhotosFromDirectoryIndex(controller.signal);
        } catch (_error) {
          discovered = [];
        }
      }

      setPhotos(discovered);
    };

    loadPhotos();
    return () => controller.abort();
  }, []);

  return photos;
}

function useAmbientPointer() {
  useEffect(() => {
    const setPointer = (x, y) => {
      document.documentElement.style.setProperty("--pointer-x", `${x}px`);
      document.documentElement.style.setProperty("--pointer-y", `${y}px`);
    };

    const handleMove = (event) => {
      setPointer(event.clientX, event.clientY);
    };

    const handleLeave = () => {
      setPointer(window.innerWidth * 0.7, window.innerHeight * 0.2);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    if ("onpointerrawupdate" in window) {
      window.addEventListener("pointerrawupdate", handleMove, { passive: true });
    }
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if ("onpointerrawupdate" in window) {
        window.removeEventListener("pointerrawupdate", handleMove);
      }
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
    };
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

function useIsNarrowViewport(maxWidth = 980) {
  const [isNarrow, setIsNarrow] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth <= maxWidth;
  });

  useEffect(() => {
    const onResize = () => {
      setIsNarrow(window.innerWidth <= maxWidth);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [maxWidth]);

  return isNarrow;
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

function createSeededRng(seedText) {
  let seed = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  if (seed === 0) {
    seed = 123456789;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function buildTypingFrames(text) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const rng = createSeededRng(text);
  const frames = [];
  let rendered = "";
  let typoBudget = Math.max(1, Math.floor(text.length / 28));

  for (let index = 0; index < text.length; index += 1) {
    const nextChar = text[index];
    const isLetter = /[a-z]/i.test(nextChar);
    const canTypo = isLetter && typoBudget > 0 && index > 1 && index < text.length - 2;
    const shouldTypo = canTypo && rng() < 0.18;

    if (shouldTypo) {
      typoBudget -= 1;
      let wrongChar = alphabet[Math.floor(rng() * alphabet.length)];
      while (wrongChar.toLowerCase() === nextChar.toLowerCase()) {
        wrongChar = alphabet[Math.floor(rng() * alphabet.length)];
      }
      if (nextChar === nextChar.toUpperCase()) {
        wrongChar = wrongChar.toUpperCase();
      }
      frames.push(rendered + wrongChar);
      frames.push(rendered);
    }

    rendered += nextChar;
    frames.push(rendered);
  }

  return frames;
}

function typingDelay(currentFrame, nextFrame) {
  if (!nextFrame) {
    return 0;
  }
  if (nextFrame.length < currentFrame.length) {
    return 72;
  }
  const lastChar = currentFrame.charAt(currentFrame.length - 1);
  if (/[.!?]/.test(lastChar)) {
    return 140;
  }
  if (/[,:;]/.test(lastChar)) {
    return 95;
  }
  if (lastChar === " ") {
    return 34;
  }
  return 24;
}

function TypedSectionTitle({ text, className = "section-title", as = "h2", variant = null }) {
  const [ref, visible] = useInView(0.3);
  const [displayText, setDisplayText] = useState("");
  const timerRef = useRef(0);
  const typingFrames = useMemo(() => buildTypingFrames(text), [text]);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.clearTimeout(timerRef.current);

    if (prefersReducedMotion) {
      setDisplayText(text);
      return undefined;
    }

    if (visible) {
      let frameIndex = 0;
      const runTyping = () => {
        if (frameIndex >= typingFrames.length) {
          return;
        }
        const currentFrame = typingFrames[frameIndex];
        const nextFrame = typingFrames[frameIndex + 1];
        setDisplayText(currentFrame);
        frameIndex += 1;
        timerRef.current = window.setTimeout(runTyping, typingDelay(currentFrame, nextFrame));
      };

      setDisplayText("");
      runTyping();
    } else {
      let current = displayText;
      const erase = () => {
        if (!current.length) {
          setDisplayText("");
          return;
        }
        current = current.slice(0, -1);
        setDisplayText(current);
        timerRef.current = window.setTimeout(erase, 14);
      };
      erase();
    }

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [visible, text, typingFrames]);

  const content = (
    <>
      <span>{displayText}</span>
      <span className="typed-title-caret" aria-hidden="true" />
    </>
  );

  if (variant) {
    return (
      <Typography ref={ref} className={`${className} typed-title`} variant={variant}>
        {content}
      </Typography>
    );
  }

  return React.createElement(as, { ref, className: `${className} typed-title` }, content);
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

function RotatingPhotoGallery({ topChip, bottomChip, showSpotlight = false, onIndexChange = null }) {
  const galleryPhotos = useGalleryPhotos();
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const touchStateRef = useRef({
    active: false,
    horizontal: false,
    startX: 0,
    startY: 0,
    startIndex: 0,
  });
  const hasPhotos = galleryPhotos.length > 0;
  const activePhoto = galleryPhotos[index] || galleryPhotos[0];

  useEffect(() => {
    if (!hasPhotos) {
      return;
    }
    setIndex((current) => (current >= galleryPhotos.length ? 0 : current));
  }, [galleryPhotos.length, hasPhotos]);

  useEffect(() => {
    if (typeof onIndexChange === "function") {
      onIndexChange(index);
    }
  }, [index, onIndexChange]);

  const syncIndexToPointer = (event) => {
    if (!hasPhotos) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.999);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 0.999);
    const horizontalIndex = Math.floor(x * galleryPhotos.length);
    const verticalOffset = y > 0.62 ? 1 : 0;
    const nextIndex = (horizontalIndex + verticalOffset) % galleryPhotos.length;

    event.currentTarget.style.setProperty("--gallery-cursor-x", `${(x * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--gallery-cursor-y", `${(y * 100).toFixed(2)}%`);
    setIndex((current) => (current === nextIndex ? current : nextIndex));
  };

  const handlePointerEnter = (event) => {
    if (!hasPhotos) {
      return;
    }
    setIsHovering(true);
    syncIndexToPointer(event);
  };

  const handlePointerDown = (event) => {
    if (!hasPhotos || event.pointerType !== "touch") {
      return;
    }

    touchStateRef.current = {
      active: true,
      horizontal: false,
      startX: event.clientX,
      startY: event.clientY,
      startIndex: index,
    };
    setIsHovering(true);
    syncIndexToPointer(event);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === "touch" && touchStateRef.current.active) {
      const deltaX = event.clientX - touchStateRef.current.startX;
      const deltaY = event.clientY - touchStateRef.current.startY;

      if (!touchStateRef.current.horizontal && Math.abs(deltaX) > Math.abs(deltaY) + 5) {
        touchStateRef.current.horizontal = true;
      }

      if (touchStateRef.current.horizontal) {
        event.preventDefault();
        syncIndexToPointer(event);
        return;
      }
    }

    if (!isHovering) {
      setIsHovering(true);
    }
    syncIndexToPointer(event);
  };

  const handlePointerUp = (event) => {
    if (event.pointerType !== "touch" || !touchStateRef.current.active || !hasPhotos) {
      return;
    }

    const deltaX = event.clientX - touchStateRef.current.startX;
    if (touchStateRef.current.horizontal && Math.abs(deltaX) >= 34) {
      const direction = deltaX < 0 ? 1 : -1;
      const next = (touchStateRef.current.startIndex + direction + galleryPhotos.length) % galleryPhotos.length;
      setIndex(next);
    }

    touchStateRef.current = {
      active: false,
      horizontal: false,
      startX: 0,
      startY: 0,
      startIndex: 0,
    };
    setIsHovering(false);
    event.currentTarget.style.setProperty("--gallery-cursor-x", "50%");
    event.currentTarget.style.setProperty("--gallery-cursor-y", "50%");
  };

  const handlePointerLeave = (event) => {
    setIsHovering(false);
    touchStateRef.current = {
      active: false,
      horizontal: false,
      startX: 0,
      startY: 0,
      startIndex: 0,
    };
    event.currentTarget.style.setProperty("--gallery-cursor-x", "50%");
    event.currentTarget.style.setProperty("--gallery-cursor-y", "50%");
  };

  if (!hasPhotos) {
    return (
      <Box className="portrait-frame portrait-frame--gallery">
        {showSpotlight ? <div className="hero-spotlight" /> : null}
        <Box
          sx={{
            borderRadius: "28px",
            border: "1px dashed rgba(255,255,255,0.22)",
            minHeight: "18rem",
            display: "grid",
            placeItems: "center",
            p: 2,
            color: "text.secondary",
            textAlign: "center",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          Add images to /images to populate the gallery.
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className={`portrait-frame portrait-frame--gallery ${isHovering ? "is-hovering" : ""}`.trim()}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ "--gallery-count": galleryPhotos.length }}
    >
      {showSpotlight ? <div className="hero-spotlight" /> : null}
      <img
        key={activePhoto.src}
        className="portrait-image portrait-image--rotating"
        src={activePhoto.src}
        alt={activePhoto.alt}
      />
      {topChip ? <span className="portrait-chip portrait-chip--top">{topChip}</span> : null}
      {bottomChip ? <span className="portrait-chip portrait-chip--bottom">{bottomChip}</span> : null}
      <div className="gallery-hover-guide" aria-hidden="true">
        {galleryPhotos.map((photo, itemIndex) => (
          <span key={`${photo.src}-guide`} className={`gallery-hover-guide__segment ${itemIndex === index ? "is-active" : ""}`} />
        ))}
      </div>
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
  const currentPage = (document.body?.dataset?.page || "home").toLowerCase();
  const resolveSectionHref = (sectionHref) => (currentPage === "home" ? sectionHref : `index.html${sectionHref}`);

  return (
    <header className="site-header">
      <Paper className="site-header__inner" elevation={0}>
        <a className="brand" href={resolveSectionHref("#profile")} aria-label="Go to profile section">
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
              href={resolveSectionHref(item.href)}
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

function InteractiveCvTimeline() {
  const isNarrowViewport = useIsNarrowViewport(980);
  const [selectedId, setSelectedId] = useState(cvTimelineEntries[0]?.id || "");
  const [timelineFilter, setTimelineFilter] = useState("all");
  const entries = cvTimelineEntries;
  const filteredEntries = useMemo(() => {
    if (timelineFilter === "all") {
      return entries;
    }
    return entries.filter((item) => item.type === timelineFilter);
  }, [entries, timelineFilter]);

  useEffect(() => {
    if (!filteredEntries.length) {
      setSelectedId("");
      return;
    }
    setSelectedId((current) => {
      if (filteredEntries.some((item) => item.id === current)) {
        return current;
      }
      return filteredEntries[0].id;
    });
  }, [filteredEntries]);

  const activeEntry = useMemo(
    () => filteredEntries.find((item) => item.id === selectedId) || filteredEntries[0] || entries[0],
    [filteredEntries, entries, selectedId]
  );

  const railColor = "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.45), rgba(255,255,255,0.2))";
  const typeConfig = {
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
  const maxSlopeDropPx = 56;
  const laneWidthPx = 236;
  const nodeSlopeStepPx =
    filteredEntries.length > 1 ? Math.min(5.4, maxSlopeDropPx / (filteredEntries.length - 1)) : 0;
  const totalSlopeDropPx = nodeSlopeStepPx * Math.max(filteredEntries.length - 1, 0);
  const railTiltDeg =
    filteredEntries.length > 1
      ? (Math.atan2(totalSlopeDropPx, Math.max(1, filteredEntries.length * laneWidthPx)) * 180) / Math.PI
      : 0;
  const effectiveSlopeDropPx = isNarrowViewport ? 0 : totalSlopeDropPx;
  const effectiveRailTiltDeg = isNarrowViewport ? 0 : railTiltDeg;

  if (!activeEntry) {
    return null;
  }

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
            {filteredEntries.map((item, index) => {
              const isActive = selectedId === item.id;
              const itemType = typeConfig[item.type] || typeConfig.extracurricular;
              const verticalOffsetPx = isNarrowViewport ? 0 : Number((totalSlopeDropPx - index * nodeSlopeStepPx).toFixed(2));

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
                    "--node-offset": `${verticalOffsetPx}px`,
                    "--node-color": itemType.color,
                    "--node-border": isActive ? itemType.chipBorder : "rgba(255,255,255,0.1)",
                    "--node-bg": isActive ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                    "--node-text": isActive ? "rgba(243,245,247,1)" : "rgba(165,173,184,1)",
                  }}
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
            <Stack className="cv-timeline-detail__header" direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              <Box>
                <Typography variant="h6">{activeEntry.role}</Typography>
                <Typography className="panel-meta">{activeEntry.org}</Typography>
              </Box>
              <Stack className="cv-timeline-detail__chips" direction="row" gap={0.8}>
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
  const stackContext = stackNarratives[deferredTab] || stackNarratives.Languages;
  const [profileReviewIndex, setProfileReviewIndex] = useState(0);
  const activeProfileReview = profileReviewQuotes[profileReviewIndex % profileReviewQuotes.length] || profileReviewQuotes[0];

  return (
    <>
      <Reveal>
        <section id="profile" className="section contact-panel-grid">
          <InteractiveCard className="about-copy-card" sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.2} className="parallax-layer">
              <Paper variant="outlined" className="profile-review-card" sx={{ p: { xs: 2.2, md: 2.5 } }}>
                <Stack spacing={1.15}>
                  <Typography className="profile-review-quote" variant="h3">
                    "{activeProfileReview.quote}"
                  </Typography>
                  <div className="dynamic-divider" />
                  <Typography className="mini-label">{activeProfileReview.author}</Typography>
                  <Typography color="text.secondary">{activeProfileReview.context}</Typography>
                </Stack>
              </Paper>
              <Typography color="text.secondary">
                Queen's University Computer Science (Software Design Specialization), graduating 2026.
              </Typography>
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
                  <Typography className="panel-meta">Queen's CS | Class of 2026</Typography>
                </Box>
                <Chip label={site.location} variant="outlined" />
              </Stack>
              <RotatingPhotoGallery
                onIndexChange={setProfileReviewIndex}
              />
            </Stack>
          </InteractiveCard>
        </section>
      </Reveal>

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
                  Work spans implementation, reporting systems, and systems engineering support, with each area tied to measurable delivery outcomes.
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
              <Tabs value={deferredTab} onChange={(_, value) => startTransition(() => setTab(value))} variant="scrollable" scrollButtons={false}>
                {Object.keys(stackGroups).map((group) => (
                  <Tab key={group} value={group} label={group} />
                ))}
              </Tabs>
              <Typography className="stack-panel__intro" color="text.secondary">
                {stackContext.intro}
              </Typography>
              <div className="pill-cloud">
                {stackGroups[deferredTab].map((item) => (
                  <Chip key={item} label={item} sx={{ bgcolor: "rgba(255,255,255,0.06)" }} />
                ))}
              </div>
              <div className="stack-deep-grid">
                {stackContext.deepDive.map((item) => (
                  <Paper key={item.title} variant="outlined" className="stack-deep-card" sx={{ p: 1.5 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography color="text.secondary">{item.detail}</Typography>
                  </Paper>
                ))}
              </div>
              <Paper variant="outlined" className="stack-note-strip" sx={{ p: 1.6 }}>
                <Typography className="mini-label">Engineering preferences</Typography>
                <Stack spacing={0.65} sx={{ mt: 1 }}>
                  {stackContext.emphasis.map((item) => (
                    <Typography key={item} className="stack-note-strip__item" color="text.secondary">
                      - {item}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            </Stack>
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
              <TypedSectionTitle
                text="Open to software engineering and technical program roles."
                variant="h2"
              />
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
            <TypedSectionTitle text="Contact channels." />
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

      <Reveal>
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
  const currentPage = (document.body?.dataset?.page || "home").toLowerCase();
  const showAbout = currentPage === "home" || currentPage === "about";
  const showContact = currentPage === "home" || currentPage === "contact";

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
          {showAbout ? <AboutPage /> : null}
          {showContact ? <ContactPage /> : null}
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
