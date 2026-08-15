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
            I turn AI ambiguity into possibilities, evidence-backed decisions, and systems organizations can
            actually operate. Research and critical inquiry, evidence over hype, architecture that survives
            production, program leadership that ships, and continuous improvement after launch.
            Subodh KC, founder of KestrelVoice, founder of HAIEC. Dallas-based.
          </p>
          <ul>
            <li>15 products shipped</li>
            <li>10,000+ npm + pypi installs</li>
            <li>12+ years full-stack experience</li>
          </ul>
          <p>
            <a href="/contact?subject=discuss-ai">Discuss AI</a> | <a href="/portfolio">Selected Work</a>
          </p>
        </div>
      </noscript>

      {/* Interactive client-rendered hero */}
      <HeroInteractive />
    </section>
  );
}
