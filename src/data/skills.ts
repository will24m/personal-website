export interface DeepDiveItem {
  title: string;
  detail: string;
}

export interface StackNarrative {
  intro: string;
  deepDive: DeepDiveItem[];
  emphasis: string[];
}

export const stackGroups: Record<string, string[]> = {
  "Programming Languages": ["Python", "Java", "JavaScript", "SQL", "C++", "C"],
  "Frameworks & Tools": [
    "Git",
    "GitHub",
    "React",
    "Docker",
    "Kubernetes",
    "Django",
    "Jira",
    "Confluence",
    "PowerApps",
  ],
  "Cloud & Databases": [
    "AWS (DynamoDB, EC2, LightSail)",
    "Azure DevOps",
    "MongoDB",
    "IBM DOORS",
    "DXL",
    "Firebase",
  ],
  "Data Science & Machine Learning": [
    "TensorFlow",
    "PyTorch",
    "NumPy",
    "Power BI",
    "Tableau",
    "OpenCV",
    "SciPy",
  ],
  "System Design": ["Microsoft Office", "Adobe Creative Suite", "Figma", "Canva", "MURAL", "CAMEO"],
  "Software Testing": ["Selenium", "Postman", "Jest", "Appium", "PyTest"],
  "Spoken Languages": ["English", "French", "Mandarin", "Cantonese", "Spanish"],
  Achievements: [
    "RCM Piano Level 10 (MAX)",
    "Taekwondo Black Belt",
    "National Competitor - FBLA",
    "National Competitor - DECA",
    "Goldman Sachs Risk Job Simulation (Sep 2025)",
  ],
};

