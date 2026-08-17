// app/insights/page.tsx - intellectual content hub: How does Subodh think?
import Link from "next/link";
import { PAPERS } from "@/data/papers";
import { FRAMEWORKS } from "@/data/frameworks";

export const metadata = {
  title: "Insights | Writing, Research, Frameworks & Guides | Subodh KC",
  description:
    "How Subodh thinks about AI. Writing on systems, decisions, and field notes. Published research and frameworks. AI That Works magazine. Compliance and implementation guides.",
  keywords: [
    "Subodh KC insights",
    "AI writing",
    "AI research",
    "AI frameworks",
    "Cognitive Systems Management",
    "AI governance research",
    "AI compliance guides",
    "AI strategy",
    "AI architecture",
    "AI decision support",
  ],
  alternates: {
    canonical: "https://subodhkc.com/insights",
  },
  openGraph: {
    title: "Insights | Subodh KC",
    description:
      "Writing, research, frameworks, magazine, and guides on AI strategy, production architecture, and governance.",
    url: "https://subodhkc.com/insights",
    type: "website",
  },
};

const HUB_SECTIONS = [
  {
    label: "WRITING",
    desc: "Articles on AI systems, decisions, architecture, and production. Field notes from real work.",
    href: "/blog",
    cta: "Read articles",
    count: "ongoing",
    themes: ["AI Decisions", "Systems & Architecture", "Production AI", "Security & Governance", "Field Notes"],
  },
  {
    label: "RESEARCH",
    desc: "Published papers with reproducible methodologies. Zenodo and SSRN publications.",
    href: "/research",
    cta: "Read research",
    count: `${PAPERS.length} papers`,
    themes: ["Zenodo", "SSRN", "Working papers", "Technical reports"],
  },
  {
    label: "FRAMEWORKS",
    desc: "Practitioner frameworks and methodologies. CSM, ISAF, and other original work.",
    href: "/research",
    cta: "Explore frameworks",
    count: `${FRAMEWORKS.length} frameworks`,
    themes: ["CSM 2.0", "ISAF", "Red Audit Kit", "LegacyShift"],
  },
  {
    label: "AI THAT WORKS",
    desc: "Independent field magazine. Strategy, systems, governance, and field practice. Free to read.",
    href: "/magazine",
    cta: "Read the magazine",
    count: "36 pages",
    themes: [],
  },
  {
    label: "GUIDES",
    desc: "AI compliance and implementation guides covering EU AI Act, Texas TRAIGA, and NYC LL144.",
    href: "/guides",
    cta: "Read guides",
    count: "3 law guides",
    themes: ["EU AI Act", "Texas TRAIGA", "NYC LL144"],
  },
  {
    label: "TOOLS & FIELD RESOURCES",
    desc: "Interactive resources for architecture decisions, AI security analysis, and field work.",
    href: "/ai-security-tools",
    cta: "Explore tools",
    count: "interactive",
    themes: ["Architecture Decision Master Sheet", "AI Security Tools", "Blast Radius", "Agent Matrix"],
  },
];

export default function InsightsPage() {
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
        Insights
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
        Insights
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
        How I think about AI. Writing on systems, decisions, and field notes. Published research and
        frameworks. AI That Works magazine. Compliance and implementation guides. Interactive tools
        and field resources.
      </p>

      {/* Hub sections */}
      <div
        className="insights-grid"
        style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 0,
          border: "1px solid var(--op-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {HUB_SECTIONS.map((section) => (
          <Link
            key={section.label}
            href={section.href}
            style={{
              padding: "28px 24px",
              borderRight: "1px solid var(--op-border)",
              borderBottom: "1px solid var(--op-border)",
              textDecoration: "none",
              color: "var(--fg)",
              display: "flex",
              flexDirection: "column",
            }}
            className="insights-card"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "var(--op-accent)",
                  fontWeight: 600,
                }}
              >
                {section.label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--op-muted)" }}>
                {section.count}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 16px", lineHeight: 1.55, flex: 1 }}>
              {section.desc}
            </p>
            {section.themes.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {section.themes.map((theme) => (
                  <span
                    key={theme}
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
                    {theme}
                  </span>
                ))}
              </div>
            )}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--fg)",
                borderBottom: "1px solid var(--op-border)",
                paddingBottom: 2,
                width: "fit-content",
              }}
            >
              {section.cta} →
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .insights-grid {
            grid-template-columns: 1fr !important;
          }
          .insights-card {
            border-right: none !important;
          }
        }
      `}</style>
    </div>
  );
}
