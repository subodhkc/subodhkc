// components/SiteNavigation.tsx - operator-aesthetic nav with full mobile menu
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import { SearchDialog } from "./SearchDialog";
import type { SearchEntry } from "@/lib/search-index";

const solutionsLinks = [
  { name: "AI Automation Blueprint", href: "/ai-automation", desc: "Find the workflow worth improving" },
  { name: "AI Voice Agent", href: "/ai-voice-agent", desc: "Turn more calls into completed actions" },
  { name: "AI Security & Compliance", href: "/ai-security-compliance", desc: "AI risk, controls, documentation" },
  { name: "Local AI Review", href: "/local-ai-review", desc: "AI opportunities for local business" },
  { name: "Direct Advisory", href: "/advisory", desc: "An AI advisor in the room" },
  { name: "SaaS Security Review", href: "/saas-security-review", desc: "Tenant isolation audit" },
];

const insightsLinks = [
  { name: "Blog", href: "/blog", desc: "Articles on AI governance and architecture" },
  { name: "Research", href: "/research", desc: "Research papers and publications" },
  { name: "CSM Framework", href: "/cognitive-systems-management", desc: "Cognitive Systems Management" },
  { name: "Architecture Decisions", href: "/architecture-decision-master-sheet", desc: "Interactive decision master sheet" },
  { name: "AI Security Tools", href: "/ai-security-tools", desc: "Blast radius, agent matrix, scenarios" },
  { name: "Guides", href: "/guides", desc: "AI compliance guides" },
];

const aboutLinks = [
  { name: "About", href: "/about", desc: "Background, story, and credentials" },
  { name: "Executive Bio", href: "/executive-bio", desc: "Executive biography" },
  { name: "Portfolio", href: "/portfolio", desc: "Programs, metrics, and deliverables" },
  { name: "Speaking", href: "/speaking", desc: "Speaking topics and bookings" },
];

