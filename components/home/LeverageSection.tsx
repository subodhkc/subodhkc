// components/home/LeverageSection.tsx - Where I Create Leverage
"use client";

import { useEffect, useRef, useState } from "react";

const LEVERAGE_AREAS = [
  {
    label: "OPPORTUNITY",
    q: "What became possible?",
    items: [
      "new AI capabilities",
      "workflow improvement",
      "automation",
      "productivity and capacity",
      "customer experience",
      "new services",
      "business model opportunities",
    ],
    copy: "AI changes what is possible faster than most operating plans change. I look for the changes that may materially alter your options.",
  },
  {
    label: "DECISION",
    q: "What deserves action?",
    items: [
      "prioritization",
      "ROI and economics",
      "build vs buy",
      "vendor decisions",
      "sequencing",
      "stop and wait decisions",
      "investment",
    ],
    copy: "Possibility is cheap. The harder question is whether the opportunity deserves money, people and operating complexity.",
  },
  {
    label: "ARCHITECTURE",
    q: "How should it work?",
    items: [
      "agents",
      "RAG",
      "voice",
      "APIs and integrations",
      "data",
      "permissions",
      "multi-tenant systems",
      "human intervention",
      "failure handling",
    ],
    copy: "The system has to work with the organization you actually have, not the one the demo assumes.",
  },
  {
    label: "GOVERNANCE",
    q: "What must be controlled?",
    items: [
      "security",
      "privacy",
      "vendor risk",
      "AI governance",
      "regulations",
      "compliance exposure",
      "evidence",
      "auditability",
      "human accountability",
    ],
    copy: "Governance is not a document. It is the set of controls and accountabilities that survive contact with production.",
  },
  {
    label: "PRODUCTION",
    q: "Can the organization operate it?",
    items: [
      "ownership",
      "implementation sequencing",
      "monitoring",
      "testing",
      "reliability",
      "adoption",
      "escalation",
      "continuous improvement",
    ],
    copy: "A decision that cannot be operated is not a decision. It is a presentation.",
  },
];

export function LeverageSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="leverage"
      ref={sectionRef}
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "80px 28px 60px",
      }}
    >
      {/* Section header */}
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
        03 / where I create leverage
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--fg)",
          maxWidth: 800,
        }}
      >
        I work across the decision, not one piece of it.
      </h2>

      <p
        style={{
          marginTop: 20,
          fontSize: 17,
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          maxWidth: 680,
        }}
      >
        Most AI advice covers one layer. Strategy without architecture. Architecture without
        governance. Governance without production. The decisions that matter sit across all five.
      </p>

      {/* Continuous path */}
      <div style={{ marginTop: 48 }}>
        {/* Stage selector - horizontal on desktop, vertical on mobile */}
        <div className="leverage-stages" style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--op-border)" }}>
          {LEVERAGE_AREAS.map((area, i) => (
            <button
              key={area.label}
              onClick={() => setActive(i)}
              aria-label={`Select ${area.label} stage`}
              aria-pressed={active === i}
              data-track={`homepage_leverage_${area.label.toLowerCase()}_click`}
              style={{
                appearance: "none",
                background: active === i ? "var(--op-card)" : "transparent",
                border: "none",
                borderBottom: active === i ? "2px solid var(--op-accent)" : "2px solid transparent",
                padding: "14px 16px",
                cursor: "pointer",
                flex: 1,
                textAlign: "left",
                transition: "background .15s, border-color .15s",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: active === i ? "var(--fg)" : "var(--op-muted)",
                fontWeight: active === i ? 600 : 400,
                minWidth: 0,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ display: "block", fontSize: 9, opacity: 0.5, marginBottom: 4 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {area.label}
            </button>
          ))}
        </div>

        {/* Active area content */}
        <div
          style={{
            padding: "32px 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
          }}
          className="leverage-content"
        >
          {/* Left: question + copy */}
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "clamp(22px, 3vw, 32px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: "var(--fg)",
              }}
            >
              {LEVERAGE_AREAS[active].q}
            </h3>
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--text-secondary)",
                maxWidth: 480,
              }}
            >
              {LEVERAGE_AREAS[active].copy}
            </p>
          </div>

          {/* Right: items */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--op-muted)",
                marginBottom: 12,
              }}
            >
              What this covers
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {LEVERAGE_AREAS[active].items.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 0",
                    borderBottom: i < LEVERAGE_AREAS[active].items.length - 1 ? "1px solid var(--op-border)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--op-muted)",
                      width: 20,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--fg)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Closing line */}
      <div
        style={{
          marginTop: 40,
          padding: "24px 0",
          borderTop: "1px solid var(--op-border)",
          fontSize: "clamp(18px, 2.4vw, 24px)",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          lineHeight: 1.4,
          color: "var(--fg)",
          maxWidth: 720,
        }}
      >
        The value is not knowing more about AI.
        <br />
        It is making a better decision about what your organization should do with it.
      </div>

      <style>{`
        @media (max-width: 768px) {
          .leverage-stages {
            flex-direction: column !important;
            border-bottom: none !important;
          }
          .leverage-stages > button {
            border-bottom: 1px solid var(--op-border) !important;
            border-bottom-width: 1px !important;
            flex: 1 1 100% !important;
          }
          .leverage-content {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
