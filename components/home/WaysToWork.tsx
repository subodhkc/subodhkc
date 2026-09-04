import Link from "next/link";

const RELATIONSHIPS = [
  {
    label: "DIAGNOSTIC INTENSIVES",
    marker: "Preferred entry",
    tagline: "Expose what the current framing cannot see.",
    desc: "A bounded intervention to surface hidden opportunity, operating friction, value leakage, constraints, decision conflict, and untested assumptions.",
    items: ["Decision-grade diagnostic", "Material constraints and options", "Priority actions and stop conditions"],
    cta: "Start a Diagnostic",
    href: "/diagnostics",
  },
  {
    label: "EXECUTIVE AI ADVISORY",
    marker: "Continuing judgment",
    tagline: "Resolve interconnected decisions with context intact.",
    desc: "Independent counsel across opportunity, investment, vendor, architecture, roadmap, operating model, security, and governance decisions.",
    items: ["Executive working sessions", "Decision and evidence briefs", "Roadmap and architecture pressure-testing"],
    cta: "Explore Executive Advisory",
    href: "/advisory",
  },
  {
    label: "ARCHITECTURE & IMPLEMENTATION",
    marker: "Qualified execution",
    tagline: "Build only after the decision earns implementation.",
    desc: "System architecture, integrations, agents, RAG, voice, data, permissions, failure handling, deployment, and operational handoff.",
    items: ["Production architecture", "Implementation sequencing", "Inspectable operating controls"],
    cta: "Explore Architecture",
    href: "/services",
  },
  {
    label: "AI ASSURANCE",
    marker: "Evidence-bound",
    tagline: "Establish what the available evidence supports.",
    desc: "Founder-led HAIEC engagements for consequential AI systems that require a bounded evaluation, material mismatch analysis, and decision receipt.",
    items: ["Evaluated scope", "Evidence coverage and gaps", "Bounded assurance decision"],
    cta: "Initiate an Assurance POC",
    href: "/solutions/haiec",
  },
];

export function WaysToWork() {
  return (
    <section id="work-with-me" style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 28px 60px", borderTop: "1px solid var(--op-border)" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--op-accent)", marginBottom: 16 }}>
        04 / engagement architecture
      </div>
      <h2 style={{ margin: 0, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 600, letterSpacing: "-.03em", lineHeight: 1.1 }}>
        Diagnose before prescribing. Build after the decision earns it.
      </h2>
      <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: 720 }}>
        Each path produces a different kind of certainty. The engagement begins at the point where your decision is currently constrained.
      </p>
      <div style={{ marginTop: 26, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".08em", color: "var(--op-muted)" }}>
        DIAGNOSE → ADVISE → ARCHITECT / BUILD → ASSURE
      </div>

      <div className="ways-grid" style={{ marginTop: 30, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", border: "1px solid var(--op-border)", borderRadius: 12, overflow: "hidden" }}>
        {RELATIONSHIPS.map((rel, index) => (
          <article key={rel.label} style={{ padding: "30px 26px", borderRight: index % 2 === 0 ? "1px solid var(--op-border)" : "none", borderBottom: index < 2 ? "1px solid var(--op-border)" : "none", background: index === 0 ? "var(--op-card)" : "transparent" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--op-accent)" }}>{rel.marker}</div>
            <h3 style={{ margin: "12px 0 0", fontSize: 18, letterSpacing: "-.01em" }}>{rel.label}</h3>
            <p style={{ margin: "9px 0 0", fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--fg)" }}>{rel.tagline}</p>
            <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{rel.desc}</p>
            <ul style={{ margin: "18px 0 24px", padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
              {rel.items.map((item) => <li key={item} style={{ fontSize: 12.5, color: "var(--text-secondary)" }}><span style={{ color: "var(--op-accent)", marginRight: 8 }}>◆</span>{item}</li>)}
            </ul>
            <Link href={rel.href} style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--op-border)", paddingBottom: 2 }}>{rel.cta} →</Link>
          </article>
        ))}
      </div>
      <p style={{ marginTop: 20, fontSize: 12.5, color: "var(--op-muted)", lineHeight: 1.55 }}>
        Productized offers for eligible nonprofit organizations and active HEB Chamber of Commerce members are available through the private member route.
      </p>
      <style>{`@media (max-width: 760px) { .ways-grid { grid-template-columns: 1fr !important; } .ways-grid article { border-right: none !important; border-bottom: 1px solid var(--op-border) !important; } .ways-grid article:last-child { border-bottom: none !important; } }`}</style>
    </section>
  );
}
