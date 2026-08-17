"use client";

import { Aurora } from "./Aurora";
import { DotGrid } from "./DotGrid";

const PROOF_POINTS = [
  { v: "16+", sub: "years", detail: "software, infrastructure, programs, AI systems" },
  { v: "83+", sub: "projects delivered", detail: "enterprise, client, founder-led" },
  { v: "53", sub: "enterprise applications", detail: "core team / portfolio leadership" },
  { v: "12K+", sub: "npm + pypi installs", detail: "public technical work" },
];

const LEVERAGE_PATH = [
  { label: "POSSIBILITY", q: "What became possible?" },
  { label: "DECISION", q: "What deserves action?" },
  { label: "ARCHITECTURE", q: "How should it work?" },
  { label: "PRODUCTION", q: "Can it operate?" },
];

const EVIDENCE_NODES = [
  { label: "HAIEC", href: "/solutions/haiec" },
  { label: "Kestrel", href: "/solutions/kestrelvoice" },
  { label: "MCP", href: "/products/mcp-tenant-isolation" },
  { label: "llmverify", href: "/products/llmverify" },
];

export function HeroInteractive() {
  return (
    <>
      <DotGrid />
      <Aurora />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "56px 28px 40px" }}>
        {/* Header line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            marginBottom: 28,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--op-muted)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 1, background: "var(--op-accent)", display: "inline-block" }} />
            SUBODH KC · AI ADVISOR + AI SYSTEMS ARCHITECT
          </span>
          <span style={{ display: "none" }} className="hero-version">v4.0</span>
        </div>

        {/* H1 */}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(40px, 6.4vw, 84px)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            fontWeight: 600,
            textWrap: "balance",
            color: "var(--fg)",
          }}
        >
          AI Advisor &amp;
          <br />
          <span style={{ position: "relative", display: "inline-block" }}>
            AI Systems Architect.
            <svg
              aria-hidden
              viewBox="0 0 400 16"
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "-0.04em",
                width: "100%",
                height: "0.16em",
                color: "var(--op-accent)",
              }}
            >
              <path
                d="M 4 10 Q 100 2 200 8 T 396 6"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: 600,
                  animation: "underline-draw 1.2s ease-out 0.4s forwards",
                }}
              />
            </svg>
          </span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            maxWidth: 720,
            marginTop: 24,
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(19px, 2.4vw, 26px)",
            lineHeight: 1.4,
            color: "var(--fg)",
            textWrap: "balance",
          }}
        >
          From possibility to decision.
          <br />
          From decision to production.
        </p>

        {/* Supporting copy */}
        <p
          style={{
            maxWidth: 680,
            marginTop: 18,
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
            textWrap: "pretty",
          }}
        >
          I help leaders find AI opportunities worth pursuing, pressure-test important decisions
          before they become expensive, and architect systems that can actually operate.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="/ai-advisor"
            data-track="homepage_ai_advisor_click"
            style={{
              appearance: "none",
              background: "var(--fg)",
              color: "var(--bg)",
              border: "none",
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              transition: "opacity .15s",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Explore AI Advisor →
          </a>
          <a
            href="/portfolio"
            data-track="homepage_work_click"
            style={{
              appearance: "none",
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--op-border)",
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color .15s, color .15s",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            See Selected Work
          </a>
          <a
            href="/contact?subject=discuss-ai"
            data-track="homepage_discuss_ai_click"
            style={{
              appearance: "none",
              background: "transparent",
              color: "var(--op-muted)",
              border: "none",
              padding: "12px 8px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Discuss an AI Decision
          </a>
        </div>

        {/* Proof rail */}
        <div
          className="hero-proof-grid"
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--op-border)",
            borderBottom: "1px solid var(--op-border)",
          }}
        >
          {PROOF_POINTS.map((s, i) => (
            <div
              key={s.sub}
              style={{
                padding: "18px 18px",
                borderLeft: i === 0 ? "none" : "1px solid var(--op-border)",
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginTop: 8,
                }}
              >
                {s.sub}
              </div>
              <div style={{ fontSize: 11, color: "var(--op-muted)", marginTop: 4, lineHeight: 1.4 }}>
                {s.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Supporting line */}
        <div
          style={{
            marginTop: 14,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--op-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Former Fortune 50 Core Team Lead · Founder of HAIEC + KestrelVoice
        </div>

        {/* Leverage path visual */}
        <div style={{ marginTop: 36, marginBottom: 8 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--op-muted)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 18, height: 1, background: "var(--op-border)" }} />
            fig.01 - the decision path
          </div>

          <div className="hero-leverage-path" style={{ display: "flex", alignItems: "stretch", gap: 0, flexWrap: "wrap" }}>
            {LEVERAGE_PATH.map((stage, i) => (
              <div key={stage.label} style={{ display: "flex", alignItems: "stretch", flex: "1 1 0", minWidth: 0 }}>
                <div
                  style={{
                    flex: 1,
                    padding: "16px 14px",
                    background: i === 0 ? "var(--op-card)" : "transparent",
                    borderTop: "1px solid var(--op-border)",
                    borderBottom: "1px solid var(--op-border)",
                    borderLeft: i === 0 ? "1px solid var(--op-border)" : "none",
                    borderRight: "1px solid var(--op-border)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "var(--op-muted)",
                      marginBottom: 6,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.4 }}>
                    {stage.q}
                  </div>
                </div>
                {i < LEVERAGE_PATH.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 2px",
                      color: "var(--op-accent)",
                      flexShrink: 0,
                    }}
                    className="hero-path-arrow"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7 H11" />
                      <path d="M9 5 L11 7 L9 9" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Evidence nodes */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--op-muted)",
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ opacity: 0.6 }}>evidence:</span>
            {EVIDENCE_NODES.map((node, i) => (
              <span key={node.label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <a
                  href={node.href}
                  data-track={`homepage_${node.label.toLowerCase()}_click`}
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    borderBottom: "1px dotted var(--op-border)",
                    paddingBottom: 1,
                  }}
                >
                  {node.label}
                </a>
                {i < EVIDENCE_NODES.length - 1 && <span style={{ opacity: 0.3 }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-proof-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-proof-grid > div:nth-child(odd) {
            border-left: none !important;
          }
          .hero-proof-grid > div:nth-child(3),
          .hero-proof-grid > div:nth-child(4) {
            border-top: 1px solid var(--op-border);
          }
          .hero-leverage-path {
            flex-direction: column !important;
          }
          .hero-leverage-path > div {
            flex: 1 1 100% !important;
          }
          .hero-path-arrow {
            transform: rotate(90deg);
            padding: 4px 0 !important;
          }
          .hero-version {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
