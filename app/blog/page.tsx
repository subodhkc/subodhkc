import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const revalidate = 3600

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 28px 120px' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: 16,
        }}
      >
        § Blog
      </div>

      <h1
        style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0 0 16px',
          color: 'var(--fg)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Insights</span>{' '}
        on AI governance, security & architecture
      </h1>

      <p
        style={{
          fontSize: 16,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 600,
          margin: '0 0 56px',
        }}
      >
        Practical articles from building production AI systems at Fortune 50 scale —
        governance frameworks, compliance automation, RAG architecture, and more.
      </p>

      {posts.length === 0 ? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: 'var(--card)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            No articles yet. Run{' '}
            <code style={{ color: 'var(--accent)' }}>node scripts/sync-blog.mjs</code>
            {' '}to sync from BabyLoveGrowth.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {posts.map((post, idx) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: 'flex',
                gap: 24,
                padding: '32px 0',
                borderTop: idx === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--fg)',
                transition: 'opacity 0.15s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    marginBottom: 8,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <time>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  {post.keywords.length > 0 && (
                    <span style={{ color: 'var(--accent)' }}>
                      {post.keywords.slice(0, 3).join(' · ')}
                    </span>
                  )}
                </div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                    margin: '0 0 8px',
                  }}
                >
                  {post.title}
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.excerpt || post.metaDescription}
                </p>
              </div>
              {post.heroImageUrl && (
                <div
                  style={{
                    width: 120,
                    height: 80,
                    borderRadius: 6,
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--border)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.heroImageUrl}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
