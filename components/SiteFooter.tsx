// components/SiteFooter.tsx — operator footer with portrait, newsletter, sitemap
"use client";

import * as React from "react";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";

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
    head: "Site",
    items: [
      ["/", "home"],
      ["/about", "about"],
      ["/services", "services"],
      ["/contact", "contact"],
    ],
  },
  {
    head: "Solutions",
    items: [
      ["/solutions/haiec", "haiec"],
      ["/solutions/kestrelvoice", "kestrelvoice"],
      ["/solutions/frontofai", "frontofai"],
      ["/solutions/courtcase", "courtcase"],
      ["/solutions/ai-briefing", "ai briefing"],
    ],
  },
  {
    head: "Products",
    items: [
      ["/products/llmverify", "llmverify"],
      ["/products/print-later", "print later"],
      ["/products/pdf-redactor", "pdf redactor"],
      ["/products/doc-timeline", "doc timeline"],
      ["/products/skc-log-analyser", "log analyser"],
      ["/products/courtcase", "courtcase"],
    ],
  },
  {
    head: "Articles",
    items: [
      ["/blog", "blog"],
      ["/secure-enterprise-rag-architecture", "secure RAG architecture"],
      ["/build-internal-ai-applications-streamlit-rag-mcp", "internal AI apps with Streamlit"],
      ["/does-texas-ai-law-apply-to-my-business", "does the Texas AI law apply?"],
      ["/how-to-secure-and-govern-ai", "how to secure and govern AI"],
      ["/why-ai-voice-agents-fail-in-production", "why AI voice agents fail"],
      ["/ai-voice-agent-architecture", "AI voice agent architecture"],
      ["/kestrel-voice-ai-receptionist-platform", "Kestrel Voice AI receptionist"],
      ["/architecture-decision-master-sheet", "architecture decision master sheet"],
    ],
  },
  {
    head: "Resources",
    items: [
      ["/writing", "writing"],
      ["/ai-security-tools", "AI security tools"],
      ["/solutions/haiec/exposure-assessment", "exposure assessment"],
      ["/research", "research"],
      ["/speaking", "speaking"],
      ["/advisory", "advisory"],
      ["/faq", "faq"],
    ],
  },
  {
    head: "Training",
    items: [
      ["/course", "AI Governance Course"],
      ["/webinar/ai-laws-small-business", "AI Laws Webinar"],
    ],
  },
  {
    head: "Compliance",
    items: [
      ["/guides", "AI compliance guides"],
      ["/guides/texas-ai-law", "Texas AI law"],
      ["/guides/eu-ai-act", "EU AI Act"],
      ["/guides/nyc-local-law-144", "NYC LL144"],
    ],
  },
  {
    head: "About me",
    items: [
      ["/executive-bio", "executive bio"],
      ["/person/subodh-kc", "person profile"],
      ["/resume", "resume"],
      ["/portfolio", "executive portfolio"],
      ["/magazine", "AI magazine"],
      ["/haiec", "haiec platform"],
    ],
  },
] as const;

let chamberWidgetInit = false;

export function SiteFooter() {
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
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
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "form_submit", path: window.location.pathname, meta: { form: "newsletter" } }),
      }).catch(() => {});
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(fd.get("email") || "") }),
      });
    } finally {
      setSubmitting(false);
      setDone(true);
    }
  };

  return (
    <footer id="contact" style={{ borderTop: "1px solid var(--border)", marginTop: 40, background: "var(--card)" }}>
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
          borderBottom: "1px solid var(--border)",
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
              border: "1px solid var(--border)",
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
                stroke="var(--accent)"
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
              alt="Subodh KC, founder of HAIEC"
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
            <span>fig.02 — operator</span>
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
              color: "var(--accent)",
              marginBottom: 16,
            }}
          >
            §03 / about
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
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>Architecting</span>{" "}
            governance frameworks that enable sustainable AI innovation.
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
            Former Fortune 50 AI Strategy CTL. Founder of HAIEC — Holistic AI Ethics & Compliance. M.Sc.
            Engineering & Technology Management, Louisiana Tech. 16+ years of full-stack engineering from
            startups to global enterprise. Open for consulting, advisory boards, and research partnerships.
          </p>
          <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["Executive Bio", "/executive-bio"],
              ["Speaking", "/speaking"],
              ["Advisory", "/advisory"],
              ["Resume", "/resume"],
            ].map(([label, href]) => (
              <Link
                key={label as string}
                href={href as string}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "6px 11px",
                  borderRadius: 999,
                  border: "1px solid var(--border)",
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
            One email when something ships. No drips. No funnels.
          </p>
          {done ? (
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)" }}>
              ✓ subscribed — see you in your inbox.
            </p>
          ) : (
            <form
              onSubmit={onSubscribe}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: 4,
                paddingLeft: 14,
                background: "var(--bg)",
                maxWidth: 420,
              }}
            >
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
              <a href="mailto:subodhkc@subodhkc.com" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg)", textDecoration: "none" }}>
                subodhkc@subodhkc.com <Arrow kind="ext" />
              </a>
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
            <li><span style={{ color: "var(--fg)" }}>Building</span> HAIEC — compliance platform</li>
            <li><span style={{ color: "var(--fg)" }}>Deploying</span> KestrelVoice + FrontOfAI</li>
            <li><span style={{ color: "var(--fg)" }}>Researching</span> deterministic compliance</li>
            <li><span style={{ color: "var(--fg)" }}>Advising</span> on AI transformation</li>
          </ul>
        </div>
      </div>

      {/* Sitemap */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 28px 28px", borderTop: "1px solid var(--border)" }}>
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
            gridTemplateColumns: "repeat(8, 1fr)",
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
          borderTop: "1px solid var(--border)",
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
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--card)",
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

      {/* Listed On — directory badges (add as directories approve submissions) */}
      <div
        className="footer-listed-on"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "16px 28px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
            marginRight: 4,
          }}
        >
          Listed on
        </span>
        <a
          href="https://startupbase.io/products/ai-advisor-subodh-kc?utm_source=startupbase&utm_medium=badge&utm_campaign=featured-badge-dark"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", height: 32 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://statics.startupbase.io/site/badges/featured-on-sb-dark.svg"
            alt="Featured on StartupBase"
            style={{ height: 32, width: "auto" }}
          />
        </a>
        <a
          href="https://postyourstartup.co/startup/subodh-kc?ref=badge"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", height: 55 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://postyourstartup.co/api/badge/subodh-kc?theme=dark"
            alt="Featured on PostYourStartup"
            width={212}
            height={55}
            style={{ height: 55, width: "auto" }}
          />
        </a>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "16px 28px 28px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--muted)",
          letterSpacing: "0.02em",
        }}
      >
        <span>© 2026 Subodh Kumar KC · Dallas, Texas</span>
        <span>v3.1 · last shipped {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
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
            grid-template-columns: repeat(4, 1fr) !important;
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
          .footer-listed-on {
            padding: 12px 20px !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </footer>
  );
}
