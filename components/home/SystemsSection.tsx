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
  {
    name: "MCP Tenant Isolation",
    status: "OPEN SOURCE",
    statusColor: "var(--text-secondary)",
    desc: "Deterministic analysis for multi-tenant SaaS and MCP isolation risks.",
    proves: "57 deterministic rules covering tenant isolation, IDOR, RLS, query isolation, and MCP-specific security. SARIF output, GitHub Code Scanning, MCP server support.",
    href: "/products/mcp-tenant-isolation",
    track: "homepage_mcp_click",
    note: undefined,
  },
  {
    name: "llmverify",
    status: "OPEN SOURCE PACKAGE",
    statusColor: "var(--text-secondary)",
    desc: "Local and deterministic indicators and guardrails for LLM output.",
    proves: "Practical tooling for monitoring LLM output without sending data to external services.",
    href: "/products/llmverify",
    track: "homepage_llmverify_click",
    note: "Not an infallible hallucination detector. Local indicators and guardrails, not ground truth.",
  },
];

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
        }
      `}</style>
    </section>
  );
}
