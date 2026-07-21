"use client"

import { useState } from "react"

export function BlogNewsletterCTA() {
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog-article" }),
      })
      setDone(true)
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
          border: "1px solid var(--accent)",
          background: "var(--card)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--accent)",
            margin: 0,
          }}
        >
          ✓ Subscribed — see you in your inbox.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--card)",
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
        One email when something ships. No drips. No funnels.
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          style={{
            flex: 1,
            appearance: "none",
            border: "1px solid var(--border)",
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
    </div>
  )
}
