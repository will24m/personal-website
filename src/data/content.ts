import { site } from "../config.js";

export interface ProfileReviewQuote {
  quote: string;
  author: string;
  context: string;
}

export interface Principle {
  title: string;
  copy: string;
  deliverables: string[];
  outcomes: string[];
  tools: string[];
}

export interface TechnicalHighlight {
  value: string;
  label: string;
  detail: string;
}

export interface ContactMethod {
  title: string;
  meta: string;
  href: string;
  description: string;
}

export interface Project {
  title: string;
  meta: string;
  href: string;
  description: string;
  tags: string[];
  cta: string;
}

export const profileReviewQuotes: ProfileReviewQuote[] = [
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

export const educationHighlights: string[] = [
  "Queen's University - Bachelor's of Computing (Honours), 2026.",
  "Software Design Specialization. Dean's Honour List, GPA 3.8.",
  "A.Y. Jackson Secondary School (OSSD), Toronto | 2017-2021 | 94% average.",
  "Activities: 4x Curling Team Captain, 3x MVP, Charity Head Organizer, Orchestra, Business Competitions, Tutor.",
];

export const principles: Principle[] = [
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

export const technicalHighlights: TechnicalHighlight[] = [
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

export const contactMethods: ContactMethod[] = [
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

export const projects: Project[] = [
  {
    title: "Online to-do list",
    meta: "todo.williamwu.ca",
    href: site.todo,
    description: "A live link to the online to-do list I use to keep work, tasks, and priorities organized.",
    tags: ["Live", "Personal tool", "Productivity"],
    cta: "download my online to-do list",
  },
];
