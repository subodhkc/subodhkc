'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchEntry } from '@/lib/search-index'

interface ScoredResult {
  entry: SearchEntry
  score: number
}

function searchEntries(query: string, entries: SearchEntry[]): ScoredResult[] {
  const lowerQuery = query.toLowerCase().trim()
  if (lowerQuery.length < 2) return []

  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length >= 2)

  const scored: ScoredResult[] = entries.map((entry) => {
    const lowerTitle = entry.title.toLowerCase()
    const lowerDesc = entry.description.toLowerCase()
    const lowerCat = entry.category.toLowerCase()
    const lowerKeywords = entry.keywords.toLowerCase()

    let score = 0

    if (lowerTitle.includes(lowerQuery)) score += 10
    if (lowerDesc.includes(lowerQuery)) score += 5
    if (lowerKeywords.includes(lowerQuery)) score += 4
    if (lowerCat.includes(lowerQuery)) score += 3

    for (const word of queryWords) {
      if (lowerTitle.includes(word)) score += 3
      if (lowerDesc.includes(word)) score += 2
      if (lowerKeywords.includes(word)) score += 2
      if (lowerCat.includes(word)) score += 1
    }

    return { entry, score }
  })

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}

const categoryColors: Record<string, string> = {
  Blog: '#16d088',
  Guide: '#c75c2a',
  Tool: '#6e8a7a',
  Product: '#9a9a96',
  Solution: '#c4c4be',
  Page: '#9a9a96',
  Profile: '#c4c4be',
  Course: '#16d088',
  Resource: '#9a9a96',
  Service: '#c4c4be',
}

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  entries: SearchEntry[]
}

export function SearchDialog({ isOpen, onClose, entries }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const results = useMemo(() => searchEntries(query, entries), [query, entries])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      onClose()
    },
    [router, onClose]
  )

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        navigate(results[selectedIndex].entry.href)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, navigate, onClose])

  useEffect(() => {
    if (resultsRef.current && resultsRef.current.children[selectedIndex]) {
      const child = resultsRef.current.children[selectedIndex] as HTMLElement
      child.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <style>{`
        .search-dialog-input::placeholder { color: var(--op-muted); }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />
      <div
        role="dialog"
        aria-label="Search"
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          width: '100%',
          maxWidth: 640,
          marginTop: '12vh',
          marginInline: 'auto',
          padding: '0 16px',
        }}
      >
        <div
          style={{
            background: 'var(--op-card)',
            border: '1px solid var(--op-border)',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }}
        >
          {/* Input row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 16px',
              borderBottom: results.length > 0 ? '1px solid var(--op-border)' : 'none',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="var(--op-muted)"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="8" cy="8" r="5.5" />
              <path d="M12.5 12.5 L16 16" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, tools, guides, products..."
              aria-label="Search"
              className="search-dialog-input"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--fg)',
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
              }}
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              style={{
                appearance: 'none',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--op-muted)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 3 L13 13 M13 3 L3 13" />
              </svg>
            </button>
          </div>

          {/* Results */}
          <div ref={resultsRef} style={{ maxHeight: 'min(60vh, 420px)', overflowY: 'auto' }}>
            {query.trim().length >= 2 && results.length === 0 && (
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--op-muted)',
                }}
              >
                No results for &ldquo;{query}&rdquo;
              </div>
            )}

            {query.trim().length < 2 && (
              <div style={{ padding: '20px 16px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--op-muted)',
                    marginBottom: 12,
                  }}
                >
                  Quick Links
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { label: 'Blog', href: '/blog' },
                    { label: 'EU AI Act Guide', href: '/guides/eu-ai-act' },
                    { label: 'AI Risk Register', href: '/ai-risk-register' },
                    { label: 'Architecture Decision Sheet', href: '/architecture-decision-master-sheet' },
                    { label: 'LLMVerify', href: '/products/llmverify' },
                    { label: 'HAIEC', href: '/solutions/haiec' },
                    { label: 'KestrelVoice', href: '/solutions/kestrelvoice' },
                    { label: 'Resume', href: '/resume' },
                  ].map((item) => (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      style={{
                        appearance: 'none',
                        border: '1px solid var(--op-border)',
                        background: 'var(--chip)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        padding: '6px 12px',
                        borderRadius: 999,
                        cursor: 'pointer',
                        transition: 'background 0.12s, border-color 0.12s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--card-hover)'
                        e.currentTarget.style.borderColor = 'var(--op-muted)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--chip)'
                        e.currentTarget.style.borderColor = 'var(--op-border)'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results.length > 0 && (
              <div style={{ padding: '6px' }}>
                {results.map((result, index) => {
                  const catColor = categoryColors[result.entry.category] || 'var(--op-muted)'
                  return (
                    <button
                      key={result.entry.href}
                      onClick={() => navigate(result.entry.href)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: index === selectedIndex ? 'var(--card-hover)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.08s',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontFamily: 'var(--font-mono)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              color: catColor,
                              flexShrink: 0,
                            }}
                          >
                            {result.entry.category}
                          </span>
                          <span
                            style={{
                              fontSize: 13.5,
                              fontWeight: 500,
                              color: 'var(--fg)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {result.entry.title}
                          </span>
                        </div>
                        {result.entry.description && (
                          <div
                            style={{
                              fontSize: 12,
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--text-secondary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {result.entry.description}
                          </div>
                        )}
                      </div>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="var(--op-muted)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        style={{ flexShrink: 0, marginTop: 3, opacity: index === selectedIndex ? 1 : 0.4 }}
                      >
                        <path d="M3 7 L11 7 M7.5 3.5 L11 7 L7.5 10.5" />
                      </svg>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '8px 16px',
              borderTop: '1px solid var(--op-border)',
              background: 'var(--code)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--op-muted)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <kbd style={kbdStyle}>↑</kbd>
              <kbd style={kbdStyle}>↓</kbd>
              navigate
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <kbd style={kbdStyle}>↵</kbd>
              select
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <kbd style={kbdStyle}>esc</kbd>
              close
            </span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
              {entries.length} pages indexed
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

const kbdStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  border: '1px solid var(--op-border)',
  borderRadius: 4,
  background: 'var(--op-card)',
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)',
}
