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
          <h1>I Advise, Architect, Deploy and Govern production AI systems.</h1>
          <p>
            I help organizations see where AI can create advantage, turn the right opportunities into working
            systems, and put the right controls around them to operate with confidence. From agentic workflows,
            voice AI, RAG and MCP integrations to security, governance, and enterprise-scale delivery.
            Subodh KC, founder of KestrelVoice, founder of HAIEC. Dallas-based.
          </p>
          <ul>
            <li>15 products shipped</li>
            <li>10,000+ npm + pypi installs</li>
            <li>12+ years full-stack experience</li>
          </ul>
          <p>
            <a href="https://calendly.com/subodhkc/30min">Discuss an AI System</a> | <a href="https://calendly.com/subodhkc/30min">Work With Me</a>
          </p>
        </div>
      </noscript>

      {/* Interactive client-rendered hero */}
      <HeroInteractive />
    </section>
  );
}
