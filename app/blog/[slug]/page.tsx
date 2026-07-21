import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'

export const revalidate = 3600

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then((p) => {
    const post = getPostBySlug(p.slug)
    if (!post) {
      return {
        title: 'Article Not Found',
        robots: { index: false, follow: false },
      }
    }
    return {
      title: post.title,
      description: post.metaDescription,
      alternates: {
        canonical: `https://subodhkc.com/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.metaDescription,
        url: `https://subodhkc.com/blog/${post.slug}`,
        type: 'article',
        images: post.heroImageUrl ? [{ url: post.heroImageUrl }] : undefined,
        publishedTime: post.createdAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription,
        images: post.heroImageUrl ? [post.heroImageUrl] : undefined,
      },
    }
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const jsonLdString = post.jsonLd
    ? JSON.stringify({
        ...post.jsonLd,
        headline: post.title,
        description: post.metaDescription,
        image: post.heroImageUrl,
        datePublished: post.createdAt,
        dateModified: post.createdAt,
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
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://subodhkc.com/blog/${post.slug}`,
        },
      })
    : null

  const faqJsonLdString = post.faqJsonLd
    ? JSON.stringify(post.faqJsonLd)
    : null

  return (
    <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 28px 120px' }}>
      {jsonLdString && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      )}
      {faqJsonLdString && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqJsonLdString }}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <Link
          href="/blog"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← back to blog
        </Link>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <time>
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        {post.keywords.length > 0 && (
          <span style={{ color: 'var(--accent)' }}>
            {post.keywords.join(' · ')}
          </span>
        )}
      </div>

      <h1
        style={{
          fontSize: 'clamp(26px, 3.5vw, 40px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          margin: '0 0 24px',
          color: 'var(--fg)',
        }}
      >
        {post.title}
      </h1>

      {post.heroImageUrl && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 40,
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

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      <div
        style={{
          marginTop: 64,
          paddingTop: 32,
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Link
          href="/blog"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--fg)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 999,
            border: '1px solid var(--border)',
          }}
        >
          ← all articles
        </Link>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-secondary)',
          }}
        >
          By Subodh KC · AI Systems Architect
        </div>
      </div>

      <style>{`
        .blog-content {
          color: var(--fg);
          font-size: 16px;
          line-height: 1.75;
        }
        .blog-content h1 {
          font-size: 28px;
          font-weight: 500;
          letter-spacing: -0.02em;
          margin: 40px 0 16px;
          color: var(--fg);
        }
        .blog-content h2 {
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin: 36px 0 14px;
          color: var(--fg);
        }
        .blog-content h3 {
          font-size: 18px;
          font-weight: 500;
          margin: 28px 0 12px;
          color: var(--fg);
        }
        .blog-content p {
          margin: 0 0 18px;
          color: var(--fg);
        }
        .blog-content ul, .blog-content ol {
          margin: 0 0 18px;
          padding-left: 24px;
        }
        .blog-content li {
          margin-bottom: 8px;
          color: var(--fg);
        }
        .blog-content a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-content blockquote {
          margin: 24px 0;
          padding: 16px 20px;
          border-left: 3px solid var(--accent);
          background: var(--card);
          border-radius: 0 6px 6px 0;
          color: var(--text-secondary);
          font-style: italic;
        }
        .blog-content code {
          font-family: var(--font-mono);
          font-size: 14px;
          background: var(--card);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border);
        }
        .blog-content pre {
          margin: 24px 0;
          padding: 20px;
          background: var(--card);
          border-radius: 8px;
          border: 1px solid var(--border);
          overflow-x: auto;
        }
        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 24px 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }
        .blog-content th, .blog-content td {
          padding: 10px 14px;
          border: 1px solid var(--border);
          text-align: left;
        }
        .blog-content th {
          background: var(--card);
          font-weight: 500;
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 32px 0;
        }
        @media (max-width: 768px) {
          .blog-content {
            font-size: 15px;
          }
          .blog-content h1 {
            font-size: 24px;
          }
          .blog-content h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </article>
  )
}
