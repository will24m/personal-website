import { site } from "../config.js";

export function ContactSidebar() {
  return (
    <aside className="contact-sidebar" aria-label="Contact">
      <div className="surface-card contact-sidebar__card">
        <h2 className="contact-sidebar__title">Contact</h2>
        <p className="contact-sidebar__meta">{site.location}</p>
        <div className="contact-sidebar__links">
          <a className="button button--primary" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="button" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="button" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </aside>
  );
}