export const stackNarratives: Record<string, StackNarrative> = {
  "Programming Languages": {
    intro: "Core delivery languages used across internal tooling, data pipelines, and systems-support workflows.",
    deepDive: [
      { title: "Automation", detail: "Python and JavaScript for scripting, reporting, and workflow tooling." },
      { title: "Enterprise delivery", detail: "Java and SQL for structured application and data tasks." },
      { title: "Systems context", detail: "C and C++ for engineering-oriented tooling and lower-level control." },
      {
        title: "Practical mix",
        detail: "Language choice is driven by maintainability, speed, and deployment constraints.",
      },
    ],
    emphasis: [
      "Readable and maintainable implementation under delivery deadlines.",
      "Strong data validation and reliability in internal tooling.",
      "Clear separation between business logic and data layers.",
    ],
  },
  "Frameworks & Tools": {
    intro:
      "Framework and platform usage focused on shipping internal applications, dashboards, and team workflows.",
    deepDive: [
      {
        title: "App delivery",
        detail: "React, Django, and PowerApps for rapid internal application development.",
      },
      {
        title: "Collaboration",
        detail: "Jira and Confluence for planning, requirements tracking, and documentation.",
      },
      {
        title: "Dev workflow",
        detail: "Git/GitHub plus Azure DevOps for source control and deployment lifecycle.",
      },
      {
        title: "Container familiarity",
        detail: "Docker and Kubernetes for deployment architecture context.",
      },
    ],
    emphasis: [
      "Build tools teams can adopt quickly.",
      "Keep docs and implementation aligned.",
      "Prioritize repeatable development workflows.",
    ],
  },
  "Cloud & Databases": {
    intro:
      "Experience spans cloud services, database operations, and requirements/data environments used in enterprise teams.",
    deepDive: [
      {
        title: "Cloud services",
        detail: "AWS (DynamoDB, EC2, LightSail) and Azure DevOps in delivery workflows.",
      },
      { title: "Data stores", detail: "MongoDB and Firebase for data-driven app and prototype needs." },
      {
        title: "Requirements systems",
        detail: "IBM DOORS and DXL for requirements traceability and automation.",
      },
      {
        title: "Ops integration",
        detail: "Cloud/database decisions tied to reliability and maintainability.",
      },
    ],
    emphasis: [
      "Choose infrastructure based on workflow fit.",
      "Maintain traceability from requirements to implementation.",
      "Keep storage and deployment decisions practical.",
    ],
  },
  "Data Science & Machine Learning": {
    intro:
      "Applied ML/data tooling used for analysis, model experimentation, and decision-support reporting.",
    deepDive: [
      {
        title: "Model tooling",
        detail: "TensorFlow and PyTorch for supervised and sequence-model experimentation.",
      },
      {
        title: "Scientific stack",
        detail: "NumPy and SciPy for data prep, numeric workflows, and experimentation.",
      },
      {
        title: "Computer vision / NLP context",
        detail: "OpenCV and text-data pipelines in student and project work.",
      },
      {
        title: "Decision surfaces",
        detail: "Power BI and Tableau for stakeholder-ready analytics views.",
      },
    ],
    emphasis: [
      "Translate analysis into clear operational reporting.",
      "Validate model behavior with repeatable checks.",
      "Prefer actionable insights over novelty.",
    ],
  },
  "System Design": {
    intro:
      "System and communication tools used for architecture, design artifacts, and stakeholder alignment.",
    deepDive: [
      {
        title: "Architecture artifacts",
        detail: "CAMEO and visual system documentation for engineering context.",
      },
      {
        title: "Collaboration assets",
        detail: "Figma, MURAL, and Canva for workflow communication and planning.",
      },
      {
        title: "Documentation baseline",
        detail: "Microsoft Office and Adobe tools for polished deliverables.",
      },
      { title: "Decision support", detail: "Design tooling used to clarify tradeoffs and constraints." },
    ],
    emphasis: [
      "Keep system communication clear across technical and non-technical groups.",
      "Use visuals to reduce ambiguity in planning.",
      "Document decisions for smoother handoffs.",
    ],
  },
  "Software Testing": {
    intro:
      "Testing stack focused on regression confidence, API checks, and practical validation of internal tools.",
    deepDive: [
      {
        title: "UI automation",
        detail: "Selenium and Appium for browser/mobile behavior verification.",
      },
      { title: "API checks", detail: "Postman for endpoint validation and integration sanity checks." },
      { title: "Unit/regression", detail: "Jest and PyTest for repeatable checks across code changes." },
      {
        title: "Quality mindset",
        detail: "Testing used to reduce rework and improve release confidence.",
      },
    ],
    emphasis: [
      "Automate high-value checks first.",
      "Use tests to support faster iteration.",
      "Keep test coverage aligned to real failure risk.",
    ],
  },
  "Spoken Languages": {
    intro: "Multilingual communication supports collaboration across diverse teams and stakeholders.",
    deepDive: [
      {
        title: "Primary communication",
        detail: "English and Mandarin for day-to-day technical and stakeholder communication.",
      },
      {
        title: "Additional fluency",
        detail: "Cantonese and French used in collaborative and community settings.",
      },
      {
        title: "Conversational range",
        detail: "Spanish for broader communication and cultural context.",
      },
      {
        title: "Team impact",
        detail: "Language flexibility helps reduce communication barriers in mixed groups.",
      },
    ],
    emphasis: [
      "Communicate clearly across audiences.",
      "Adapt tone and detail to stakeholders.",
      "Use language skills to improve team inclusion.",
    ],
  },
  Achievements: {
    intro: "Recognition and credentials across music, athletics, business competitions, and career simulations.",
    deepDive: [
      { title: "Music", detail: "RCM Piano Level 10 (MAX)." },
      { title: "Athletics", detail: "Taekwondo Black Belt." },
      { title: "Competition", detail: "National competitor in FBLA and DECA business competitions." },
      { title: "Credential", detail: "Goldman Sachs Risk Job Simulation (issued Sep 2025)." },
    ],
    emphasis: [
      "Long-term discipline and consistency.",
      "Execution under pressure and evaluation.",
      "Transferable leadership and communication skills.",
    ],
  },
};
