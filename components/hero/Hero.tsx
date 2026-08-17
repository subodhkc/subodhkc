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
          <h1>Subodh KC - AI Advisor & AI Systems Architect</h1>
          <p>From possibility to decision. From decision to production.</p>
          <p>
            I help leaders find AI opportunities worth pursuing, pressure-test important decisions
            before they become expensive, and architect systems that can actually operate.
            Former Fortune 50 Core Team Lead. Founder of HAIEC and KestrelVoice. Dallas-based.
          </p>
          <ul>
            <li>16+ years across software, infrastructure, program delivery and AI systems</li>
            <li>83+ projects delivered across enterprise, client and founder-led work</li>
            <li>53 enterprise applications under core team / portfolio leadership</li>
            <li>12K+ npm + PyPI installs across public open-source packages</li>
          </ul>
          <p>
            <a href="/ai-advisor">Explore AI Advisor</a> | <a href="/portfolio">See Selected Work</a> | <a href="/contact?subject=discuss-ai">Discuss an AI Decision</a>
          </p>
        </div>
      </noscript>

      {/* Interactive client-rendered hero */}
      <HeroInteractive />
    </section>
  );
}
