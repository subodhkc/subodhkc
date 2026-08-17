// app/work/page.tsx - Work hub: discovery, not another portfolio
import Link from "next/link";

export const metadata = {
  title: "Work | Selected Work, Systems & Open Source | Subodh KC",
  description:
    "Work that can be inspected. Enterprise program leadership, AI systems, founder-built products, open-source technical controls, architecture, governance, and research by Subodh KC.",
  keywords: [
    "Subodh KC work",
    "selected work",
    "AI systems",
    "enterprise AI programs",
    "open source AI",
    "HAIEC",
    "KestrelVoice",
    "MCP tenant isolation",
    "llmverify",
    "Cognitive Systems Management",
  ],
  alternates: {
    canonical: "https://subodhkc.com/work",
  },
  openGraph: {
    title: "Work | Subodh KC",
    description:
      "Work that can be inspected. Enterprise program leadership, AI systems, founder-built products, and open-source technical controls.",
    url: "https://subodhkc.com/work",
    type: "website",
  },
};

type WorkItem = {
  title: string;
  status: string;
  desc: string;
  proof: string[];
  href?: string;
};

type WorkGroup = {
  label: string;
  items: WorkItem[];
};

const WORK_GROUPS: WorkGroup[] = [
  {
    label: "ENTERPRISE & PROGRAM LEADERSHIP",
    items: [
      {
        title: "Fortune 50 Core Team Lead",
        status: "FORMER ROLE",
        desc: "Senior Technical Program Manager at HP Inc. Led program and portfolio governance across 53 enterprise applications, coordinating delivery through multiple program managers and cross-functional teams.",
        proof: ["53 enterprise applications", "Cross-functional program execution", "Commercial Software AI Strategy initiative"],
      },
      {
        title: "MES Deployment at Cummins",
        status: "DELIVERED",
        desc: "$10M+ MES project across 400+ production stations in manufacturing environments. Real operational deployment experience.",
        proof: ["400+ MES stations", "$10M+ project", "Manufacturing operations"],
      },
    ],
  },
  {
    label: "PRODUCTS & OPERATING SYSTEMS",
    items: [
      {
        title: "HAIEC",
        status: "PRODUCT / ACTIVE",
        desc: "AI governance, assurance and evidence system. Governance architecture, deterministic checks, evidence, and AI risk/control thinking.",
        href: "/solutions/haiec",
        proof: ["Governance platform", "Evidence architecture", "AI risk controls"],
      },
      {
        title: "KestrelVoice",
        status: "PRODUCT / LIVE",
        desc: "Voice AI and workflow operations platform. Production voice systems, real-time AI, workflow integration, and human escalation.",
        href: "/solutions/kestrelvoice",
        proof: ["Production voice AI", "Workflow operations", "Human escalation"],
      },
    ],
  },
  {
    label: "OPEN SOURCE & TECHNICAL SYSTEMS",
    items: [
      {
        title: "MCP Tenant Isolation",
        status: "OPEN SOURCE",
        desc: "Deterministic analysis for multi-tenant SaaS and MCP isolation risks. 57 deterministic rules covering tenant isolation, IDOR, RLS, query isolation, and MCP-specific security.",
        href: "/products/mcp-tenant-isolation",
        proof: ["57 deterministic rules", "SARIF output", "GitHub Code Scanning", "MCP server support"],
      },
      {
        title: "llmverify",
        status: "OPEN SOURCE PACKAGE",
        desc: "Local and deterministic indicators and guardrails for LLM output. Practical tooling for monitoring LLM output without sending data to external services.",
        href: "/products/llmverify",
        proof: ["npm + PyPI", "Local processing", "LLM output guardrails"],
      },
    ],
  },
  {
    label: "FRAMEWORKS / ORIGINAL WORK",
    items: [
      {
        title: "Cognitive Systems Management (CSM 2.0)",
        status: "PUBLISHED FRAMEWORK",
        desc: "Practitioner framework connecting enterprise, project, code, and user governance. Four governance domains, six execution functions, versioned governance contracts.",
        href: "/cognitive-systems-management",
        proof: ["Four governance domains", "Six execution functions", "Versioned contracts"],
      },
      {
        title: "Instruction Stack Audit Framework (ISAF)",
        status: "RESEARCH",
        desc: "Deterministic audit framework for inspecting LLM instruction stacks. Published in Zenodo with reproducible methodology.",
        href: "/research",
        proof: ["Zenodo publication", "Reproducible methodology", "Deterministic evaluation"],
      },
    ],
  },
];

const ROUTES = [
  { label: "Executive Portfolio", href: "/portfolio", desc: "Deep executive artifact with full career detail" },
  { label: "Open Source & Systems", href: "/products", desc: "All packages, tools, and technical systems" },
  { label: "GitHub", href: "https://github.com/subodhkc", desc: "Public repositories", ext: true },
];

export default function WorkPage() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 28px 80px" }}>
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
        Work
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "var(--fg)",
        }}
      >
        Work that can be inspected.
      </h1>

      <p
        style={{
          marginTop: 20,
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          maxWidth: 640,
        }}
      >
        My work spans enterprise program leadership, AI systems, founder-built products, open-source
        technical controls, architecture, governance, and research. Each artifact shows what it is,
        its real maturity, and what it demonstrates.
      </p>

      {/* Work groups */}
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 48 }}>
        {WORK_GROUPS.map((group) => (
          <div key={group.label}>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--op-muted)",
                margin: "0 0 20px",
                paddingBottom: 12,
                borderBottom: "1px solid var(--op-border)",
              }}
            >
              {group.label}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: 0,
                border: "1px solid var(--op-border)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              {group.items.map((item, i) => {
                const content = (
                  <div
                    key={item.title}
                    style={{
                      padding: "24px 20px",
                      borderLeft: i === 0 ? "none" : "1px solid var(--op-border)",
                      borderTop: i >= 2 ? "1px solid var(--op-border)" : "none",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--fg)" }}>
                        {item.title}
                      </h3>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9.5,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          padding: "2px 8px",
                          border: "1px solid var(--op-border)",
                          borderRadius: 999,
                          flexShrink: 0,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: "0 0 14px", lineHeight: 1.55 }}>
                      {item.desc}
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: "auto" }}>
                      {item.proof.map((p) => (
                        <span
                          key={p}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--op-muted)",
                            padding: "2px 8px",
                            background: "var(--op-card)",
                            borderRadius: 4,
                            border: "1px solid var(--op-border)",
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
                return item.href ? (
                  <Link
                    key={item.title}
                    href={item.href}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {content}
                  </Link>
                ) : (
                  content
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Routes */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 32,
          borderTop: "1px solid var(--op-border)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--op-muted)",
            margin: "0 0 20px",
          }}
        >
          Go deeper
        </h2>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {ROUTES.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "16px 20px",
                border: "1px solid var(--op-border)",
                borderRadius: 8,
                textDecoration: "none",
                color: "var(--fg)",
                minWidth: 240,
                transition: "border-color .15s",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>{route.label}</span>
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{route.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
