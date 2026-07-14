"use client";

import * as React from "react";
import { Aurora } from "./Aurora";
import { Constellation } from "./Constellation";
import { Counter } from "./Counter";
import { DotGrid } from "./DotGrid";
import { ShipLog } from "./ShipLog";
import { WordCycle } from "./WordCycle";
import { HeroCTAModal } from "../HeroCTAModal";
import { PRODUCTS } from "@/data/products";

const KPIS = [
  { k: "products", v: 15, fmt: { suffix: "" }, sub: "shipped", live: false },
  { k: "installs", v: 10000, fmt: { formatK: true, suffix: "+" }, sub: "npm + pypi", live: true },
  { k: "compliance", v: 100, fmt: { suffix: "%" }, sub: "audit pass", live: false },
  { k: "experience", v: 16, fmt: { suffix: "y" }, sub: "full-stack", live: false },
];

export function HeroInteractive() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<"discuss" | "hire">("discuss");

  const openDiscuss = () => {
    setModalType("discuss");
    setModalOpen(true);
  };

  const openHire = () => {
    setModalType("hire");
    setModalOpen(true);
  };

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
            color: "var(--muted)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 1, background: "var(--accent)", display: "inline-block" }} />
            §00 / AI systems architect · since 2009
          </span>
          <span>v3.2.0 — Jul 2026</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(44px, 7.2vw, 96px)",
            lineHeight: 0.96,
            letterSpacing: "-0.04em",
            fontWeight: 600,
            textWrap: "balance",
            color: "var(--fg)",
          }}
        >
          I&nbsp;
          <WordCycle words={["Advise", "Architect", "Deploy", "Govern"]} />
          <br />
          production AI systems.
          <span style={{ position: "relative", display: "inline-block" }}>
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
                color: "var(--accent)",
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
            marginTop: 26,
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--text-secondary)",
            textWrap: "pretty",
          }}
        >
          From agentic workflows, voice AI, RAG and MCP integrations to AI compliance certifications and
          enterprise-scale delivery. Subodh KC, former Fortune 50 AI Strategy CTL, founder of KestrelVoice,
          co-founder of HAIEC. Dallas-based.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <button
            onClick={openDiscuss}
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
            }}
          >
            Discuss an AI System →
          </button>
          <button
            onClick={openHire}
            style={{
              appearance: "none",
              background: "transparent",
              color: "var(--fg)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "12px 24px",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              transition: "border-color .15s, color .15s",
            }}
          >
            Hire Subodh KC
          </button>
        </div>

        {/* KPI bar */}
        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {KPIS.map((s, i) => (
            <div
              key={s.k}
              style={{
                padding: "18px 22px 18px",
                borderLeft: i === 0 ? "none" : "1px solid var(--border)",
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
                      background: "var(--accent)",
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
            color: "var(--muted)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 18, height: 1, background: "var(--border)" }} />
            fig.01 — deployed systems
          </span>
          <span>click a node ↓</span>
        </div>

        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Constellation products={PRODUCTS} />
        </div>
      </div>

      <ShipLog />

      <HeroCTAModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType={modalType}
      />
    </>
  );
}
