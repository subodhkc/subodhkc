// components/hero/Hero.tsx - server component wrapper for SEO + interactive hero
import { HeroInteractive } from "./HeroInteractive";

export function Hero() {
  return (
    <section
      id="hero"
      style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--op-border)" }}
    >
      {/* SEO fallback: server-rendered text for crawlers */}
      <noscript>
        <div style={{ padding: "56px 28px", maxWidth: 1240, margin: "0 auto" }}>
          <h1>Subodh KC - Enterprise AI Advisor & AI Systems Architect</h1>
          <p>Turn consequential AI decisions into defensible operating choices.</p>
          <p>
            I expose hidden constraints and opportunities, pressure-test material investments, and
            translate qualified decisions into systems, controls, and evidence an organization can operate.
            Former Fortune 100 Core Team Lead. Founder of HAIEC and KestrelVoice. Dallas-based.
          </p>
          <ul>
            <li>16+ years across software, infrastructure, program delivery and AI systems</li>
            <li>83+ projects delivered across enterprise, client and founder-led work</li>
            <li>53 enterprise applications under core team / portfolio leadership</li>
            <li>50K+ npm + PyPI installs across public open-source packages</li>
          </ul>
          <p>
            <a href="/diagnostics">Start a Diagnostic</a> | <a href="/portfolio">Inspect Selected Work</a> | <a href="/contact?subject=executive-decision">Discuss an Executive Decision</a>
          </p>
        </div>
      </noscript>

      {/* Interactive client-rendered hero */}
      <HeroInteractive />
    </section>
  );
}
