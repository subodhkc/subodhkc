"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { calculateReadingTime } from "@/lib/blog-utils"
import type { BlogPostSummary } from "@/lib/blog"

interface BlogIndexClientProps {
  posts: BlogPostSummary[]
  blogJsonLd: Record<string, unknown>
}

const POSTS_PER_PAGE = 10

export function BlogIndexClient({ posts, blogJsonLd }: BlogIndexClientProps) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  // Extract all unique keywords with counts
  const allKeywords = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach((p) => {
      p.keywords.forEach((k) => {
        counts.set(k, (counts.get(k) || 0) + 1)
      })
    })
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (!activeKeyword) return posts
    return posts.filter((p) => p.keywords.includes(activeKeyword))
  }, [posts, activeKeyword])

  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  const featured = visiblePosts[0]
  const rest = visiblePosts.slice(1)

  const resetAndFilter = (kw: string | null) => {
    setActiveKeyword(kw)
    setVisibleCount(POSTS_PER_PAGE)
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 28px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Header */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--op-accent)",
          marginBottom: 16,
        }}
      >
        Blog
      </div>
      <h1
        style={{
          fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "0 0 16px",
          color: "var(--fg)",
        }}
      >
        AI Governance & Architecture
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          maxWidth: 560,
          margin: "0 0 40px",
        }}
      >
        Practical articles on AI governance, compliance automation, enterprise AI architecture,
        and production AI systems. No fluff — frameworks, patterns, and steps you can apply.
      </p>

      {/* Keyword filter pills */}
      {allKeywords.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          <button
            onClick={() => resetAndFilter(null)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 999,
              border: `1px solid ${activeKeyword === null ? "var(--op-accent)" : "var(--op-border)"}`,
              background: activeKeyword === null ? "var(--op-accent)" : "var(--op-card)",
              color: activeKeyword === null ? "var(--bg)" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            all
          </button>
          {allKeywords.map(([kw, count]) => (
            <button
              key={kw}
              onClick={() => resetAndFilter(activeKeyword === kw ? null : kw)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "5px 12px",
                borderRadius: 999,
                border: `1px solid ${activeKeyword === kw ? "var(--op-accent)" : "var(--op-border)"}`,
                background: activeKeyword === kw ? "var(--op-accent)" : "var(--op-card)",
                color: activeKeyword === kw ? "var(--bg)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {kw}
              <span style={{ opacity: 0.5 }}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {visiblePosts.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            border: "1px solid var(--op-border)",
            borderRadius: 8,
            background: "var(--op-card)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            No articles found{activeKeyword ? ` for "${activeKeyword}"` : ""}.
          </p>
        </div>
      ) : (
        <>
          {/* Featured post (only when no filter and on first page) */}
          {featured && !activeKeyword && visibleCount === POSTS_PER_PAGE && (
            <Link
              href={`/blog/${featured.slug}`}
              style={{
                display: "flex",
                gap: 32,
                padding: "40px 0",
                borderTop: "1px solid var(--op-border)",
                borderBottom: "1px solid var(--op-border)",
                textDecoration: "none",
                color: "var(--fg)",
                alignItems: "flex-start",
                transition: "opacity 0.15s",
              }}
              className="blog-card-hover"
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--op-accent)",
                    marginBottom: 12,
                  }}
                >
                  ★ Featured
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <time>
                    {new Date(featured.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{calculateReadingTime(featured.contentHtml)} min read</span>
                  {featured.keywords.length > 0 && (
                    <>
                      <span>·</span>
                      <span style={{ color: "var(--op-accent)" }}>
                        {featured.keywords.slice(0, 3).join(" · ")}
                      </span>
                    </>
                  )}
                </div>
                <h2
                  style={{
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    margin: "0 0 12px",
                  }}
                >
                  {featured.title}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-secondary)",
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
                    overflow: "hidden",
                    flexShrink: 0,
                    border: "1px solid var(--op-border)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.heroImageUrl}
                    alt={featured.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}
            </Link>
          )}

          {/* Regular posts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {(activeKeyword || visibleCount !== POSTS_PER_PAGE ? visiblePosts : rest).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: "flex",
                  gap: 24,
                  padding: "28px 0",
                  borderBottom: "1px solid var(--op-border)",
                  textDecoration: "none",
                  color: "var(--fg)",
                  transition: "opacity 0.15s",
                }}
                className="blog-card-hover"
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <time>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{calculateReadingTime(post.contentHtml)} min read</span>
                    {post.keywords.length > 0 && (
                      <span style={{ color: "var(--op-accent)" }}>
                        {post.keywords.slice(0, 3).join(" · ")}
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                      margin: "0 0 8px",
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
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
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid var(--op-border)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.heroImageUrl}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <button
                onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  padding: "10px 24px",
                  borderRadius: 999,
                  border: "1px solid var(--op-border)",
                  background: "var(--op-card)",
                  color: "var(--fg)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                load more ({filteredPosts.length - visibleCount} remaining) →
              </button>
            </div>
          )}

          {/* Results count */}
          <div
            style={{
              textAlign: "center",
              marginTop: 24,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
            }}
          >
            showing {visiblePosts.length} of {filteredPosts.length} articles
            {activeKeyword && ` · filtered by "${activeKeyword}"`}
          </div>
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
