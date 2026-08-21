// components/home/SystemsSection.tsx - selected systems + open source proof
import Link from "next/link";

const SYSTEMS = [
  {
    name: "HAIEC",
    status: "PRODUCT / ACTIVE",
    statusColor: "var(--op-accent)",
    desc: "AI governance, assurance and evidence system.",
    proves: "Governance architecture, deterministic checks, evidence, AI risk and control thinking.",
    href: "/solutions/haiec",
    track: "homepage_haiec_click",
    note: "Not legal certification or guaranteed compliance.",
  },
  {
    name: "KestrelVoice",
    status: "PRODUCT / LIVE",
    statusColor: "var(--op-accent)",
    desc: "Voice AI and workflow operations.",
    proves: "Production voice systems, real-time AI, workflow integration, human escalation, scheduling and operations.",
    href: "/solutions/kestrelvoice",
    track: "homepage_kestrel_click",
    note: undefined,
  },
];

// HAIEC Developer Security family cards
const FAMILY_CARDS = [
  {
    role: "SOURCE SECURITY",
    badge: "NEW · RELEASED",
    name: "AI AppSec",
    tagline: "Evidence-backed AppSec for AI applications and agents.",
    body: "Audit AI/LLM source code with explicit coverage, reproducible findings and tamper-evident scan evidence.",
    proof: ["122 detectors", "79 security checks", "MCP v2", "MIT"],
    identity: [
      ["Product", "AI AppSec"],
      ["Version", "v0.1.0"],
      ["GitHub", "subodhkc/ai-appsec"],
      ["npm", "ai-appsec"],
      ["MCP Registry", "io.github.subodhkc/ai-appsec"],
      ["CLI", "ai-appsec"],
      ["MCP tool", "scan_ai_security"],
    ],
    primaryHref: "/products/ai-appsec",
    primaryLabel: "Explore AI AppSec",
    secondaryHref: "https://github.com/subodhkc/ai-appsec",
    secondaryLabel: "GitHub",
    track: "homepage_ai_appsec_click",
  },
  {
    role: "BOUNDARY SECURITY",
    badge: "NEW · RELEASED",
    name: "MCP Tenant Isolation",
    tagline: "Catch cross-tenant leaks before production.",
    body: "57 deterministic rules for tenant boundaries across multi-tenant SaaS and MCP server code.",
    proof: ["57 rules", "15 MCP-specific", "MCP v2", "MIT"],
    identity: [
      ["Product", "MCP Tenant Isolation"],
      ["Version", "v2.0.0"],
      ["GitHub", "subodhkc/mcp-tenant-isolation"],
      ["npm", "mcp-tenant-isolation"],
      ["MCP Registry", "io.github.subodhkc/mcp-tenant-isolation"],
      ["CLI", "mti"],
      ["MCP tool", "scan_tenant_isolation"],
    ],
    primaryHref: "/products/mcp-tenant-isolation",
    primaryLabel: "Explore Tenant Isolation",
    secondaryHref: "https://github.com/subodhkc/mcp-tenant-isolation",
    secondaryLabel: "GitHub",
    track: "homepage_tenant_isolation_click",
  },
];

const LLMVERIFY_CARD = {
  role: "MODEL INTERACTION / RUNTIME",
  badge: "RUNTIME SIBLING",
  name: "llmverify",
  tagline: "Verify model interactions before they reach users.",
  body: "Local-first prompt-injection checks, PII redaction, hallucination risk signals, JSON repair and runtime monitoring.",
  identity: [
    ["Version", "v1.6.1"],
    ["npm", "llmverify"],
    ["GitHub", "subodhkc/llmverify-npm"],
    ["CLI", "llmverify"],
    ["License", "MIT"],
  ],
  href: "/products/llmverify",
  track: "homepage_llmverify_click",
};

