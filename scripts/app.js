const { useEffect, useMemo, useRef, useState } = React;

const site = {
  name: "Will Wu",
  email: "will@williamwu.ca",
  linkedin: "https://www.linkedin.com/in/will24m",
  github: "https://github.com/will24m",
  location: "Toronto, ON",
  school: "Queen's University Computer Science",
  currentRole: "TPM Intern at Lockheed Martin",
  nextRole: "Incoming Software Engineer at Lockheed Martin",
};

const navItems = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "about.html", label: "About", key: "about" },
  { href: "contact.html", label: "Contact", key: "contact" },
];

const services = [
  {
    id: "lockheed",
    title: "Lockheed Martin",
    tag: "current + next",
    summary:
      "Currently a TPM Intern at Lockheed Martin and returning as an incoming Software Engineer, building on prior systems engineering and software engineering internships.",
    bestFor: "Three internships across systems, program management, and software delivery.",
    outcome: "Experience with Python, C, DXL, Jira, Tableau, CAMEO, IBM DOORS, and cross-team execution.",
  },
  {
    id: "gac",
    title: "Global Affairs Canada",
    tag: "software + business analysis",
    summary:
      "Built and refined CRM systems with Microsoft Dynamics 365, Power Platform, Azure DevOps, and Power BI for real internal users.",
    bestFor: "500+ production improvements, 10+ active dashboards, and requirements gathered from 50+ stakeholders.",
    outcome: "A mix of software delivery, analytics, stakeholder communication, permissions, and CI/CD work.",
  },
  {
    id: "leadership",
    title: "Leadership and campus impact",
    tag: "student leadership",
    summary:
      "Alongside internships, I lead student teams and large initiatives across Queen's Computing, QHacks, and other organizations.",
    bestFor: "Representing 1600+ students, helping run large events, and coordinating across multiple portfolios and teams.",
    outcome: "Strong communication, organization, and ownership in both technical and community settings.",
  },
];

const principles = [
  {
    title: "Technical depth with context",
    copy: "I like understanding both the engineering details and the broader system, team, or program around them.",
    icon: "01",
  },
  {
    title: "Useful work at real scale",
    copy: "I am most energized by work that improves real processes, supports users, and shows measurable impact.",
    icon: "02",
  },
  {
    title: "Cross-functional by default",
    copy: "My background spans software, systems, analytics, and program work, so I communicate comfortably across teams.",
    icon: "03",
  },
];

const stackGroups = {
  Languages: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "C", "C++"],
  Platforms: ["React", "Django", "Docker", "Kubernetes", "GitHub Actions", "Azure DevOps", "Power BI", "Tableau"],
  Tools: ["Jira", "Confluence", "Microsoft Dynamics", "PowerApps", "IBM DOORS/DXL", "CAMEO", "Postman", "PyTest"],
};

const timeline = [
  {
    step: "Systems Engineering Intern",
    copy: "Worked in CAMEO, Windchill, and DOORS to support architecture, compliance, and engineering documentation at Lockheed Martin.",
  },
  {
    step: "Program Management / TPM Intern",
    copy: "Built KPI dashboards, Jira workflows, and Agile documentation to support large program coordination and leadership reporting.",
  },
  {
    step: "Software Engineering Intern -> Incoming SWE",
    copy: "Automated workflows with Python, C, and DXL, then returned to Lockheed Martin as a TPM Intern with an incoming SWE role ahead.",
  },
];

const methods = [
  {
    title: "Email",
    meta: site.email,
    href: `mailto:${site.email}`,
    description: "Best for recruiting outreach, internship or new grad conversations, and technical intros.",
  },
  {
    title: "LinkedIn",
    meta: "@will24m",
    href: site.linkedin,
    description: "A good place for professional networking, resume context, and quick outreach.",
  },
  {
    title: "GitHub",
    meta: "will24m",
    href: site.github,
    description: "Browse projects, code, and the technical side of what I am building.",
  },
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

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
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

    const isWeekday = ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
    const isLive = isWeekday && hour >= 10 && hour < 18;

    return {
      dateLabel,
      timeLabel,
      isLive,
      statusLabel: isLive ? "Usually online now" : "Likely replies next work block",
    };
  }, [now]);
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

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) {
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
  }, [started, value]);

  return (
    <span ref={ref} className="metric-value">
      {display}
      {suffix}
    </span>
  );
}

