// components/writing/WritingSection.tsx
"use client";

import * as React from "react";
import { PAPERS } from "@/data/papers";
import { FRAMEWORKS } from "@/data/frameworks";

function Arrow({ kind = "right" }: { kind?: "right" | "ext" }) {
  if (kind === "ext") {
    return (
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8 L8 4" />
        <path d="M5 4 H8 V7" />
      </svg>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6 H9" />
      <path d="M7 4 L9 6 L7 8" />
    </svg>
  );
}

export function WritingSection() {
  const [tab, setTab] = React.useState<"papers" | "frameworks">("papers");

  return (
    <section id="writing" style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 60px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          paddingBottom: 16,
          borderBottom: "1px solid var(--border)",
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          §02
        </span>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--fg)" }}>
          Writing & research
        </h2>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
          / {tab === "papers" ? `${PAPERS.length} publications` : `${FRAMEWORKS.length} frameworks`}
        </span>

        <div
          role="tablist"
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: 3,
            background: "var(--card)",
          }}
        >
          {(["papers", "frameworks"] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              style={{
                appearance: "none",
                border: "none",
                background: tab === k ? "var(--fg)" : "transparent",
                color: tab === k ? "var(--bg)" : "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                padding: "5px 13px",
                borderRadius: 999,
                cursor: "pointer",
                transition: "background .12s, color .12s",
              }}
            >
              {k === "papers" ? "publications" : "frameworks"}
            </button>
          ))}
        </div>

        <a
          href="/research"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-secondary)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          /research <Arrow kind="right" />
        </a>
      </div>

      {tab === "papers" ? (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {PAPERS.map((p, i) => (
            <li
              key={i}
              style={{
                borderTop: i === 0 ? "1px solid var(--border)" : "none",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr auto",
                  gap: 24,
                  padding: "22px 14px 22px 18px",
                  alignItems: "flex-start",
                  position: "relative",
                  color: "var(--fg)",
                  transition: "background .12s",
                }}
              >
                <span
                  className="paper-rule"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    width: 2,
                    height: 0,
                    background: "var(--accent)",
                    transform: "translateY(-50%)",
                    transition: "height .35s cubic-bezier(.2,.7,.2,1)",
                  }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.06em",
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    paddingTop: 3,
                  }}
                >
                  <div>{p.year}</div>
                  <div style={{ marginTop: 2, color: "var(--accent)" }}>{p.venue}</div>
                </div>
                <div>
                  {i === 0 && (
                    <div style={{ marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9.5,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "2px 7px",
                          borderRadius: 999,
                          background: "color-mix(in oklab, var(--accent) 16%, transparent)",
                          color: "var(--accent)",
                          border: "1px solid color-mix(in oklab, var(--accent) 40%, transparent)",
                        }}
                      >
                        ◆ Latest
                      </span>
                    </div>
                  )}
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.3,
                      textWrap: "balance",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 15,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {p.subtitle}
                  </p>
                  <p
                    style={{
                      margin: "12px 0 0",
                      fontSize: 13.5,
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                      maxWidth: 760,
                      textWrap: "pretty",
                    }}
                  >
                    {p.summary}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {p.topics.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10.5,
                          letterSpacing: "0.02em",
                          padding: "3px 9px",
                          borderRadius: 999,
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--accent)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                    paddingTop: 3,
                  }}
                >
                  View paper <Arrow kind="ext" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: 0,
          }}
        >
          {FRAMEWORKS.map((f, i) => (
            <li
              key={i}
              style={{
                padding: "22px 22px 24px",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                borderLeft: i % 2 === 1 ? "1px solid var(--border)" : "none",
                marginLeft: i % 2 === 1 ? -1 : 0,
                marginTop: i > 1 ? -1 : 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {f.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                      color: "var(--accent)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      fontSize: 10,
                    }}
                  >
                    {f.status}
                  </span>
                  <span>{f.years}</span>
                </div>
              </div>
              <p
                style={{
                  margin: "12px 0 14px",
                  fontSize: 13.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  textWrap: "pretty",
                }}
              >
                {f.summary}
              </p>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: 8,
                }}
              >
                Key contributions
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {f.points.map((pt, k) => (
                  <li
                    key={k}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 13,
                      color: "var(--fg)",
                    }}
                  >
                    <span
                      style={{
                        marginTop: 7,
                        width: 4,
                        height: 4,
                        background: "var(--accent)",
                        flexShrink: 0,
                        transform: "rotate(45deg)",
                      }}
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
