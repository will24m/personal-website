import { projects, skillsLine } from "../data/content.js";

export function WorkSection() {
  return (
    <section className="section work" aria-label="Skills and projects">
      <div className="surface-card work__card">
        <h2 className="work__label">Skills</h2>
        <p className="work__skills">{skillsLine.join(" · ")}</p>
        <h2 className="work__label">Projects</h2>
        <ul className="work__projects">
          {projects.map((project) => (
            <li key={project.title}>
              <a href={project.href} target="_blank" rel="noreferrer">
                {project.title}
              </a>{" "}
              — {project.blurb}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
