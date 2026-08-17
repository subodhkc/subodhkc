// app/insights/page.tsx - intellectual content hub
import Link from "next/link";
import { PAPERS } from "@/data/papers";
import { FRAMEWORKS } from "@/data/frameworks";

export const metadata = {
  title: "Insights | Writing, Research, Frameworks & Guides",
  description:
    "Writing, research, frameworks, magazine, and guides on AI strategy, production architecture, governance, and operating models. By Subodh KC, AI Advisor and AI Systems Architect.",
  keywords: [
    "AI insights",
    "AI research",
    "AI frameworks",
    "AI governance research",
    "AI architecture",
    "AI strategy",
    "Cognitive Systems Management",
    "AI compliance guides",
    "Subodh KC",
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
    desc: "Articles on AI governance, architecture, and production systems.",
    href: "/blog",
    cta: "Read articles",
    count: "ongoing",
  },
  {
    label: "RESEARCH",
    desc: "Published papers with reproducible methodologies.",
    href: "/research",
    cta: "Read research",
    count: `${PAPERS.length} papers`,
  },
  {
    label: "FRAMEWORKS",
    desc: "Practitioner frameworks and methodologies.",
    href: "/research",
    cta: "Explore frameworks",
    count: `${FRAMEWORKS.length} frameworks`,
  },
  {
    label: "MAGAZINE",
    desc: "AI That Works Magazine. Independent field magazine, free to read.",
    href: "/magazine",
    cta: "Read the magazine",
    count: "36 pages",
  },
  {
    label: "GUIDES",
    desc: "AI compliance guides covering EU AI Act, Texas TRAIGA, and NYC LL144.",
    href: "/guides",
    cta: "Read guides",
    count: "3 law guides",
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
        Writing, research, frameworks, magazine, and guides on AI strategy, production
        architecture, governance, and operating models.
      </p>

      {/* Hub sections */}
      <div
        style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 0,
          border: "1px solid var(--op-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {HUB_SECTIONS.map((section, i) => (
          <Link
            key={section.label}
            href={section.href}
            style={{
              padding: "28px 24px",
              borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--op-border)" : "none",
              borderBottom: i < HUB_SECTIONS.length - 3 ? "1px solid var(--op-border)" : "none",
              textDecoration: "none",
              color: "var(--fg)",
              display: "flex",
              flexDirection: "column",
            }}
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
          a[style*="borderRight"] {
            border-right: none !important;
            border-bottom: 1px solid var(--op-border) !important;
          }
        }
      `}</style>
    </div>
  );
}
