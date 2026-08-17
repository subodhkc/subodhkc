// components/home/AboutSection.tsx - human about with portrait + pronunciation
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Executive Bio", href: "/executive-bio" },
  { label: "Speaking", href: "/speaking" },
  { label: "LinkedIn", href: "https://linkedin.com/in/subodhkc", ext: true },
  { label: "GitHub", href: "https://github.com/subodhkc", ext: true },
];

export function AboutSection() {
  return (
    <section
      id="about"
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
        08 / about
      </div>

      <div
        className="about-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 280px) 1fr",
          gap: 48,
          alignItems: "flex-start",
        }}
      >
        {/* Portrait */}
        <figure style={{ margin: 0, position: "relative" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid var(--op-border)",
              background: "var(--chip)",
            }}
          >
            <Image
              src="/portrait.jpeg"
              alt="Subodh KC, AI Advisor and AI Systems Architect"
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              style={{
                objectFit: "cover",
                objectPosition: "center 18%",
                filter: "grayscale(0.15) contrast(1.03)",
              }}
            />
          </div>
          <figcaption
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--op-muted)",
            }}
          >
            <span>fig.02 - operator</span>
            <span>Dallas-Fort Worth</span>
          </figcaption>
        </figure>

        {/* Content */}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(26px, 3.6vw, 40px)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--fg)",
            }}
          >
            Subodh KC
          </h2>
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--text-secondary)",
              letterSpacing: "0.02em",
            }}
          >
            AI Advisor + AI Systems Architect
            <span style={{ color: "var(--op-muted)", margin: "0 8px" }}>·</span>
            Dallas-Fort Worth
          </div>

          {/* Pronunciation */}
          <div
            style={{
              marginTop: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--op-muted)",
            }}
          >
            soo-BOHD KAY-see
          </div>

          <p
            style={{
              marginTop: 20,
              fontSize: 16,
              lineHeight: 1.65,
              color: "var(--text-secondary)",
              maxWidth: 560,
            }}
          >
            Former Fortune 50 Core Team Lead and Senior Technical Program Manager. Led a
            53-application enterprise portfolio and later worked across AI implementation,
            governance, and a Commercial Software AI Strategy initiative. Founder of HAIEC and
            KestrelVoice. 16+ years across software, infrastructure, enterprise program delivery,
            and applied AI systems.
          </p>

          {/* Credentials */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            <div>
              <span style={{ color: "var(--fg)" }}>M.S. Engineering & Technology Management</span>
              <span style={{ color: "var(--op-muted)" }}> · Louisiana Tech University</span>
            </div>
            <div>
              <span style={{ color: "var(--fg)" }}>Six Sigma Green Belt</span>
            </div>
          </div>

          {/* Links */}
          <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                data-track={`homepage_about_${link.label.toLowerCase().replace(/\s+/g, "_")}_click`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--op-border)",
                  color: "var(--fg)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {link.label}
                {"ext" in link && link.ext && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8 L8 4" />
                    <path d="M5 4 H8 V7" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .about-grid figure {
            max-width: 220px;
          }
        }
      `}</style>
    </section>
  );
}
