"use client"

import { useState, useEffect } from "react"

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const article = document.querySelector(".blog-content")
    if (!article) return

    const h2s = article.querySelectorAll("h2, h3")
    const items: TocItem[] = []

    h2s.forEach((el, idx) => {
      const text = el.textContent || ""
      const id = `toc-${idx}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
      el.id = id
      items.push({
        id,
        text,
        level: el.tagName === "H2" ? 2 : 3,
      })
    })

    setHeadings(items)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px", threshold: 0 }
    )

    h2s.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (headings.length < 3) return null

  return (
    <nav
      style={{
        padding: 20,
        borderRadius: 8,
        border: "1px solid var(--op-border)",
        background: "var(--op-card)",
        marginBottom: 32,
      }}
      aria-label="Table of contents"
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          marginBottom: 12,
        }}
      >
        Contents
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map((h) => (
          <li
            key={h.id}
            style={{
              marginLeft: h.level === 3 ? 16 : 0,
              marginBottom: 6,
            }}
          >
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(h.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
              style={{
                fontSize: 13,
                color: activeId === h.id ? "var(--op-accent)" : "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.15s",
                display: "block",
                lineHeight: 1.4,
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
