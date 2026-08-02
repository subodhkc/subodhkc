import Link from 'next/link'

const NEWS_ITEMS = [
  {
    tag: 'AI Briefing',
    tagColor: 'var(--op-accent)',
    title: 'Weekly AI intelligence for IT leaders — 40+ sources monitored, impact-scored, role-based views',
    href: '/solutions/ai-briefing',
    external: 'https://frontofai.com/briefing',
    badge: 'Free',
  },
  {
    tag: 'CourtCase',
    tagColor: 'var(--op-accent)',
    title: 'AI-assisted court evidence builder — document analysis, timeline generation, case packet creation',
    href: '/solutions/courtcase',
    external: 'https://courtcase.frontofai.com',
    badge: 'Beta',
  },
  {
    tag: 'LLMVerify',
    tagColor: 'var(--op-accent)',
    title: 'Validate LLM outputs with schema validation, safety filters, and PII detection — MIT licensed',
    href: '/products/llmverify',
    external: 'https://www.npmjs.com/package/llmverify',
    badge: 'Open Source',
  },
  {
    tag: 'Log RCA',
    tagColor: 'var(--op-accent)',
    title: 'AI-powered root cause analysis that lives inside your network — pattern detection and fix suggestions',
    href: '/products/skc-log-analyser',
    external: 'https://frontofai.com/products/log-rca',
    badge: 'Enterprise',
  },
]

export function FrontOfAIBanner() {
  return (
    <section className="py-12 px-6" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--op-border)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--op-accent)',
              }}
            >
              §02 / FrontOfAI
            </span>
            <h2
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(22px, 3vw, 30px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--fg)',
                margin: 0,
              }}
            >
              Stop drowning in AI noise.{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--op-muted)' }}>Start making decisions.</span>
            </h2>
          </div>
          <a
            href="https://frontofai.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--op-accent)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid var(--op-accent)',
              transition: 'background-color 0.2s, color 0.2s',
            }}
            className="hover:bg-[var(--op-accent)] hover:text-[var(--bg)]"
          >
            Explore FrontOfAI →
          </a>
        </div>

        {/* News ticker grid */}
        <div
          className="frontofai-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 0,
            border: '1px solid var(--op-border)',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'var(--op-card)',
          }}
        >
          {NEWS_ITEMS.map((item, i) => (
            <Link
              key={item.tag}
              href={item.href}
              style={{ textDecoration: 'none' }}
              className="frontofai-item"
            >
              <div
                style={{
                  padding: '20px 22px',
                  borderTop: i >= 4 ? '1px solid var(--op-border)' : 'none',
                  borderRight: i < NEWS_ITEMS.length - 1 ? '1px solid var(--op-border)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  minHeight: 140,
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s',
                }}
                className="frontofai-item-inner"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: item.tagColor,
                    }}
                  >
                    {item.tag}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--op-muted)',
                      padding: '3px 8px',
                      borderRadius: 999,
                      border: '1px solid var(--op-border)',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: 'var(--fg)',
                    margin: 0,
                  }}
                >
                  {item.title}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--op-muted)',
                  }}
                >
                  <span>Learn more</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6 H9" />
                    <path d="M7 4 L9 6 L7 8" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            alignItems: 'center',
            marginTop: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--op-muted)',
            flexWrap: 'wrap',
          }}
        >
          <span>4 products shipped</span>
          <span style={{ width: 1, height: 12, background: 'var(--op-border)' }} />
          <span>10,000+ npm + pypi installs</span>
          <span style={{ width: 1, height: 12, background: 'var(--op-border)' }} />
          <span>Compliance-first design</span>
          <span style={{ width: 1, height: 12, background: 'var(--op-border)' }} />
          <span>No vendor lock-in</span>
        </div>
      </div>

      <style>{`
        .frontofai-item-inner:hover {
          background-color: var(--card-hover) !important;
        }
        @media (max-width: 768px) {
          .frontofai-grid {
            grid-template-columns: 1fr !important;
          }
          .frontofai-item-inner {
            border-right: none !important;
            border-top: 1px solid var(--op-border) !important;
          }
          .frontofai-item:first-child .frontofai-item-inner {
            border-top: none !important;
          }
        }
      `}</style>
    </section>
  )
}
