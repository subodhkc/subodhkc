"use client";

import { Aurora } from "./Aurora";
import { Constellation } from "./Constellation";
import { Counter } from "./Counter";
import { DotGrid } from "./DotGrid";
import { PRODUCTS } from "@/data/products";

const KPIS = [
  { k: "products", v: 18, fmt: { suffix: "" }, sub: "shipped", live: false },
  { k: "installs", v: 10000, fmt: { formatK: true, suffix: "+" }, sub: "npm + pypi", live: true },
  { k: "programs", v: 50, fmt: { suffix: "+" }, sub: "AI delivered", live: false },
];

export function HeroInteractive() {
  return (
    <>
      <DotGrid />
      <Aurora />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "56px 28px 30px" }}>
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
            00 / soo-BOHD KAY-see
          </span>
          <span>v3.3.0 - Aug 2026</span>
        </div>

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

        <p
          style={{
            maxWidth: 720,
            marginTop: 18,
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
            textWrap: "pretty",
          }}
        >
          I turn AI ambiguity into possibilities, evidence-backed decisions, and systems organizations can
          actually operate. Research and critical inquiry, evidence over hype, architecture that survives
          production, program leadership that ships, and continuous improvement after launch.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <a
            href="/contact?subject=discuss-ai"
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
            Discuss AI →
          </a>
          <a
            href="#method"
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
            See how I work ↓
          </a>
        </div>

        {/* KPI bar */}
        <div
          className="hero-kpi-grid"
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid var(--op-border)",
            borderBottom: "1px solid var(--op-border)",
          }}
        >
          {KPIS.map((s, i) => (
            <div
              key={s.k}
              style={{
                padding: "18px 22px 18px",
                borderLeft: i === 0 ? "none" : "1px solid var(--op-border)",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {s.live && (
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--op-accent)",
                      animation: "hero-pulse 1.4s ease-in-out infinite",
                    }}
                  />
                )}
                {s.k}
              </div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  marginTop: 8,
                  lineHeight: 1,
                }}
              >
                <Counter value={s.v} {...(s.fmt as any)} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--op-muted)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 1, background: "var(--op-border)" }} />
            fig.01 - deployed systems
          </span>
          <span>click a node ↓</span>
        </div>

        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Constellation products={PRODUCTS} />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-kpi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hero-kpi-grid > div:nth-child(odd) {
            border-left: none !important;
          }
          .hero-kpi-grid > div:nth-child(3) {
            border-top: 1px solid var(--op-border);
          }
          .hero-kpi-grid > div:nth-child(4) {
            border-top: 1px solid var(--op-border);
          }
        }
      `}</style>
    </>
  );
}
