import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug, getAllPosts } from '@/lib/blog'
import { sanitizeHtml, calculateReadingTime } from '@/lib/blog-utils'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { BlogAuthorCard } from '@/components/blog/BlogAuthorCard'
import { BlogNewsletterCTA } from '@/components/blog/BlogNewsletterCTA'
import { BlogDownloadCTA } from '@/components/blog/BlogDownloadCTA'
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
        ...(post.heroImageUrl ? { images: [{ url: post.heroImageUrl }] } : {}),
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt || post.createdAt,
        authors: [post.author || 'Yeti AI Writer'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription,
        ...(post.heroImageUrl ? { images: [post.heroImageUrl] } : {}),
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

  const authorName = post.author || 'Subodh KC'

  // E-E-A-T: Author schema with sameAs links for verification
  const isSubodhKC = authorName === 'Subodh KC'
  const authorSchema = isSubodhKC
    ? {
        '@type': 'Person',
        name: 'Subodh KC',
        url: 'https://subodhkc.com/about',
        image: 'https://subodhkc.com/portrait.jpeg',
        jobTitle: 'AI Advisor & AI Systems Architect',
        worksFor: { '@type': 'Organization', name: 'SubodhKC.com', url: 'https://subodhkc.com' },
        sameAs: [
          'https://www.linkedin.com/in/subodhkc',
          'https://github.com/subodhkc',
          'https://twitter.com/subodhkc',
          'https://medium.com/@subodhkc',
          'https://www.wikidata.org/wiki/Q140546484',
        ],
        knowsAbout: [
          'AI governance', 'AI compliance', 'AI architecture', 'RAG systems',
          'AI risk management', 'TRAIGA', 'EU AI Act', 'NIST AI RMF', 'ISO 42001',
        ],
      }
    : {
        '@type': 'Person',
        name: authorName,
        url: 'https://subodhkc.com/about',
        description: 'AI-powered research and content engine for subodhkc.com, curated by Subodh KC.',
      }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.heroImageUrl ? [post.heroImageUrl] : [`https://subodhkc.com/blog/${post.slug}/opengraph-image`],
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: 'SubodhKC.com',
      url: 'https://subodhkc.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://subodhkc.com/portrait.jpeg',
      },
      founder: {
        '@type': 'Person',
        name: 'Subodh KC',
        url: 'https://subodhkc.com/about',
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
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: 20,
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
            <span style={{ color: 'var(--op-accent)' }}>
              {post.keywords.slice(0, 3).join(' · ')}
            </span>
          </>
        )}
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(34px, 5vw, 52px)',
          fontWeight: 400,
          letterSpacing: '-0.015em',
          lineHeight: 1.08,
          margin: '0 0 20px',
          color: 'var(--fg)',
        }}
      >
        {post.title}
      </h1>

      {(post.excerpt || post.metaDescription) && (
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(18px, 2.2vw, 21px)',
            fontStyle: 'italic',
            lineHeight: 1.55,
            color: 'var(--text-secondary)',
            margin: '0 0 28px',
          }}
        >
          {post.excerpt || post.metaDescription}
        </p>
      )}

      <div style={{ marginBottom: 28 }}>
        <ShareButtons title={post.title} slug={post.slug} />
      </div>

      {post.heroImageUrl && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 48,
            border: '1px solid var(--op-border)',
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

      {/* Downloadable checklist CTA */}
      {post.downloadableUrl && post.downloadableLabel && (
        <BlogDownloadCTA downloadableUrl={post.downloadableUrl} downloadableLabel={post.downloadableLabel} />
      )}

      {/* Newsletter CTA */}
      <div style={{ marginTop: 48, marginBottom: 48 }}>
        <BlogNewsletterCTA />
      </div>

      {/* Author card */}
      <BlogAuthorCard author={post.author} />

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
                  border: '1px solid var(--op-border)',
                  background: 'var(--op-card)',
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
          borderTop: '1px solid var(--op-border)',
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
            border: '1px solid var(--op-border)',
          }}
        >
          ← all articles
        </Link>
        <ShareButtons title={post.title} slug={post.slug} />
      </div>

      <style>{`
        .blog-content {
          color: var(--fg);
          font-size: 17px;
          line-height: 1.8;
        }
        .blog-content h1 {
          font-family: var(--font-serif);
          font-size: 36px;
          font-weight: 400;
          letter-spacing: -0.015em;
          line-height: 1.15;
          margin: 56px 0 20px;
          color: var(--fg);
        }
        .blog-content h2 {
          font-family: var(--font-serif);
          font-size: 30px;
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.2;
          margin: 52px 0 16px;
          color: var(--fg);
        }
        .blog-content h3 {
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.005em;
          margin: 36px 0 12px;
          color: var(--fg);
        }
        .blog-content h4 {
          font-size: 16px;
          font-weight: 600;
          margin: 28px 0 10px;
          color: var(--fg);
        }
        .blog-content p {
          margin: 0 0 20px;
          color: var(--fg);
        }
        .blog-content ul, .blog-content ol {
          margin: 0 0 20px;
          padding-left: 26px;
        }
        .blog-content li {
          margin-bottom: 10px;
          color: var(--fg);
        }
        .blog-content li::marker {
          color: var(--op-accent);
        }
        .blog-content a {
          color: var(--op-accent);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: opacity 120ms ease;
        }
        .blog-content a:hover {
          opacity: 0.75;
        }
        .blog-content strong {
          font-weight: 600;
        }
        .blog-content blockquote {
          margin: 32px 0;
          padding: 20px 24px;
          border-left: 3px solid var(--op-accent);
          background: var(--op-card);
          border-radius: 0 8px 8px 0;
          color: var(--text-secondary);
          font-family: var(--font-serif);
          font-size: 19px;
          font-style: italic;
          line-height: 1.6;
        }
        .blog-content blockquote p:last-child {
          margin-bottom: 0;
        }
        .blog-content code {
          font-family: var(--font-mono);
          font-size: 0.85em;
          background: var(--op-card);
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid var(--op-border);
        }
        .blog-content pre {
          margin: 28px 0;
          padding: 22px 24px;
          background: var(--op-card);
          border-radius: 10px;
          border: 1px solid var(--op-border);
          overflow-x: auto;
          font-size: 14px;
          line-height: 1.6;
        }
        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
        }
        .blog-content pre[data-diagram] {
          text-align: center;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          border: 1px solid var(--op-border);
          margin: 28px 0;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 28px 0;
          font-size: 15px;
        }
        .blog-content th, .blog-content td {
          padding: 12px 16px;
          border: 1px solid var(--op-border);
          text-align: left;
          vertical-align: top;
        }
        .blog-content th {
          background: var(--op-card);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .blog-content hr {
          border: none;
          border-top: 1px solid var(--op-border);
          margin: 48px 0;
        }
        @media (max-width: 768px) {
          .blog-content {
            font-size: 16px;
          }
          .blog-content h1 {
            font-size: 28px;
          }
          .blog-content h2 {
            font-size: 24px;
            margin-top: 40px;
          }
          .blog-content blockquote {
            font-size: 17px;
          }
        }
      `}</style>
    </article>
  )
}