export function SiteNavigation({ searchEntries }: { searchEntries: SearchEntry[] }) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [open, setOpen] = React.useState<null | "solutions" | "insights" | "about">(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClickDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(null); setMobileOpen(false); setSearchOpen(false); }
    };
    const onCmdK = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("mousedown", onClickDoc);
    document.addEventListener("keydown", onEsc);
    document.addEventListener("keydown", onCmdK);
    return () => {
      document.removeEventListener("mousedown", onClickDoc);
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("keydown", onCmdK);
    };
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const dropdown = (items: { name: string; href: string; desc: string }[]) => (
    <div
      role="menu"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: 0,
        minWidth: 280,
        background: "var(--op-card)",
        border: "1px solid var(--op-border)",
        borderRadius: 10,
        padding: 4,
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        zIndex: 40,
      }}
    >
      {items.map((it, i) => (
        <React.Fragment key={it.name}>
          {i > 0 && (
            <div style={{ height: 1, background: "var(--op-border)", margin: "4px 8px" }} />
          )}
          <Link
            href={it.href}
            onClick={() => setOpen(null)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              padding: "10px 12px",
              borderRadius: 6,
              color: "var(--fg)",
              transition: "background .12s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.005em" }}>{it.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              {it.desc}
            </span>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <header
        className="site-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "color-mix(in oklab, var(--bg) 86%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--op-border)",
        }}
      >
        <div
          className="nav-inner"
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
                border: "1px solid var(--op-border)",
                display: "inline-block",
                flexShrink: 0,
                background: "var(--chip)",
                position: "relative",
              }}
            >
              <Image
                src="/portrait.jpeg"
                alt="Subodh Kc"
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
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.005em", color: "var(--fg)" }}>Subodh Kc</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  color: "var(--op-muted)",
                  letterSpacing: "0.04em",
                  marginTop: 1,
                }}
                className="nav-registry-label"
              >
                AI Advisor
              </span>
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
            <Link
              href="/ai-advisor"
              onClick={() => setOpen(null)}
              style={{
                color: "var(--op-muted)",
                textDecoration: "none",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              AI Advisor
            </Link>

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
                  color: open === "solutions" ? "var(--fg)" : "var(--op-muted)",
                }}
              >
                Solutions
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "solutions" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "solutions" && dropdown(solutionsLinks)}
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "insights" ? null : "insights")}
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
                  color: open === "insights" ? "var(--fg)" : "var(--op-muted)",
                }}
              >
                Insights
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "insights" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "insights" && dropdown(insightsLinks)}
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "about" ? null : "about")}
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
                  color: open === "about" ? "var(--fg)" : "var(--op-muted)",
                }}
              >
                About
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "about" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "about" && dropdown(aboutLinks)}
            </div>

            <Link
              href="/contact"
              onClick={() => setOpen(null)}
              style={{
                color: "var(--op-muted)",
                textDecoration: "none",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              Contact
            </Link>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {authChecked && user ? (
              <Link
                href="/app"
                className="nav-signin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 13px",
                  border: "1px solid var(--op-border)",
                  background: "transparent",
                  color: "var(--fg)",
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background .12s",
                }}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="nav-signin"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 13px",
                  border: "1px solid var(--op-border)",
                  background: "transparent",
                  color: "var(--fg)",
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background .12s",
                }}
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="nav-search-btn"
              style={{
                appearance: "none",
                border: "1px solid var(--op-border)",
                background: "var(--op-card)",
                color: "var(--op-muted)",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                transition: "border-color 0.12s, color 0.12s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6" cy="6" r="4.5" />
                <path d="M9.5 9.5 L13 13" />
              </svg>
              <span className="nav-search-label" style={{ fontSize: 11.5 }}>search</span>
              <kbd className="nav-search-kbd" style={{
                fontSize: 10,
                padding: "1px 5px",
                border: "1px solid var(--op-border)",
                borderRadius: 3,
                background: "var(--code)",
                color: "var(--op-muted)",
                fontFamily: "inherit",
              }}>K</kbd>
            </button>

            <Link
              href="/contact?subject=ai-advisor"
              className="nav-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "7px 16px",
                background: "var(--op-accent)",
                color: "#fff",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                fontWeight: 600,
                textDecoration: "none",
                transition: "opacity .12s",
              }}
            >
              Start AI Advisor
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="nav-hamburger"
              style={{
                appearance: "none",
                border: "1px solid var(--op-border)",
                background: "var(--op-card)",
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
            className="nav-drawer"
            style={{
              position: "relative",
              marginLeft: "auto",
              width: "min(320px, 88vw)",
              height: "100%",
              background: "var(--op-card)",
              borderLeft: "1px solid var(--op-border)",
              overflowY: "auto",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--fg)" }}>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Subodh Kc</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--op-muted)", letterSpacing: "0.04em", marginTop: 1 }}>AI Advisor</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ appearance: "none", border: "none", background: "transparent", cursor: "pointer", color: "var(--op-muted)", padding: 4 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 3 L13 13 M13 3 L3 13" />
                </svg>
              </button>
            </div>

            {/* Search button for mobile */}
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              style={{
                appearance: "none",
                width: "100%",
                border: "1px solid var(--op-border)",
                background: "var(--code)",
                color: "var(--op-muted)",
                borderRadius: 8,
                padding: "10px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6" cy="6" r="4.5" />
                <path d="M9.5 9.5 L13 13" />
              </svg>
              Search articles, tools, guides...
            </button>

            {/* AI Advisor link */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
              <Link
                href="/ai-advisor"
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--fg)",
                  padding: "10px 12px",
                  borderRadius: 6,
                  textDecoration: "none",
                  display: "block",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                AI Advisor
              </Link>
            </div>

            {/* Solutions section */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", marginBottom: 6, padding: "0 12px" }}>Solutions</div>
              {solutionsLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
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
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{l.desc}</span>
                </Link>
              ))}
            </div>

            {/* Insights section */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", marginBottom: 6, padding: "0 12px" }}>Insights</div>
              {insightsLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
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
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{l.desc}</span>
                </Link>
              ))}
            </div>

            {/* About section */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", marginBottom: 6, padding: "0 12px" }}>About</div>
              {aboutLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
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
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)" }}>{l.desc}</span>
                </Link>
              ))}
            </div>

            {/* Contact link */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 24 }}>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--fg)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Contact
              </Link>
            </div>

            <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--op-border)", position: "sticky", bottom: 0, background: "var(--op-card)" }}>
            <Link
              href="/contact?subject=ai-advisor"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                textAlign: "center",
                padding: "10px 16px",
                background: "var(--op-accent)",
                color: "#fff",
                borderRadius: 999,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              Start AI Advisor
            </Link>
            {authChecked && user ? (
              <Link
                href="/app"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 16px",
                  border: "1px solid var(--op-border)",
                  background: "transparent",
                  color: "var(--fg)",
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 16px",
                  border: "1px solid var(--op-border)",
                  background: "transparent",
                  color: "var(--fg)",
                  borderRadius: 999,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 500,
                  textDecoration: "none",
                  marginBottom: 10,
                }}
              >
                Sign In
              </Link>
            )}
            </div>
          </div>
        </div>
      )}

      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} entries={searchEntries} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-registry-label { display: block; }
          .nav-search-label { display: none !important; }
          .nav-search-kbd { display: none !important; }
          .nav-signin { display: none !important; }
          .nav-cta { display: none !important; }
          .nav-inner { padding: 10px 16px !important; gap: 8px !important; }
          .nav-search-btn { padding: 6px 8px !important; }
          .nav-hamburger { padding: 6px 8px !important; }
        }
        @media (min-width: 861px) {
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 380px) {
          .nav-search-btn { display: none !important; }
        }
        @keyframes nav-drawer-slide {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .nav-drawer {
          animation: nav-drawer-slide 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
