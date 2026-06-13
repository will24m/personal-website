import { site } from "../config.js";

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <span className="brand">
          <span className="brand__mark">WW</span>
          <span className="brand__name">{site.name}</span>
        </span>
        <span className="site-header__meta">{site.currentRole}</span>
      </div>
    </header>
  );
}
