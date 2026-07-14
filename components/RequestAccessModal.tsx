// components/RequestAccessModal.tsx
// Surfaces a private-beta product. Replaces 404s on private repos with a real
// conversation pathway: name / work email / what-are-you-doing message, sent
// to /api/contact with subject `Access: {product.name}`.
"use client";

import * as React from "react";
import { Glyph } from "./Glyph";
import type { Product } from "@/data/products";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export function RequestAccessModal({ product, onClose }: Props) {
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!product) return;
    setSent(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      subject: `Access request: ${product.name}`,
      product: product.id,
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    };
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // best-effort — the mailto fallback is still surfaced in the UI
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ra-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "color-mix(in oklab, var(--bg) 80%, #000 20%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
        animation: "ra-fade .2s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(540px, 100%)",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 28,
          position: "relative",
          boxShadow: "0 20px 60px color-mix(in oklab, var(--fg) 25%, transparent)",
          animation: "ra-rise .26s cubic-bezier(.2,.7,.2,1)",
        }}
      >
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            appearance: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: 4,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 3 L11 11 M11 3 L3 11" />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "var(--chip)",
              display: "grid",
              placeItems: "center",
              color: "var(--accent)",
            }}
          >
            <Glyph kind={product.glyph} size={26} />
          </span>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--accent)",
              }}
            >
              private beta · invite only
            </div>
            <h3
              id="ra-title"
              style={{ margin: "3px 0 0", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em" }}
            >
              {product.name}
            </h3>
          </div>
        </div>

        {sent ? (
          <div style={{ padding: "30px 0 6px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "color-mix(in oklab, var(--accent) 14%, transparent)",
                display: "grid",
                placeItems: "center",
                color: "var(--accent)",
                marginBottom: 14,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10 L8 14 L16 6" />
              </svg>
            </div>
            <h4 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Note received.</h4>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: 440 }}>
              I review every request personally. You'll hear back within 2 business days with next steps or
              scheduling a short call. If it's urgent, you can also reach me at{" "}
              <a href="mailto:Subodh.kc@haiec.com" style={{ color: "var(--accent)" }}>
                Subodh.kc@haiec.com
              </a>
              .
            </p>
            <div style={{ marginTop: 22 }}>
              <button
                onClick={onClose}
                style={{
                  appearance: "none",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--fg)",
                  borderRadius: 999,
                  padding: "8px 16px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                close
              </button>
            </div>
          </div>
        ) : (
          <>
            <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {product.name} isn't shipping a public download yet — I'm onboarding a small group of early
              operators by hand to make sure it's solving the right problem. Send a short note about your use
              case and I'll get back personally with access details.
            </p>

            <form
              onSubmit={onSubmit}
              style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    name
                  </span>
                  <input
                    name="name"
                    required
                    autoFocus
                    style={{
                      appearance: "none",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 11px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--fg)",
                      outline: "none",
                    }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    work email
                  </span>
                  <input
                    name="email"
                    type="email"
                    required
                    style={{
                      appearance: "none",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "9px 11px",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "var(--fg)",
                      outline: "none",
                    }}
                  />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  what are you trying to do with {product.name.toLowerCase()}?
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="A few sentences is plenty. The more concrete, the faster I can help."
                  style={{
                    appearance: "none",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "10px 11px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--fg)",
                    outline: "none",
                    resize: "vertical",
                    minHeight: 90,
                  }}
                />
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    appearance: "none",
                    border: "1px solid var(--fg)",
                    background: "var(--fg)",
                    color: "var(--bg)",
                    borderRadius: 999,
                    padding: "10px 18px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "sending…" : "send request →"}
                </button>
                <a
                  href={`mailto:Subodh.kc@haiec.com?subject=Access%20request%3A%20${encodeURIComponent(
                    product.name
                  )}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  or email me directly ↗
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
