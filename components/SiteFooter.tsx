// components/SiteFooter.tsx - operator footer with portrait, newsletter, sitemap
"use client";

import * as React from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import { SafeEmail } from "./SafeEmail";

function Arrow({ kind = "right" }: { kind?: "right" | "ext" }) {
  if (kind === "ext") {
    return (
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8 L8 4" />
        <path d="M5 4 H8 V7" />
      </svg>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6 H9" />
      <path d="M7 4 L9 6 L7 8" />
    </svg>
  );
}

const SITEMAP = [
  {
    head: "Work with Me",
    items: [
      ["/ai-advisor", "AI Advisor"],
      ["/advisory", "Fractional Advisor"],
      ["/services", "Architecture & Implementation"],
      ["/contact?subject=discuss-ai", "Discuss AI"],
    ],
  },
  {
    head: "Work",
    items: [
      ["/work", "Work Hub"],
      ["/portfolio", "Executive Portfolio"],
      ["/products", "Open Source & Systems"],
      ["/solutions/haiec", "HAIEC"],
      ["/solutions/kestrelvoice", "KestrelVoice"],
    ],
  },
  {
    head: "Insights",
    items: [
      ["/blog", "Writing"],
      ["/research", "Research"],
      ["/magazine", "Magazine"],
      ["/guides", "Guides"],
    ],
  },
  {
    head: "About",
    items: [
      ["/about", "About"],
      ["/executive-bio", "Executive Bio"],
      ["/speaking", "Speaking"],
      ["https://linkedin.com/in/subodhkc", "LinkedIn"],
      ["https://github.com/subodhkc", "GitHub"],
    ],
  },
  {
    head: "Legal",
    items: [
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
      ["/faq", "FAQ"],
    ],
  },
] as const;

let chamberWidgetInit = false;

export function SiteFooter() {
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [subscribeError, setSubscribeError] = React.useState<string | null>(null);
  const [chamberError, setChamberError] = React.useState(false);

  const initChamberWidget = React.useCallback(() => {
    if (chamberWidgetInit) return;
    const w = window as unknown as { MNI?: { Widgets: { Member: new (id: string, opts: Record<string, unknown>) => { create: () => void } } } };
    if (w.MNI) {
      chamberWidgetInit = true;
      try {
        new w.MNI.Widgets.Member("mni-membership-639195539486791546", {
          member: 18363,
          styleTemplate: "#@id{text-align:center;position:relative}#@id .mn-widget-member-name{font-weight:700}#@id .mn-widget-member-logo{max-width:100%}",
        }).create();
      } catch (e) {
        console.error("ChamberMaster widget init failed:", e);
        setChamberError(true);
      }
    }
  }, []);

  React.useEffect(() => {
    if (chamberWidgetInit) return;
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const w = window as unknown as { MNI?: unknown };
      if (w.MNI) {
        clearInterval(interval);
        initChamberWidget();
      } else if (attempts > 20) {
        clearInterval(interval);
        console.error("ChamberMaster script loaded but MNI not available after 10s");
        setChamberError(true);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [initChamberWidget]);

  const onSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    setSubscribeError(null);
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "form_submit", path: window.location.pathname, meta: { form: "newsletter" } }),
      }).catch(() => {});
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(fd.get("email") || ""), website: String(fd.get("website") || "") }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDone(true);
        } else {
          setSubscribeError(data.error || "Something went wrong. Please try again.");
        }
      } else {
        setSubscribeError("Failed to subscribe. Please try again.");
      }
    } catch {
      setSubscribeError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer id="contact" style={{ borderTop: "1px solid var(--op-border)", marginTop: 40, background: "var(--op-card)" }}>
      {/* About + portrait */}
      <div
        id="about"
        className="footer-about-grid"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "64px 28px 40px",
          display: "grid",
          gridTemplateColumns: "minmax(220px, 320px) 1fr",
          gap: 56,
          alignItems: "flex-start",
          borderBottom: "1px solid var(--op-border)",
        }}
      >
        <figure style={{ margin: 0, position: "relative" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 5",
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid var(--op-border)",
              background: "var(--chip)",
            }}
          >
            {([
              { pos: { top: 8, left: 8 },    deg: 0 },
              { pos: { top: 8, right: 8 },   deg: 90 },
              { pos: { bottom: 8, right: 8 }, deg: 180 },
              { pos: { bottom: 8, left: 8 }, deg: 270 },
            ]).map(({ pos, deg }, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="var(--op-accent)"
                strokeWidth="1.4"
                style={{
                  position: "absolute",
                  ...pos,
                  transform: `rotate(${deg}deg)`,
                  zIndex: 2,
                  opacity: 0.85,
                } as React.CSSProperties}
              >
                <path d="M2 8 V2 H8" strokeLinecap="round" />
              </svg>
            ))}
            <Image
              src="/portrait.jpeg"
              alt="Subodh KC, AI Advisor and AI Systems Architect"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              style={{
                objectFit: "cover",
                objectPosition: "center 18%",
                filter: "grayscale(0.18) contrast(1.04)",
              }}
            />
          </div>
          <figcaption
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
            }}
          >
            <span>fig.02 - operator</span>
            <span>Dallas, TX</span>
          </figcaption>
        </figure>

        <div>
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
            03 / about
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "var(--fg)",
            }}
          >
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>From possibility</span>{" "}
            to decision. From decision to production.
          </h3>
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              marginTop: 20,
              lineHeight: 1.65,
              maxWidth: 560,
            }}
          >
            AI Advisor and AI Systems Architect. Former Fortune 50 Core Team Lead and Senior Technical
            Program Manager. Founder of HAIEC and KestrelVoice. 16+ years across software,
            infrastructure, enterprise program delivery, and applied AI systems. M.Sc. Engineering &
            Technology Management, Louisiana Tech.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["Executive Bio", "/executive-bio"],
              ["Speaking", "/speaking"],
              ["Advisory", "/advisory"],
              ["Person Profile", "/person/subodh-kc"],
            ].map(([label, href]) => (
              <Link
                key={label as string}
                href={href as string}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "6px 11px",
                  borderRadius: 999,
                  border: "1px solid var(--op-border)",
                  color: "var(--fg)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  textDecoration: "none",
                }}
              >
                {label} <Arrow kind="right" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter + Reach + Now */}
      <div
        className="footer-info-grid"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px 28px 24px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          <h4
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              margin: "0 0 14px",
            }}
          >
            Newsletter
          </h4>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 0 14px", maxWidth: 460 }}>
            Occasional emails when I publish something worth reading. Unsubscribe anytime.
          </p>
          {done ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--op-accent)" }}>
              ✓ subscribed - see you in your inbox.
            </p>
          ) : (
            <form
              onSubmit={onSubscribe}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid var(--op-border)",
                borderRadius: 999,
                padding: 4,
                paddingLeft: 14,
                background: "var(--bg)",
                maxWidth: 420,
              }}
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
              />
              <input
                type="email"
                name="email"
                placeholder="you@company.com"
                required
                style={{
                  flex: 1,
                  appearance: "none",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--fg)",
                  padding: "8px 0",
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
                  borderRadius: 999,
                  padding: "8px 14px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: submitting ? "wait" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "…" : "subscribe →"}
              </button>
            </form>
          )}
          {subscribeError && (
            <p style={{ fontSize: 12, color: "#dc2626", margin: "6px 0 0" }}>
              {subscribeError}
            </p>
          )}
        </div>

        <div>
          <h4
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              margin: "0 0 14px",
            }}
          >
            Reach
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
            <li>
              <SafeEmail style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg)", textDecoration: "none" }}>
                admin@subodhkc.com <Arrow kind="ext" />
              </SafeEmail>
            </li>
            <li>
              <a href="https://linkedin.com/in/subodhkc" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", textDecoration: "none" }}>
                linkedin.com/in/subodhkc <Arrow kind="ext" />
              </a>
            </li>
            <li>
              <a href="https://github.com/subodhkc" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", textDecoration: "none" }}>
                github.com/subodhkc <Arrow kind="ext" />
              </a>
            </li>
            <li>
              <a href="https://medium.com/@subodhkc" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", textDecoration: "none" }}>
                medium.com/@subodhkc <Arrow kind="ext" />
              </a>
            </li>
            <li>
              <a href="/feed.xml" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", textDecoration: "none" }}>
                RSS feed <Arrow kind="ext" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              margin: "0 0 14px",
            }}
          >
            Now
          </h4>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8, fontSize: 14, color: "var(--text-secondary)" }}>
            <li><span style={{ color: "var(--fg)" }}>Advising</span> on AI decisions and systems</li>
            <li><span style={{ color: "var(--fg)" }}>Building</span> HAIEC and KestrelVoice</li>
            <li><span style={{ color: "var(--fg)" }}>Publishing</span> research and frameworks</li>
            <li><span style={{ color: "var(--fg)" }}>Open</span> for advisory and architecture work</li>
          </ul>
        </div>
      </div>

      {/* Sitemap */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 28px 28px", borderTop: "1px solid var(--op-border)" }}>
        <h4
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            margin: "0 0 16px",
          }}
        >
          Sitemap
        </h4>
        <div
          className="footer-sitemap-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 28,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          {SITEMAP.map((col) => (
            <div key={col.head}>
              <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{col.head}</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {col.items.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} style={{ color: "var(--fg)", textDecoration: "none" }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* HEB Chamber Member badge */}
      <div
        className="footer-chamber-badge"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "20px 28px",
          borderTop: "1px solid var(--op-border)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 80,
        }}
      >
        <div id="mni-membership-639195539486791546" />
        {chamberError && (
          <a
            href="https://hebtx.chambermaster.com/list/mbr/subodh-kc-18363"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              border: "1px solid var(--op-border)",
              borderRadius: 8,
              background: "var(--op-card)",
              color: "var(--fg)",
              textDecoration: "none",
              fontSize: 13,
              fontFamily: "var(--font-sans)",
            }}
          >
            HEB Chamber Member
          </a>
        )}
      </div>

      <Script
        src="https://hebtx.chambermaster.com/Content/Script/Member.js"
        strategy="afterInteractive"
        onLoad={() => initChamberWidget()}
        onError={() => {
          console.error("ChamberMaster script failed to load");
          setChamberError(true);
        }}
      />

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "16px 28px 28px",
          borderTop: "1px solid var(--op-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--op-muted)",
          letterSpacing: "0.02em",
        }}
      >
        <span>© 2026 Subodh Kumar KC · Dallas, Texas</span>
        <span style={{ display: "flex", gap: 16 }}>
          <Link href="/terms" style={{ color: "var(--op-muted)", textDecoration: "none" }}>Terms</Link>
          <Link href="/privacy" style={{ color: "var(--op-muted)", textDecoration: "none" }}>Privacy</Link>
          <span>v4.0 · last shipped {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
        </span>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .footer-about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 40px 20px 32px !important;
          }
          .footer-about-grid figure {
            max-width: 240px;
          }
          .footer-info-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 32px 20px 20px !important;
          }
          .footer-sitemap-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-sitemap-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .footer-chamber-badge {
            padding: 16px 20px !important;
          }
        }
      `}</style>
    </footer>
  );
}
