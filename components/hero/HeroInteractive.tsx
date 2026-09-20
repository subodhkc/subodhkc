"use client";

import { Aurora } from "./Aurora";
import { ConstellationBackground } from "./ConstellationBackground";
import { ActionConsequenceAtlas } from "@/components/enterprise/ActionConsequenceAtlas";

const PROOF_POINTS = [
  { v: "16+", sub: "years", detail: "software, infrastructure, programs, AI systems" },
  { v: "83+", sub: "projects delivered", detail: "enterprise, client, founder-led" },
  { v: "53", sub: "enterprise applications", detail: "core team / portfolio leadership" },
  { v: "50K+", sub: "npm + pypi installs", detail: "public technical work" },
];

export function HeroInteractive() {
  return (
    <>
      <ConstellationBackground />
      <Aurora />

      <div className="hero-content-layer" style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "56px 28px 40px", pointerEvents: "none" }}>
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
          Enterprise AI Advisor &amp;
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
          Turn consequential AI decisions into defensible operating choices.
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
          I expose hidden constraints and opportunities, pressure-test material investments, and
          translate qualified decisions into systems, controls, and evidence an organization can operate.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", alignItems: "center" }}>
          <a
            href="/diagnostics"
            data-track="homepage_diagnostic_click"
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
            Start a Diagnostic →
          </a>
          <a
            href="/contact?subject=executive-decision"
            data-track="homepage_executive_decision_click"
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
            Discuss an Executive Decision
          </a>
          <a
            href="/portfolio"
            data-track="homepage_work_click"
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
            Inspect Selected Work
          </a>
        </div>

        {/* Compact product proof: one action, its authority, and its consequence */}
        <div style={{ marginTop: 36 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--op-muted)",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ width: 18, height: 1, background: "var(--op-border)" }} />
            fig.01 - action &amp; access preview
          </div>
          <ActionConsequenceAtlas compact />
        </div>

        {/* Proof rail */}
        <div
          className="hero-proof-grid"
          style={{
            marginTop: 36,
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

        <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--op-muted)", letterSpacing: "0.04em" }}>
          Former Fortune 100 Core Team Lead · Founder of HAIEC + KestrelVoice · Dallas-Fort Worth
        </div>
      </div>

      <style>{`
        .hero-content-layer a, .hero-content-layer button { pointer-events: auto; }
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
          .hero-version {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
