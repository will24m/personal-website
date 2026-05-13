import { useState } from "react";
import { Paper } from "@mui/material";
import { site, navItems } from "../config.js";

export function Header() {
  const [open, setOpen] = useState(false);
  const currentPage = ((document.body?.dataset?.page) ?? "home").toLowerCase();
  const resolveSectionHref = (sectionHref: string) =>
    currentPage === "home" ? sectionHref : `index.html${sectionHref}`;

  return (
    <header className="site-header">
      <Paper className="site-header__inner" elevation={0}>
        <a
          className="brand"
          href={resolveSectionHref("#profile")}
          aria-label="Go to profile section"
        >
          <span className="brand__mark">WW</span>
          <span className="brand__copy">
            <span className="brand__name">{site.name}</span>
            <span className="brand__meta">TPM | software | systems</span>
          </span>
        </a>
        <button
          className="nav-toggle"
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
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
