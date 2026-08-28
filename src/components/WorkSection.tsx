import { skillsLine } from "../data/content.js";

export function WorkSection() {
  return (
    <section className="section work" aria-label="Skills">
      <div className="surface-card work__card">
        <h2 className="work__label">Skills</h2>
        <p className="work__skills">{skillsLine.join(" · ")}</p>
      </div>
    </section>
  );
}
