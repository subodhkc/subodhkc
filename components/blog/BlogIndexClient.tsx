"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { BlogPostSummary } from "@/lib/blog"

interface BlogIndexClientProps {
  posts: BlogPostSummary[]
  blogJsonLd: Record<string, unknown>
  breadcrumbJsonLd?: Record<string, unknown>
}

const POSTS_PER_PAGE = 16

type NoteColor = "default" | "warm" | "cool" | "tinted" | "paper" | "stark"
type NoteTitleStyle = "serif" | "mono" | "sans" | "italic"
type NotePin = "pin" | "tape"
type NoteMeta = "full" | "date" | "keyword" | "readtime" | "none"

interface NoteVariant {
  color: NoteColor
  titleStyle: NoteTitleStyle
  titleSize: string
  pin: NotePin
  rotation: number
  showExcerpt: boolean
  excerptStyle: "sans" | "serif"
  meta: NoteMeta
  showTag: boolean
}

const NOTE_VARIANTS: NoteVariant[] = [
  { color: "tinted", titleStyle: "serif", titleSize: "clamp(22px, 3vw, 30px)", pin: "pin", rotation: -1.5, showExcerpt: true, excerptStyle: "serif", meta: "full", showTag: true },
  { color: "warm", titleStyle: "mono", titleSize: "16px", pin: "tape", rotation: 1.2, showExcerpt: true, excerptStyle: "sans", meta: "date", showTag: false },
  { color: "cool", titleStyle: "sans", titleSize: "18px", pin: "pin", rotation: -0.8, showExcerpt: false, excerptStyle: "sans", meta: "keyword", showTag: true },
  { color: "stark", titleStyle: "italic", titleSize: "20px", pin: "pin", rotation: 2.0, showExcerpt: true, excerptStyle: "serif", meta: "readtime", showTag: false },
  { color: "paper", titleStyle: "serif", titleSize: "15px", pin: "tape", rotation: -2.2, showExcerpt: false, excerptStyle: "sans", meta: "date", showTag: true },
  { color: "default", titleStyle: "mono", titleSize: "17px", pin: "pin", rotation: 0.8, showExcerpt: true, excerptStyle: "sans", meta: "full", showTag: false },
  { color: "warm", titleStyle: "italic", titleSize: "clamp(20px, 2.5vw, 26px)", pin: "pin", rotation: -1.2, showExcerpt: true, excerptStyle: "serif", meta: "none", showTag: true },
  { color: "cool", titleStyle: "sans", titleSize: "15px", pin: "tape", rotation: 1.8, showExcerpt: false, excerptStyle: "sans", meta: "keyword", showTag: false },
  { color: "tinted", titleStyle: "mono", titleSize: "14px", pin: "pin", rotation: -0.5, showExcerpt: true, excerptStyle: "sans", meta: "date", showTag: true },
  { color: "stark", titleStyle: "serif", titleSize: "19px", pin: "pin", rotation: 1.5, showExcerpt: true, excerptStyle: "serif", meta: "readtime", showTag: false },
  { color: "paper", titleStyle: "sans", titleSize: "16px", pin: "tape", rotation: -1.8, showExcerpt: false, excerptStyle: "sans", meta: "full", showTag: true },
  { color: "default", titleStyle: "italic", titleSize: "18px", pin: "pin", rotation: 0.5, showExcerpt: true, excerptStyle: "serif", meta: "date", showTag: false },
  { color: "warm", titleStyle: "mono", titleSize: "15px", pin: "pin", rotation: -2.5, showExcerpt: true, excerptStyle: "sans", meta: "keyword", showTag: true },
  { color: "cool", titleStyle: "serif", titleSize: "clamp(18px, 2.5vw, 24px)", pin: "tape", rotation: 1.0, showExcerpt: true, excerptStyle: "serif", meta: "none", showTag: false },
  { color: "stark", titleStyle: "sans", titleSize: "14px", pin: "pin", rotation: -1.0, showExcerpt: false, excerptStyle: "sans", meta: "date", showTag: true },
  { color: "tinted", titleStyle: "italic", titleSize: "17px", pin: "pin", rotation: 2.2, showExcerpt: true, excerptStyle: "sans", meta: "full", showTag: false },
]

function getVariant(index: number): NoteVariant {
  return NOTE_VARIANTS[index % NOTE_VARIANTS.length]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function BlogIndexClient({ posts, blogJsonLd, breadcrumbJsonLd }: BlogIndexClientProps) {
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

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

  const resetAndFilter = (kw: string | null) => {
    setActiveKeyword(kw)
    setVisibleCount(POSTS_PER_PAGE)
  }

  function renderNote(post: BlogPostSummary, index: number) {
    const v = getVariant(index)
    const colorClass = `blog-note-${v.color}`
    const pinClass = v.pin === "tape" ? "blog-note-taped" : ""
    const titleClass = `blog-note-title-${v.titleStyle}`
    const excerptClass = v.excerptStyle === "serif" ? "blog-note-excerpt-serif" : "blog-note-excerpt"
    const readTime = post.readingTimeMinutes
    const date = formatDate(post.createdAt)

    let metaContent: React.ReactNode = null
    if (v.meta === "full") {
      metaContent = (
        <>
          <time>{date}</time>
          <span>·</span>
          <span>{readTime} min</span>
          {post.keywords.length > 0 && (
            <>
              <span>·</span>
              <span className="blog-note-accent">{post.keywords[0]}</span>
            </>
          )}
        </>
      )
    } else if (v.meta === "date") {
      metaContent = <time>{date}</time>
    } else if (v.meta === "keyword") {
      metaContent = post.keywords.length > 0 ? (
        <span className="blog-note-accent">{post.keywords.slice(0, 2).join(" · ")}</span>
      ) : <time>{date}</time>
    } else if (v.meta === "readtime") {
      metaContent = <span>{readTime} min read</span>
    }

    return (
      <Link
        key={post.slug}
        href={`/blog/${post.slug}`}
        className={`blog-sticky-note ${colorClass} ${pinClass}`}
        style={{ transform: `rotate(${v.rotation}deg)` }}
      >
        <h2 className={titleClass} style={{ fontSize: v.titleSize }}>
          {post.title}
        </h2>
        {v.showExcerpt && (post.excerpt || post.metaDescription) && (
          <p className={excerptClass}>{post.excerpt || post.metaDescription}</p>
        )}
        {metaContent && (
          <div className="blog-note-meta">{metaContent}</div>
        )}
        {v.showTag && post.keywords.length > 0 && (
          <span className="blog-note-tag">{post.keywords[0]}</span>
        )}
      </Link>
    )
  }

  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 28px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}

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
        Writing
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
        Articles and field notes on AI systems, governance, decisions, architecture,
        compliance automation, and production AI. Practical writing from enterprise
        implementation experience.
      </p>

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
          <div className="blog-notes-board">
            {visiblePosts.map((post, i) => renderNote(post, i))}
          </div>

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
    </div>
  )
}
