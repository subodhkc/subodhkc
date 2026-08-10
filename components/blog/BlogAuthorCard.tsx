import Link from "next/link"
import Image from "next/image"

const AUTHOR_PROFILES: Record<string, {
  bio: string
  links: [string, string][]
  image: string
  imagePosition: string
}> = {
  'Subodh KC': {
    bio: 'AI Systems Architect & Governance Expert. Former Fortune 50 AI Strategy CTL. Founder of HAIEC — Holistic AI Ethics & Compliance. 16+ years building production AI systems from startups to global enterprise.',
    links: [
      ['About', '/about'],
      ['Services', '/services'],
      ['HAIEC', '/haiec'],
    ],
    image: '/portrait.jpeg',
    imagePosition: 'center 18%',
  },
  'Yeti AI Writer': {
    bio: 'AI-powered research and content engine for subodhkc.com. Generates daily authority articles on AI governance, production architecture, and compliance — reviewed and curated by Subodh KC before publication.',
    links: [
      ['About', '/about'],
      ['Blog', '/blog'],
    ],
    image: '/yeti-ai-writer.svg',
    imagePosition: 'center center',
  },
}

const DEFAULT_PROFILE = {
  bio: 'AI Systems Architect & Governance Expert. Former Fortune 50 AI Strategy CTL. Founder of HAIEC — Holistic AI Ethics & Compliance. 16+ years building production AI systems from startups to global enterprise.',
  links: [
    ['About', '/about'],
    ['Services', '/services'],
    ['HAIEC', '/haiec'],
  ] as [string, string][],
  image: '/portrait.jpeg',
  imagePosition: 'center 18%',
}

export function BlogAuthorCard({ author }: { author?: string | null }) {
  const authorName = author || 'Yeti AI Writer'
  const profile = AUTHOR_PROFILES[authorName] || DEFAULT_PROFILE

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        padding: 24,
        borderRadius: 8,
        border: "1px solid var(--op-border)",
        background: "var(--op-card)",
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
          border: "1px solid var(--op-border)",
        }}
      >
        <Image
          src={profile.image}
          alt={authorName}
          fill
          sizes="64px"
          style={{ objectFit: "cover", objectPosition: profile.imagePosition }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--op-accent)",
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
          {authorName}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            margin: "0 0 12px",
          }}
        >
          {profile.bio}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {profile.links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 999,
                border: "1px solid var(--op-border)",
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
