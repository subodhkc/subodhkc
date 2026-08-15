"use client"

import { useState } from "react"

export function BlogNewsletterCTA() {
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-article", website }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          setDone(true)
        } else {
          setError(data.error || "Something went wrong. Please try again.")
        }
      } else {
        setError("Failed to subscribe. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div
        style={{
          padding: "24px",
          borderRadius: 8,
          border: "1px solid var(--op-accent)",
          background: "var(--op-card)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--op-accent)",
            margin: 0,
          }}
        >
          ✓ Subscribed - see you in your inbox.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        border: "1px solid var(--op-border)",
        background: "var(--op-card)",
      }}
    >
      <h3
        style={{
          fontSize: 16,
          fontWeight: 500,
          margin: "0 0 6px",
          color: "var(--fg)",
        }}
      >
        Get new articles in your inbox
      </h3>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}
      >
        Occasional emails when I publish something worth reading. Unsubscribe anytime.
      </p>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          style={{
            flex: 1,
            appearance: "none",
            border: "1px solid var(--op-border)",
            borderRadius: 6,
            background: "var(--bg)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--fg)",
            padding: "8px 12px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            appearance: "none",
            border: "none",
            background: "var(--fg)",
            color: "var(--bg)",
            borderRadius: 6,
            padding: "8px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 500,
            cursor: submitting ? "wait" : "pointer",
            opacity: submitting ? 0.7 : 1,
            whiteSpace: "nowrap",
          }}
        >
          {submitting ? "…" : "subscribe →"}
        </button>
      </form>
      {error && (
        <p style={{ fontSize: 12, color: "#dc2626", margin: "8px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  )
}
