import { site } from "../config.js";

export interface ProfileReviewQuote {
  quote: string;
  author: string;
  context: string;
}

export interface Project {
  title: string;
  href: string;
  blurb: string;
}

export const introCopy = {
  name: site.name,
  tagline: "Software | Systems | Technical Program Management",
  paragraph:
    "Computing student at Queen's University (Bachelor of Computing Honours '26, Software Design, Dean's Honour List) with three Lockheed Martin internships across software engineering, systems engineering, and technical program management. I build internal tools, reporting pipelines, and the automation that keeps engineering teams moving.",
} as const;

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

export const skillsLine: string[] = [
  "Python",
  "TypeScript",
  "Java",
  "C",
  "SQL",
  "React",
  "AWS",
  "Azure DevOps",
  "Tableau",
  "Power BI",
  "CAMEO",
  "IBM DOORS",
];

export const projects: Project[] = [
  {
    title: "Online to-do list",
    href: site.todo,
    blurb: "The live to-do app I use daily to keep work and priorities organized.",
  },
];