function Button({ href, children, variant = "primary", target, rel, onClick, type = "button" }) {
  const className = `button button--${variant}`;

  if (href) {
    return (
      <a className={className} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

function Header({ page }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [page]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="index.html" aria-label="Go to homepage">
          <span className="brand__mark">WW</span>
          <span className="brand__copy">
            <span className="brand__name">{site.name}</span>
            <span className="brand__meta">TPM intern | incoming software engineer</span>
          </span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((current) => !current)}
        >
          Menu
        </button>

        <nav className={`site-nav ${open ? "is-open" : ""}`} aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.key}
              className={`nav-link ${item.key === page ? "nav-link--active" : ""}`}
              href={item.href}
              aria-current={item.key === page ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <Button href="contact.html" variant="secondary">
            Start a conversation
          </Button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const now = useClock();
  const availability = useTorontoAvailability(now);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-copy">
          Queen's Computer Science, Lockheed Martin experience across software, systems, and program work. Toronto time is {availability.timeLabel}.
        </div>
        <div className="footer-links">
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={`mailto:${site.email}`}>Email</a>
        </div>
      </div>
    </footer>
  );
}

function AmbientOrbs() {
  return (
    <>
      <span className="ambient-orb ambient-orb--a" />
      <span className="ambient-orb ambient-orb--b" />
      <span className="ambient-orb ambient-orb--c" />
    </>
  );
}

function HomePage() {
  const [selectedId, setSelectedId] = useState(services[0].id);
  const selectedService = services.find((service) => service.id === selectedId) || services[0];

  return (
    <>
      <section className="section hero-grid">
        <div className="hero-copy" data-reveal>
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            {site.currentRole} | {site.nextRole}
          </span>
          <h1 className="hero-title">
            I work across{" "}
            <RotatingWord words={["software", "systems", "analytics", "program delivery"]} />{" "}
            with an engineering mindset.
          </h1>
          <p>
            I am a Computer Science student at Queen's University, currently a TPM Intern at Lockheed
            Martin and an incoming Software Engineer at Lockheed Martin. My experience spans software
            engineering, systems engineering, business analysis, dashboards, automation, and student
            leadership.
          </p>

          <div className="hero-actions">
            <Button href="contact.html">
              Get in touch <span className="inline-arrow">-></span>
            </Button>
            <Button href="about.html" variant="secondary">
              View experience
            </Button>
          </div>

          <div className="pill-row">
            <span className="pill">Lockheed Martin</span>
            <span className="pill">Global Affairs Canada</span>
            <span className="pill">Queen's University CS</span>
          </div>
        </div>

        <div className="hero-panel" data-reveal>
          <div className="panel-top">
            <div>
              <div className="panel-title">Experience snapshot</div>
              <div className="panel-meta">Recent roles, impact, and where I am headed</div>
            </div>
            <span className="service-tag">resume-based</span>
          </div>

          <div className="portrait-frame">
            <img className="portrait-image" src="images/headshot.jpg" alt="Portrait of Will Wu" />
            <span className="portrait-chip portrait-chip--top">TPM intern</span>
            <span className="portrait-chip portrait-chip--bottom">Incoming SWE</span>
          </div>

          <div className="surface-card">
            <span className="mini-label">Explore the background</span>
            <div className="service-switcher">
              {services.map((service) => (
                <button
                  key={service.id}
                  className={`service-switch ${service.id === selectedId ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setSelectedId(service.id)}
                >
                  {service.title}
                </button>
              ))}
            </div>

            <div className="service-details">
              <div className="panel-top">
                <div className="service-title">{selectedService.title}</div>
                <span className="service-tag">{selectedService.tag}</span>
              </div>
              <p className="card-copy">{selectedService.summary}</p>
              <div className="service-grid">
                <div>
                  <span className="mini-label">Snapshot</span>
                  <p className="card-copy">{selectedService.bestFor}</p>
                </div>
                <div>
                  <span className="mini-label">Why it matters</span>
                  <p className="card-copy">{selectedService.outcome}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section metric-grid">
        <div className="metric-card" data-reveal>
          <span className="mini-label">Major work experiences</span>
          <CountUp value={4} />
          <div className="metric-label">Four internships and work terms across government and defense environments.</div>
        </div>
        <div className="metric-card" data-reveal>
          <span className="mini-label">Production improvements</span>
          <CountUp value={500} suffix="+" />
          <div className="metric-label">Technical improvements, bug fixes, and enhancements shipped at Global Affairs Canada.</div>
        </div>
        <div className="metric-card" data-reveal>
          <span className="mini-label">Students represented</span>
          <CountUp value={1600} suffix="+" />
          <div className="metric-label">Student community impacted through Queen's Computing leadership roles.</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">What I bring</span>
          <h2 className="section-title">A mix of engineering execution, analytics, and cross-functional delivery.</h2>
          <p className="section-copy">
            My background is not just one lane. I have worked in software engineering, systems
            engineering, program management, business analysis, and student leadership, which gives me
            a broad view of how technical work gets done.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card" data-reveal>
            <div className="icon-badge">A</div>
            <h3 className="feature-title">Automation and software</h3>
            <p className="card-copy">
              Built tools in Python, C, and DXL to automate engineering workflows, transform data, and
              reduce manual effort.
            </p>
          </article>

          <article className="feature-card" data-reveal>
            <div className="icon-badge">R</div>
            <h3 className="feature-title">Systems and process</h3>
            <p className="card-copy">
              Worked with DOORS, CAMEO, Tableau, Jira, and Power BI to support design reviews,
              compliance, dashboards, and operational visibility.
            </p>
          </article>

          <article className="feature-card" data-reveal>
            <div className="icon-badge">M</div>
            <h3 className="feature-title">Leadership and communication</h3>
            <p className="card-copy">
              Comfortable working with stakeholders, leadership, and student teams, whether that means
              requirements gathering, reporting, or coordinating large initiatives.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  const [activeTab, setActiveTab] = useState(Object.keys(stackGroups)[0]);

  return (
    <>
      <section className="section about-grid">
        <div className="about-copy-card" data-reveal>
          <span className="eyebrow">About me</span>
          <h1 className="section-title">Computer science student with experience in software, systems, and delivery.</h1>
          <p className="section-copy">
            I am studying Computer Science at Queen's University and graduating in 2026. My resume
            includes work across Lockheed Martin and Global Affairs Canada, plus leadership roles that
            have pushed me to communicate clearly, move projects forward, and work well across teams.
          </p>

          <div className="story-list">
            <div className="story-item">
              <span className="story-step">1</span>
              <div>
                <strong>Three internships at Lockheed Martin.</strong>
                <div className="card-copy">
                  I have worked in systems engineering, program management, and software engineering,
                  which has given me a strong view of both technical detail and larger program context.
                </div>
              </div>
            </div>
            <div className="story-item">
              <span className="story-step">2</span>
              <div>
                <strong>Hands-on delivery at Global Affairs Canada.</strong>
                <div className="card-copy">
                  I built CRM improvements, dashboards, migration flows, and deployment support while
                  balancing business analysis and stakeholder communication.
                </div>
              </div>
            </div>
            <div className="story-item">
              <span className="story-step">3</span>
              <div>
                <strong>Leadership outside the classroom.</strong>
                <div className="card-copy">
                  From representing 1600+ computing students to co-leading QHacks and other student
                  organizations, I care a lot about building strong communities and effective teams.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-panel" data-reveal>
          <div className="panel-top">
            <div>
              <div className="panel-title">Current profile</div>
              <div className="panel-meta">Queen's University | graduating 2026</div>
            </div>
            <span className="service-tag">Honours CS</span>
          </div>

          <div className="portrait-frame">
            <img className="portrait-image" src="images/headshot.jpg" alt="Will Wu" />
            <span className="portrait-chip portrait-chip--top">3 Lockheed internships</span>
            <span className="portrait-chip portrait-chip--bottom">Dean's Honour List</span>
          </div>

          <div className="surface-card">
            <span className="mini-label">In practice</span>
            <p className="card-copy">
              Right now I am a TPM Intern at Lockheed Martin and an incoming Software Engineer. I am
              especially interested in roles where I can pair strong technical work with structured
              execution and cross-functional collaboration.
            </p>
            <div className="pill-row">
              <span className="pill">Software engineering</span>
              <span className="pill">Technical program work</span>
              <span className="pill">Analytics and automation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">How I work</span>
          <h2 className="section-title">I like technical work that is structured, measurable, and useful.</h2>
        </div>

        <div className="principle-grid">
          {principles.map((principle) => (
            <article key={principle.title} className="principle-card" data-reveal>
              <div className="icon-badge">{principle.icon}</div>
              <h3 className="principle-title">{principle.title}</h3>
              <p className="card-copy">{principle.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Tools and strengths</span>
          <h2 className="section-title">Languages, platforms, and tools I have used in internships and projects.</h2>
        </div>

        <div className="stack-panel" data-reveal>
          <div className="stack-tab-row">
            {Object.keys(stackGroups).map((group) => (
              <button
                key={group}
                type="button"
                className={`stack-tab ${group === activeTab ? "is-active" : ""}`}
                onClick={() => setActiveTab(group)}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="stack-chip-wrap">
            {stackGroups[activeTab].map((item) => (
              <span key={item} className="stack-chip">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Experience path</span>
          <h2 className="section-title">How each role built on the last one.</h2>
        </div>

        <div className="timeline-grid">
          {timeline.map((item, index) => (
            <article key={item.step} className="timeline-card" data-reveal>
              <div className="timeline-number">Step 0{index + 1}</div>
              <h3 className="timeline-title">{item.step}</h3>
              <p className="card-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "Software opportunity",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState("A little context about the role, team, or reason for reaching out goes a long way.");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "A name helps me know who I am talking to.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "An email is needed so I can reply.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "That email format looks off.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "A few details about the project would be perfect.";
    } else if (form.message.trim().length < 14) {
      nextErrors.message = "Add a little more context so I can understand the direction.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      setNote("A couple of fields need a quick fix before the draft email opens.");
      return;
    }

    const subject = `${form.project} inquiry from ${form.name}`;
    const body = [
      "Hi Will,",
      "",
      form.message,
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Project type: ${form.project}`,
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote("Your email app should open with a draft message. If it does not, reach me directly at will@williamwu.ca.");
  };

  return (
    <div className="contact-form-card" data-reveal>
      <div>
        <span className="eyebrow">Start the conversation</span>
        <h2 className="form-title">Open a draft email with the right context already filled in.</h2>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email ? <span className="field-error">{errors.email}</span> : null}
          </div>

          <div className="field field--full">
            <label htmlFor="project">What are you reaching out about?</label>
            <select id="project" name="project" value={form.project} onChange={handleChange}>
              <option>Software opportunity</option>
              <option>Internship or new grad role</option>
              <option>Technical project or collaboration</option>
              <option>Student leadership or event</option>
              <option>General intro</option>
            </select>
          </div>

          <div className="field field--full">
            <label htmlFor="message">What would you like to discuss?</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="A role, team, project, technical opportunity, or a quick intro."
            />
            {errors.message ? <span className="field-error">{errors.message}</span> : null}
          </div>
        </div>

        <div className="button-row">
          <Button type="submit">
            Create email draft <span className="inline-arrow">-></span>
          </Button>
          <Button href={`mailto:${site.email}`} variant="secondary">
            Email directly
          </Button>
        </div>
      </form>

      <div className="form-note">{note}</div>
    </div>
  );
}

function AvailabilityCard() {
  const now = useClock();
  const availability = useTorontoAvailability(now);

  return (
    <aside className="availability-card" data-reveal>
      <span className="eyebrow">Live status</span>
      <div className="availability-status">
        <span className={`status-dot ${availability.isLive ? "" : "is-offline"}`} />
        {availability.statusLabel}
      </div>
      <div className="availability-time">{availability.timeLabel}</div>
      <div className="availability-copy">
        {availability.dateLabel} in Toronto. Ideal for recruiting conversations, technical opportunities,
        and thoughtful networking.
      </div>
      <div className="detail-list">
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <strong>{site.location}</strong>
        </div>
        <div className="detail-row">
          <span className="detail-label">Current role</span>
          <strong>TPM Intern at Lockheed Martin</strong>
        </div>
        <div className="detail-row">
          <span className="detail-label">Next role</span>
          <strong>Incoming Software Engineer</strong>
        </div>
        <div className="detail-row">
          <span className="detail-label">Best contact</span>
          <strong>{site.email}</strong>
        </div>
      </div>
    </aside>
  );
}

function ContactPage() {
  return (
    <>
      <section className="section contact-grid">
        <div className="contact-copy-card" data-reveal>
          <span className="eyebrow">Let's connect</span>
          <h1 className="section-title">Open to software opportunities, technical conversations, and leadership outreach.</h1>
          <p className="contact-copy">
            I am currently a TPM Intern at Lockheed Martin and an incoming Software Engineer at
            Lockheed Martin. If you are reaching out about a role, project, team, or student
            leadership opportunity, I would be glad to connect.
          </p>

          <div className="contact-pill-row">
            <span className="pill">Software roles</span>
            <span className="pill">Technical projects</span>
            <span className="pill">Leadership outreach</span>
          </div>
        </div>

        <AvailabilityCard />
      </section>

      <section className="section">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">Reach out</span>
          <h2 className="section-title">Pick the channel that feels easiest.</h2>
        </div>

        <div className="method-grid">
          {methods.map((method) => (
            <a
              key={method.title}
              className="contact-method"
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={method.href.startsWith("http") ? "noreferrer" : undefined}
              data-reveal
            >
              <div className="icon-badge">{method.title.slice(0, 1)}</div>
              <h3 className="contact-method__title">{method.title}</h3>
              <div className="contact-method__meta">{method.meta}</div>
              <p className="card-copy">{method.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section contact-grid">
        <ContactForm />

        <div className="contact-copy-card" data-reveal>
          <span className="eyebrow">What helps most</span>
          <h2 className="form-title">A little context makes the next step easier.</h2>
          <p className="contact-copy">
            If you are reaching out about an opportunity, a team, or a project, a few specifics help me
            respond much faster and with the right context.
          </p>

          <div className="story-list">
            <div className="story-item">
              <span className="story-step">A</span>
              <div>
                <strong>Role or opportunity</strong>
                <div className="card-copy">
                  Software engineering, internship or new grad recruiting, technical collaboration, or leadership.
                </div>
              </div>
            </div>
            <div className="story-item">
              <span className="story-step">B</span>
              <div>
                <strong>Team or problem space</strong>
                <div className="card-copy">
                  Product area, technical domain, organization, or the kind of work involved.
                </div>
              </div>
            </div>
            <div className="story-item">
              <span className="story-step">C</span>
              <div>
                <strong>Timeline or next step</strong>
                <div className="card-copy">
                  Whether you want to chat, share a role, discuss a project, or set up a follow-up conversation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  const page = document.body.dataset.page || "home";

  useAmbientPointer();
  useRevealOnScroll();

  return (
    <div className="site-root">
      <AmbientOrbs />
      <Header page={page} />
      <main className={`page page--${page}`}>
        {page === "home" ? <HomePage /> : null}
        {page === "about" ? <AboutPage /> : null}
        {page === "contact" ? <ContactPage /> : null}
      </main>
      <Footer />
    </div>
  );
}

const rootElement = document.getElementById("app");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
