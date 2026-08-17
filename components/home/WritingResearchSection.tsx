// components/home/WritingResearchSection.tsx - compressed writing + research
import Link from "next/link";
import { PAPERS } from "@/data/papers";
import { FRAMEWORKS } from "@/data/frameworks";

// Select 3 pieces that demonstrate range: strategy, production, governance
const SELECTED = [
  {
    type: "RESEARCH",
    title: "The Instruction Stack Audit Framework (ISAF)",
    venue: "Zenodo · 2025",
    summary: "A deterministic audit framework for inspecting LLM instruction stacks, published with reproducible methodology.",
    href: "/research",
    track: "homepage_research_click",
  },
  {
    type: "FRAMEWORK",
    title: "Cognitive Systems Management 2.0",
    venue: "Published framework · 2025-2026",
    summary: "Four governance domains. Six execution functions. A practitioner operating model connecting enterprise, project, code, and user governance.",
    href: "/cognitive-systems-management",
    track: "homepage_csm_click",
  },
  {
    type: "ARTICLE",
    title: "Why Enterprise AI Integration Strategies Fail",
    venue: "Design Bootcamp · 2025",
    summary: "Field analysis of where enterprise AI integration breaks between strategy and production.",
    href: "/blog",
    track: "homepage_writing_click",
  },
];

export function WritingResearchSection() {
  return (
    <section
      id="writing"
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
        07 / writing + research
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
        I publish the reasoning, not just the conclusions.
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
        {PAPERS.length} papers and {FRAMEWORKS.length} frameworks across AI strategy, production
        architecture, and governance.
      </p>

      {/* Selected pieces */}
      <div
        className="writing-grid"
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          border: "1px solid var(--op-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {SELECTED.map((piece, i) => (
          <Link
            key={piece.title}
            href={piece.href}
            data-track={piece.track}
            style={{
              padding: "24px 20px",
              borderLeft: i === 0 ? "none" : "1px solid var(--op-border)",
              textDecoration: "none",
              color: "var(--fg)",
              display: "flex",
              flexDirection: "column",
              transition: "background .15s",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--op-accent)",
                marginBottom: 12,
              }}
            >
              {piece.type}
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
              {piece.title}
            </h3>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--op-muted)", marginBottom: 12 }}>
              {piece.venue}
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.55, flex: 1 }}>
              {piece.summary}
            </p>
          </Link>
        ))}
      </div>

      {/* Magazine + Insights reference */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "var(--op-muted)" }}>
            <span style={{ color: "var(--fg)" }}>AI That Works Magazine</span> · independent field magazine, free to read.
          </span>
        </div>
        <Link
          href="/insights"
          data-track="homepage_insights_click"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            border: "1px solid var(--op-border)",
            borderRadius: 999,
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--fg)",
            textDecoration: "none",
          }}
        >
          Explore Insights →
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .writing-grid {
            grid-template-columns: 1fr !important;
          }
          .writing-grid > a {
            border-left: none !important;
            border-top: 1px solid var(--op-border) !important;
          }
          .writing-grid > a:first-child {
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  );
}