export function SystemsSection() {
  return (
    <section
      id="systems"
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
        05 / selected systems + open source
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
        The work is inspectable.
      </h2>

      <p
        style={{
          marginTop: 16,
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          maxWidth: 640,
        }}
      >
        Advice gets sharper when the architecture, failure modes and operating constraints are real.
        I build products and publish selected tools in the same areas I advise on.
      </p>

      {/* Systems grid */}
      <div
        className="systems-grid"
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 0,
          border: "1px solid var(--op-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {SYSTEMS.map((sys, i) => (
          <div
            key={sys.name}
            style={{
              padding: "28px 24px",
              borderRight: i % 2 === 0 ? "1px solid var(--op-border)" : "none",
              borderBottom: i < SYSTEMS.length - 2 ? "1px solid var(--op-border)" : "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>
                {sys.name}
              </h3>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: sys.statusColor,
                  padding: "2px 8px",
                  border: "1px solid var(--op-border)",
                  borderRadius: 999,
                  flexShrink: 0,
                }}
              >
                {sys.status}
              </span>
            </div>

            <p style={{ fontSize: 14, color: "var(--fg)", margin: "0 0 8px", lineHeight: 1.5 }}>
              {sys.desc}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px", lineHeight: 1.55 }}>
              {sys.proves}
            </p>

            {sys.note && (
              <p style={{ fontSize: 11, color: "var(--op-muted)", margin: "0 0 16px", lineHeight: 1.4, fontStyle: "italic" }}>
                {sys.note}
              </p>
            )}

            <Link
              href={sys.href}
              data-track={sys.track}
              style={{
                marginTop: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--fg)",
                textDecoration: "none",
                borderBottom: "1px solid var(--op-border)",
                paddingBottom: 2,
                width: "fit-content",
              }}
            >
              Inspect →
            </Link>
          </div>
        ))}
      </div>

      {/* Aggregate + CTA */}
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
        <p style={{ fontSize: 13, color: "var(--op-muted)", margin: 0 }}>
          12K+ npm + PyPI installs across public open-source packages.
        </p>
        <Link
          href="/products"
          data-track="homepage_open_source_click"
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
          Explore Open Source & Systems →
        </Link>
      </div>

      {/* HAIEC Developer Security family */}
      <div style={{ marginTop: 56 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--op-accent)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ width: 18, height: 1, background: "var(--op-accent)" }} />
          HAIEC Developer Security
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--fg)",
            lineHeight: 1.3,
          }}
        >
          Secure the code. Protect the tenant boundary. Verify the model interaction.
        </p>

        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "var(--text-secondary)",
            maxWidth: 720,
            lineHeight: 1.55,
          }}
        >
          Security and verification tools for AI-assisted development. Three independent MIT-licensed
          packages, each answering a different developer-security question.
        </p>

        {/* Two new release cards */}
        <div
          className="family-grid"
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {FAMILY_CARDS.map((card) => (
            <div
              key={card.name}
              style={{
                border: "1px solid var(--op-border)",
                borderRadius: 10,
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                  }}
                >
                  {card.role}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--op-accent)",
                    padding: "2px 8px",
                    border: "1px solid var(--op-accent)",
                    borderRadius: 999,
                    flexShrink: 0,
                  }}
                >
                  {card.badge}
                </span>
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--fg)",
                  marginBottom: 4,
                }}
              >
                {card.name}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--fg)",
                  margin: "0 0 6px",
                  lineHeight: 1.5,
                }}
              >
                {card.tagline}
              </p>
              <p
                style={{
                  fontSize: 12.5,
                  color: "var(--text-secondary)",
                  margin: "0 0 10px",
                  lineHeight: 1.55,
                }}
              >
                {card.body}
              </p>

              {/* Proof chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {card.proof.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      padding: "2px 7px",
                      border: "1px solid var(--op-border)",
                      borderRadius: 999,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* Identity rows */}
              <div style={{ marginBottom: 14 }}>
                {card.identity.map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      padding: "2px 0",
                      borderBottom: "1px solid var(--op-border)",
                    }}
                  >
                    <span style={{ color: "var(--op-muted)" }}>{label}</span>
                    <span style={{ color: "var(--fg)" }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "auto", display: "flex", gap: 12, alignItems: "center" }}>
                <Link
                  href={card.primaryHref}
                  data-track={card.track}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11.5,
                    color: "var(--fg)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--op-border)",
                    paddingBottom: 2,
                  }}
                >
                  {card.primaryLabel} →
                </Link>
                <a
                  href={card.secondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track={`${card.track}_github`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {card.secondaryLabel} ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* LLMVerify runtime sibling row */}
        <Link
          href={LLMVERIFY_CARD.href}
          data-track={LLMVERIFY_CARD.track}
          style={{
            display: "block",
            marginTop: 16,
            border: "1px solid var(--op-border)",
            borderRadius: 10,
            padding: "18px 20px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  marginRight: 8,
                }}
              >
                {LLMVERIFY_CARD.role}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--op-muted)",
                  padding: "2px 8px",
                  border: "1px solid var(--op-border)",
                  borderRadius: 999,
                }}
              >
                {LLMVERIFY_CARD.badge}
              </span>
            </div>
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: "var(--fg)",
              marginBottom: 4,
            }}
          >
            {LLMVERIFY_CARD.name}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--fg)",
              margin: "0 0 6px",
              lineHeight: 1.5,
            }}
          >
            {LLMVERIFY_CARD.tagline}
          </p>
          <p
            style={{
              fontSize: 12.5,
              color: "var(--text-secondary)",
              margin: "0 0 10px",
              lineHeight: 1.55,
            }}
          >
            {LLMVERIFY_CARD.body}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              fontSize: 11,
              fontFamily: "var(--font-mono)",
            }}
          >
            {LLMVERIFY_CARD.identity.map(([label, value]) => (
              <span key={label} style={{ color: "var(--op-muted)" }}>
                {label}: <span style={{ color: "var(--fg)" }}>{value}</span>
              </span>
            ))}
          </div>
        </Link>

        {/* Release article CTA */}
        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/insights/ai-appsec-mcp-tenant-isolation-release"
            data-track="homepage_release_article_click"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              border: "1px solid var(--op-accent)",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              fontWeight: 500,
              color: "var(--fg)",
              textDecoration: "none",
            }}
          >
            Read the release article →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .systems-grid {
            grid-template-columns: 1fr !important;
          }
          .systems-grid > div {
            border-right: none !important;
            border-bottom: 1px solid var(--op-border) !important;
          }
          .systems-grid > div:last-child {
            border-bottom: none !important;
          }
          .family-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
