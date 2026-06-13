import { MotionConfig } from "framer-motion";
import { ContactSidebar } from "./components/ContactSidebar.js";
import { Footer } from "./components/Footer.js";
import { Header } from "./components/Header.js";
import { IntroSection } from "./components/IntroSection.js";
import { PhotoQuotes } from "./components/PhotoQuotes.js";
import { VirtualPet } from "./components/VirtualPet.js";
import { VisitorStatsPanel } from "./components/VisitorStatsPanel.js";
import { WorkSection } from "./components/WorkSection.js";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-root">
        <Header />
        <div className="site-layout">
          <main className="site-main" id="main-content">
            <IntroSection />
            <PhotoQuotes />
            <WorkSection />
            <VisitorStatsPanel />
          </main>
          <ContactSidebar />
        </div>
        <Footer />
        <VirtualPet />
      </div>
    </MotionConfig>
  );
}
