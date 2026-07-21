import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug, getAllPosts } from '@/lib/blog'
import { sanitizeHtml, calculateReadingTime } from '@/lib/blog-utils'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard'
import { BlogNewsletterCTA } from '@/components/blog/BlogNewsletterCTA'
import { TableOfContents } from '@/components/blog/TableOfContents'

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
        images: post.heroImageUrl ? [{ url: post.heroImageUrl }] : [{ url: 'https://subodhkc.com/portrait.jpeg' }],
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt || post.createdAt,
        authors: ['Subodh KC'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription,
        images: post.heroImageUrl ? [post.heroImageUrl] : ['https://subodhkc.com/portrait.jpeg'],
      },
      robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
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

  const sanitizedHtml = sanitizeHtml(post.contentHtml)
  const readingTime = calculateReadingTime(post.contentHtml)

  // Remove first image from content if it duplicates the hero image
  let displayHtml = sanitizedHtml
  if (post.heroImageUrl) {
    const firstImgMatch = displayHtml.match(/<p>\s*<img[^>]+src="([^"]+)"/)
    if (firstImgMatch && firstImgMatch[1] === post.heroImageUrl) {
      displayHtml = displayHtml.replace(/<p>\s*<img[^>]+src="[^"]+"[^>]*>\s*<\/p>/, '')
    }
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.heroImageUrl ? [post.heroImageUrl] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Subodh KC',
      url: 'https://subodhkc.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://subodhkc.com/portrait.jpeg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://subodhkc.com/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
    wordCount: post.contentHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://subodhkc.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://subodhkc.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://subodhkc.com/blog/${post.slug}` },
    ],
  }

  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      ...p,
      matchCount: p.keywords.filter((k) => post.keywords.includes(k)).length,
    }))
    .filter((p) => p.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3)

  return (
    <article style={{ maxWidth: 760, margin: '0 auto', padding: '80px 28px 120px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {post.faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faqJsonLd) }}
        />
      )}

      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 24,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-secondary)',
        }}
      >
        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>home</Link>
        <span>/</span>
        <Link href="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>blog</Link>
        <span>/</span>
        <span style={{ color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
          {post.slug}
        </span>
      </div>

      {/* Meta row */}
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
        <span>·</span>
        <span>{readingTime} min read</span>
        {post.keywords.length > 0 && (
          <>
            <span>·</span>
            <span style={{ color: 'var(--accent)' }}>
              {post.keywords.slice(0, 3).join(' · ')}
            </span>
          </>
        )}
      </div>

      <h1
        style={{
          fontSize: 'clamp(26px, 3.5vw, 40px)',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
          margin: '0 0 16px',
          color: 'var(--fg)',
        }}
      >
        {post.title}
      </h1>

      <div style={{ marginBottom: 24 }}>
        <ShareButtons title={post.title} slug={post.slug} />
      </div>

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

      <TableOfContents />

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />

      {/* Newsletter CTA */}
      <div style={{ marginTop: 48, marginBottom: 48 }}>
        <BlogNewsletterCTA />
      </div>

      {/* Author card */}
      <BlogAuthorCard />

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              margin: '0 0 20px',
            }}
          >
            Related articles
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {relatedPosts.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                style={{
                  display: 'block',
                  padding: 20,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  textDecoration: 'none',
                  color: 'var(--fg)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--text-secondary)',
                    marginBottom: 8,
                  }}
                >
                  {new Date(rp.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: 6,
                  }}
                >
                  {rp.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {rp.excerpt || rp.metaDescription}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div
        style={{
          marginTop: 48,
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
        <ShareButtons title={post.title} slug={post.slug} />
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
