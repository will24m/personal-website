import { site } from "../config.js";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
      </div>
    </footer>
  );
}
