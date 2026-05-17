// components/hero/Hero.tsx — the kinetic operator hero
"use client";

import * as React from "react";
import { Aurora } from "./Aurora";
import { Constellation } from "./Constellation";
import { Counter } from "./Counter";
import { DotGrid } from "./DotGrid";
import { ShipLog } from "./ShipLog";
import { WordCycle } from "./WordCycle";
import { PRODUCTS } from "@/data/products";

const KPIS = [
  { k: "shipped", v: 15, fmt: { suffix: "" }, sub: "products", live: false },
  { k: "npm + pypi", v: 10000, fmt: { formatK: true, suffix: "+" }, sub: "llmverify installs", live: true },
  { k: "audit pass", v: 100, fmt: { suffix: "%" }, sub: "NYC LL144 + others", live: false },
  { k: "experience", v: 16, fmt: { suffix: "y" }, sub: "full-stack", live: false },
];

export function Hero() {
  return (
    <section id="hero" style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
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
            §00 / personal registry · since 2009
          </span>
          <span>v3.1.0 — May 2026</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(44px, 7.2vw, 96px)",
            lineHeight: 0.96,
            letterSpacing: "-0.04em",
            fontWeight: 600,
            textWrap: "balance",
          }}
        >
          I&nbsp;
          <WordCycle words={["ship", "audit", "deploy", "sign"]} />
          <br />
          software for&nbsp;
          <span style={{ position: "relative", display: "inline-block" }}>
            the regulated.
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
            color: "var(--muted)",
            textWrap: "pretty",
          }}
        >
          Subodh KC — former Fortune 50 AI Strategy CTL, founder of HAIEC, Dallas-based. Everything below is
          shipped: production SaaS, packages on npm and PyPI running in real apps, free desktop tools, and OSS
          for AI governance.
        </p>

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
                  fontSize: 10.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
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
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{s.sub}</div>
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
            fig.01 — shipped surface
          </span>
          <span>click a node ↓</span>
        </div>

        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <Constellation products={PRODUCTS} />
        </div>
      </div>

      <ShipLog />
    </section>
  );
}
