// components/home/WaysToWork.tsx - increasing depth of involvement
import Link from "next/link";

const RELATIONSHIPS = [
  {
    label: "AI ADVISOR DESK",
    price: "$99/month",
    tagline: "Someone watching and thinking with you.",
    desc: "For leaders who want ongoing context around opportunities, advancements, vendors, architecture, risk, regulation, and important AI decisions.",
    items: [
      "Ongoing watch across six territories",
      "Organizational AI Context Profile",
      "Personalized Watchlist",
      "Human advisory access",
      "Activation call included",
    ],
    cta: "Explore AI Advisor",
    href: "/ai-advisor",
    track: "homepage_ai_advisor_click",
    badge: "Easiest entry point",
  },
  {
    label: "FRACTIONAL AI ADVISOR",
    price: "$1,250/month",
    tagline: "Someone working through the decisions with you.",
    desc: "For organizations with multiple interconnected AI decisions affecting strategy, investment, vendors, architecture, roadmap, governance, and implementation.",
    items: [
      "Two monthly working sessions",
      "Priority async advisory",
      "Decision and Opportunity Workspace",
      "Monthly Decision and Opportunity Brief",
      "Vendor, roadmap, and architecture review",
      "Selected decision artifacts",
    ],
    cta: "Explore Fractional Advisory",
    href: "/advisory",
    track: "homepage_fractional_click",
    badge: "When stakes are higher",
  },
  {
    label: "AI SYSTEMS ARCHITECTURE",
    price: "Scoped",
    tagline: "For decisions that have earned implementation.",
    desc: "Architecture, integrations, production design, agent/RAG/voice systems, data, controls, and deployment. The decision has been made. Now it has to work.",
    items: [
      "Architecture and production design",
      "Agent, RAG, and voice systems",
      "Integrations and data",
      "Controls and deployment",
      "Implementation sequencing",
    ],
    cta: "Explore Architecture & Implementation",
    href: "/services",
    track: "homepage_architecture_click",
    badge: "When the decision is made",
  },
];

export function WaysToWork() {
  return (
    <section
      id="work-with-me"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "80px 28px 60px",
        borderTop: "1px solid var(--op-border)",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--op-accent)",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ width: 18, height: 1, background: "var(--op-accent)" }} />
        04 / ways to work with me
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--fg)",
        }}
      >
        Ways to work with me
      </h2>

      <p
        style={{
          marginTop: 16,
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          maxWidth: 600,
        }}
      >
        Increasing depth of involvement, not Bronze/Silver/Gold tiers.
      </p>

      {/* Progression arrow */}
      <div
        style={{
          marginTop: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--op-muted)",
        }}
      >
        <span>ADVISOR</span>
        <span style={{ color: "var(--op-accent)" }}>→</span>
        <span>FRACTIONAL</span>
        <span style={{ color: "var(--op-accent)" }}>→</span>
        <span>ARCHITECT / IMPLEMENT</span>
      </div>

      {/* Cards */}
      <div
        className="ways-grid"
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          border: "1px solid var(--op-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {RELATIONSHIPS.map((rel, i) => (
          <div
            key={rel.label}
            style={{
              padding: "28px 24px",
              borderLeft: i === 0 ? "none" : "1px solid var(--op-border)",
              background: i === 1 ? "var(--op-card)" : "transparent",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid var(--op-border)",
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--op-muted)",
                marginBottom: 16,
                width: "fit-content",
              }}
            >
              {rel.badge}
            </div>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                color: "var(--fg)",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {rel.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)", marginBottom: 8 }}>
              {rel.price}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--fg)",
                margin: "0 0 12px",
                lineHeight: 1.5,
                fontStyle: "italic",
                fontFamily: "var(--font-serif)",
              }}
            >
              {rel.tagline}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55 }}>
              {rel.desc}
            </p>

            <ul style={{ listStyle: "none", margin: "0 0 20px", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              {rel.items.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--op-accent)", fontSize: 10, marginTop: 2, flexShrink: 0 }}>◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href={rel.href}
              data-track={rel.track}
              style={{
                marginTop: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                background: i === 1 ? "var(--fg)" : "transparent",
                color: i === 1 ? "var(--bg)" : "var(--fg)",
                border: i === 1 ? "none" : "1px solid var(--op-border)",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: "0.04em",
                textDecoration: "none",
                transition: "opacity .15s",
                width: "fit-content",
              }}
            >
              {rel.cta} →
            </Link>
          </div>
        ))}
      </div>

      {/* AI Work Order note */}
      <p
        style={{
          marginTop: 20,
          fontSize: 13,
          color: "var(--op-muted)",
          maxWidth: 600,
          lineHeight: 1.5,
        }}
      >
        Members can commission AI Work Orders ($500) when one opportunity
        deserves focused investigation.
      </p>

      <style>{`
        @media (max-width: 860px) {
          .ways-grid {
            grid-template-columns: 1fr !important;
          }
          .ways-grid > div {
            border-left: none !important;
            border-top: 1px solid var(--op-border) !important;
          }
          .ways-grid > div:first-child {
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  );
}
