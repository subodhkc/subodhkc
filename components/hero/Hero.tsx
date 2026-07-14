// components/hero/Hero.tsx — server component wrapper for SEO + interactive hero
import { HeroInteractive } from "./HeroInteractive";

export function Hero() {
  return (
    <section
      id="hero"
      style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}
    >
      {/* SEO fallback: server-rendered text for crawlers */}
      <noscript>
        <div style={{ padding: "56px 28px", maxWidth: 1240, margin: "0 auto" }}>
          <h1>I Advise, Architect, Deploy and Govern production AI systems.</h1>
          <p>
            From agentic workflows, voice AI, RAG and MCP integrations to AI compliance certifications and
            enterprise-scale delivery. Subodh KC, former Fortune 50 AI Strategy CTL, founder of KestrelVoice,
            co-founder of HAIEC. Dallas-based.
          </p>
          <ul>
            <li>15 products shipped</li>
            <li>10,000+ npm + pypi installs</li>
            <li>100% audit pass rate</li>
            <li>16 years full-stack experience</li>
          </ul>
          <p>
            <a href="/contact">Discuss an AI System</a> | <a href="/contact">Hire Subodh KC</a>
          </p>
        </div>
      </noscript>

      {/* Interactive client-rendered hero */}
      <HeroInteractive />
    </section>
  );
}
