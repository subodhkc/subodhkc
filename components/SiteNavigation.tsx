// components/SiteNavigation.tsx — operator-aesthetic nav with full mobile menu
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const products = [
  { name: "llmverify", href: "/products/llmverify", desc: "LLM output verification" },
  { name: "Print Later", href: "/products/print-later", desc: "Save now, print later" },
  { name: "PDF Redactor", href: "/products/pdf-redactor", desc: "AI PII redaction" },
  { name: "Doc Timeline", href: "/products/doc-timeline", desc: "Document timeline extraction" },
  { name: "SKC Log Analyser", href: "/products/skc-log-analyser", desc: "AI log analysis" },
  { name: "CourtCase", href: "/products/courtcase", desc: "Legal doc organization" },
];

const solutions = [
  { name: "HAIEC", href: "/solutions/haiec", desc: "AI Compliance & Governance" },
  { name: "KestrelVoice", href: "/solutions/kestrelvoice", desc: "AI Voice Operations" },
  { name: "FrontOfAI", href: "/solutions/frontofai", desc: "Enterprise AI Solutions" },
  { name: "CourtCase", href: "/solutions/courtcase", desc: "AI Court Evidence" },
  { name: "AI Briefing", href: "/solutions/ai-briefing", desc: "Weekly AI Intelligence" },
];

const navLinks = [
  { label: "about", href: "/about" },
  { label: "services", href: "/services" },
  { label: "writing", href: "/writing" },
  { label: "research", href: "/research" },
  { label: "contact", href: "/contact" },
];

export function SiteNavigation() {
  const [open, setOpen] = React.useState<null | "products" | "solutions">(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClickDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", onClickDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const dropdown = (items: typeof products) => (
    <div
      role="menu"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        minWidth: 280,
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 6,
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        zIndex: 40,
      }}
    >
      {items.map((it) => (
        <Link
          key={it.name}
          href={it.href}
          onClick={() => setOpen(null)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "9px 11px",
            borderRadius: 6,
            color: "var(--fg)",
            transition: "background .12s",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{it.name}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>
            {it.desc}
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "color-mix(in oklab, var(--bg) 86%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid var(--border)",
                display: "inline-block",
                flexShrink: 0,
                background: "var(--chip)",
                position: "relative",
              }}
            >
              <Image
                src="/portrait.jpeg"
                alt="Subodh KC"
                width={28}
                height={28}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 22%",
                  filter: "grayscale(0.1) contrast(1.02)",
                }}
              />
            </span>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.005em", color: "var(--fg)" }}>Subodh KC</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--muted)",
                marginLeft: 4,
                borderLeft: "1px solid var(--border)",
                paddingLeft: 10,
              }}
              className="nav-registry-label"
            >
              /registry
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            ref={menuRef}
            className="nav-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
          >
            <Link href="/about" style={{ color: "var(--muted)", textDecoration: "none" }}>about</Link>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "solutions" ? null : "solutions")}
                style={{
                  appearance: "none",
                  border: "none",
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  color: open === "solutions" ? "var(--fg)" : "var(--muted)",
                }}
              >
                solutions
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "solutions" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "solutions" && dropdown(solutions)}
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "products" ? null : "products")}
                style={{
                  appearance: "none",
                  border: "none",
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  cursor: "pointer",
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  color: open === "products" ? "var(--fg)" : "var(--muted)",
                }}
              >
                products
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "products" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "products" && dropdown(products)}
            </div>

            <Link href="/services" style={{ color: "var(--muted)", textDecoration: "none" }}>services</Link>
            <Link href="/writing" style={{ color: "var(--muted)", textDecoration: "none" }}>writing</Link>
            <Link href="/research" style={{ color: "var(--muted)", textDecoration: "none" }}>research</Link>
            <Link href="/contact" style={{ color: "var(--muted)", textDecoration: "none" }}>contact</Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/contact"
              className="nav-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 13px",
                border: "1px solid var(--fg)",
                background: "var(--fg)",
                color: "var(--bg)",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              let&apos;s talk →
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-hamburger"
              style={{
                appearance: "none",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--fg)",
                borderRadius: 6,
                padding: "6px 8px",
                cursor: "pointer",
                display: "none",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 3 L15 15 M15 3 L3 15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <line x1="2" y1="5" x2="16" y2="5" />
                  <line x1="2" y1="9" x2="16" y2="9" />
                  <line x1="2" y1="13" x2="16" y2="13" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
          }}
        >
          {/* backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          />
          {/* drawer */}
          <div
            style={{
              position: "relative",
              marginLeft: "auto",
              width: "min(320px, 88vw)",
              height: "100%",
              background: "var(--card)",
              borderLeft: "1px solid var(--border)",
              overflowY: "auto",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--fg)" }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Subodh KC</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ appearance: "none", border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", padding: 4 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 3 L13 13 M13 3 L3 13" />
                </svg>
              </button>
            </div>

            {/* Main links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: "var(--fg)",
                    padding: "10px 12px",
                    borderRadius: 6,
                    textDecoration: "none",
                    display: "block",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Solutions section */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10, padding: "0 12px" }}>Solutions</div>
              {solutions.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: "9px 12px",
                    borderRadius: 6,
                    textDecoration: "none",
                    color: "var(--fg)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--muted)" }}>{s.desc}</span>
                </Link>
              ))}
            </div>

            {/* Products section */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10, padding: "0 12px" }}>Products</div>
              {products.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: "9px 12px",
                    borderRadius: 6,
                    textDecoration: "none",
                    color: "var(--fg)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--muted)" }}>{p.desc}</span>
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px 16px",
                border: "1px solid var(--fg)",
                background: "var(--fg)",
                color: "var(--bg)",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              let&apos;s talk →
            </Link>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-registry-label { display: none; }
        }
        @media (min-width: 861px) {
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
}
