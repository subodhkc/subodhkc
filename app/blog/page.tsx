import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { calculateReadingTime } from '@/lib/blog-utils'

export const revalidate = 3600

export default function BlogIndexPage() {
  const posts = getAllPosts()

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Subodh KC — AI Governance & Architecture Blog',
    description: 'Practical articles on AI governance, compliance automation, enterprise AI architecture, and production AI systems.',
    url: 'https://subodhkc.com/blog',
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://subodhkc.com/blog/${p.slug}`,
      datePublished: p.createdAt,
      description: p.metaDescription,
    })),
  }

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 28px 120px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
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
        <>
          {/* Featured post */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              style={{
                display: 'flex',
                gap: 32,
                padding: '40px 0',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--fg)',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 12,
                  }}
                >
                  ★ Featured
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    marginBottom: 10,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  <time>
                    {new Date(featured.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span>·</span>
                  <span>{calculateReadingTime(featured.contentHtml)} min read</span>
                  {featured.keywords.length > 0 && (
                    <>
                      <span>·</span>
                      <span style={{ color: 'var(--accent)' }}>
                        {featured.keywords.slice(0, 3).join(' · ')}
                      </span>
                    </>
                  )}
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(22px, 3vw, 32px)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: '0 0 12px',
                  }}
                >
                  {featured.title}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    margin: 0,
                    maxWidth: 520,
                  }}
                >
                  {featured.excerpt || featured.metaDescription}
                </p>
              </div>
              {featured.heroImageUrl && (
                <div
                  style={{
                    width: 200,
                    height: 140,
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--border)',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.heroImageUrl}
                    alt={featured.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Link>
          )}

          {/* Rest of posts */}
          {rest.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 0 }}>
              {rest.map((post, idx) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{
                    display: 'flex',
                    gap: 24,
                    padding: '28px 0',
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'var(--fg)',
                    transition: 'opacity 0.15s',
                  }}
                  className="blog-card-hover"
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
                        fontSize: 18,
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
        </>
      )}

      <style>{`
        .blog-card-hover:hover {
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}
