import { introCopy } from "../data/content.js";

export function IntroSection() {
  return (
    <section className="section intro" aria-label="Introduction">
      <h1 className="intro__name">{introCopy.name}</h1>
      <p className="intro__tagline">{introCopy.tagline}</p>
      <p className="intro__copy">{introCopy.paragraph}</p>
    </section>
  );
}
