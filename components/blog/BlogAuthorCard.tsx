import Link from "next/link"
import Image from "next/image"

export function BlogAuthorCard() {
  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 24,
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--card)",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 64,
          height: 64,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          border: "1px solid var(--border)",
        }}
      >
        <Image
          src="/portrait.jpeg"
          alt="Subodh KC"
          fill
          sizes="64px"
          style={{ objectFit: "cover", objectPosition: "center 18%" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 4,
          }}
        >
          Author
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 500,
            margin: "0 0 6px",
            color: "var(--fg)",
          }}
        >
          Subodh KC
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            margin: "0 0 12px",
          }}
        >
          AI Systems Architect & Governance Expert. Former Fortune 50 AI Strategy CTL.
          Founder of HAIEC — Holistic AI Ethics & Compliance. 16+ years building
          production AI systems from startups to global enterprise.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            ["About", "/about"],
            ["Services", "/services"],
            ["HAIEC", "/haiec"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid var(--border)",
                color: "var(--fg)",
                textDecoration: "none",
              }}
            >
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
