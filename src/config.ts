export interface NavItem {
  href: string;
  label: string;
  key: string;
}

export const site = {
  name: "Will Wu",
  email: "will@williamwu.ca",
  linkedin: "https://www.linkedin.com/in/will24m",
  github: "https://github.com/will24m",
  todo: "https://todo.williamwu.ca",
  location: "Toronto, ON",
  school: "Queen's University | Bachelor's of Computing (Honours), 2026",
  currentRole: "Technical Program Management Intern, Lockheed Martin",
  nextRole: "Previous internships at Lockheed Martin: Software Engineering and Systems Engineering.",
} as const;

export const navItems: NavItem[] = [
  { href: "#profile", label: "Profile", key: "profile" },
  { href: "#timeline", label: "Timeline", key: "timeline" },
  { href: "#skills", label: "Skills", key: "skills" },
  { href: "#projects", label: "Projects", key: "projects" },
  { href: "#contact", label: "Contact", key: "contact" },
];
