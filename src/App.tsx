import { CssBaseline, ThemeProvider } from "@mui/material";
import { MotionConfig } from "framer-motion";
import { AboutPage } from "./components/AboutPage.js";
import { ContactPage } from "./components/ContactPage.js";
import { Footer } from "./components/Footer.js";
import { Header } from "./components/Header.js";
import { ScrollProgressBar } from "./components/ScrollProgressBar.js";
import { VirtualPet } from "./components/VirtualPet.js";
import { VisitorStatsPanel } from "./components/VisitorStatsPanel.js";
import { theme } from "./theme.js";

export function App() {
  const currentPage = ((document.body?.dataset?.page) ?? "home").toLowerCase();
  const showAbout = currentPage === "home" || currentPage === "about";
  const showContact = currentPage === "home" || currentPage === "contact";

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="site-root mui-shell">
          <ScrollProgressBar />
          <span className="ambient-orb ambient-orb--a" />
          <span className="ambient-orb ambient-orb--b" />
          <span className="ambient-orb ambient-orb--c" />
          <Header />
          <main className="page page--single">
            {showAbout ? <AboutPage /> : null}
            {showContact ? <ContactPage /> : null}
            {currentPage === "contact" ? <VisitorStatsPanel /> : null}
          </main>
          <Footer />
          <VirtualPet />
        </div>
      </ThemeProvider>
    </MotionConfig>
  );
}
