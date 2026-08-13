// components/SiteNavigation.tsx - operator-aesthetic nav with full mobile menu
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchDialog } from "./SearchDialog";
import type { SearchEntry } from "@/lib/search-index";

const myBuild = {
  saas: [
    { name: "HAIEC", href: "/solutions/haiec", desc: "AI Compliance & Governance" },
    { name: "KestrelVoice", href: "/solutions/kestrelvoice", desc: "AI Voice Operations" },
    { name: "FrontOfAI", href: "/solutions/frontofai", desc: "Enterprise AI Solutions" },
  ],
  codePackage: [
    { name: "CourtCase", href: "/products/courtcase", desc: "Legal doc organization" },
    { name: "Print Later", href: "/products/print-later", desc: "Save now, print later" },
    { name: "PDF Redactor", href: "/products/pdf-redactor", desc: "AI PII redaction" },
    { name: "Doc Timeline", href: "/products/doc-timeline", desc: "Document timeline extraction" },
    { name: "SKC Log Analyser", href: "/products/skc-log-analyser", desc: "AI log analysis" },
    { name: "AI Article Generator", href: "/products/ai-article-generator", desc: "Automated article generation" },
  ],
  packages: [
    { name: "llmverify", href: "/products/llmverify", desc: "LLM output verification" },
    { name: "AI Briefing", href: "/solutions/ai-briefing", desc: "Weekly AI Intelligence" },
    { name: "ISAF", href: "/packages/isaf", desc: "Integrated Security Assessment Framework" },
  ],
};

const interactiveTools = [
  { name: "Architecture Decision Master Sheet", href: "/architecture-decision-master-sheet", desc: "Interactive 25-layer architecture decision sheet" },
  { name: "AI Security Tools", href: "/ai-security-tools", desc: "Blast radius, agent matrix, prompt injection library" },
  { name: "AI Risk Register", href: "/ai-risk-register", desc: "34+ AI-specific risks with controls & tracking" },
  { name: "Vendor Due-Diligence Checklist", href: "/ai-vendor-due-diligence-checklist", desc: "60-item AI vendor evaluation checklist" },
  { name: "Incident Evidence Checklist", href: "/ai-incident-evidence-checklist", desc: "4-phase AI security incident checklist" },
];


const aboutLinks = [
  { name: "About", href: "/about", desc: "Background, story, and credentials" },
  { name: "Magazine", href: "/magazine", desc: "Curated reading and publications" },
  { name: "Executive Portfolio", href: "/portfolio", desc: "Programs, metrics, and deliverables" },
  { name: "Contact", href: "/contact", desc: "Get in touch or schedule a meeting" },
];

const blogLinks = [
  { name: "12 Production Readiness Checks for AI Pilots", href: "/blog/12-production-readiness-checks-for-ai-pilots", desc: "Enterprise architecture gate for AI deployments" },
  { name: "7 Layers of AI Compliance: NIST, ISO & SOC 2", href: "/blog/seven-layers-ai-compliance-nist-iso-soc2", desc: "Compliance framework mapping and implementation" },
  { name: "Texas HB 149 vs EU AI Act: Engineering Playbook", href: "/blog/texas-hb-149-eu-ai-act-engineering-compliance-playbook", desc: "CTO-level compliance comparison with code" },
  { name: "Claude Code MCP: Fix stdio, ENOENT, Timeouts", href: "/blog/claude-code-mcp-failed-to-connect-stdio-enoent-timeout", desc: "Practical debugging guide for MCP connections" },
  { name: "Low-Latency AI Voice Pipeline Architecture", href: "/blog/modal-fastapi-postgres-ai-voice-pipeline-architecture", desc: "Modal, FastAPI and Postgres for sub-second voice AI" },
  { name: "Production RAG Architecture for Hybrid Search", href: "/blog/production-rag-architecture-patterns-for-hybrid-search", desc: "RAG patterns, vector databases, and hybrid retrieval" },
];

const navLinks = [
  { label: "services", href: "/services" },
];

interface SiteNavigationProps {
  searchEntries?: SearchEntry[];
}

export function SiteNavigation({ searchEntries = [] }: SiteNavigationProps) {
  const [open, setOpen] = React.useState<null | "myBuild" | "interactiveTools" | "about" | "blog">(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
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
                color: "var(--op-muted)",
                marginLeft: 4,
                borderLeft: "1px solid var(--op-border)",
                paddingLeft: 10,
              }}
              className="nav-registry-label"
            >
              /systems
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
                about
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "about" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "about" && dropdown(aboutLinks)}
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "myBuild" ? null : "myBuild")}
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
                  color: open === "myBuild" ? "var(--fg)" : "var(--op-muted)",
                }}
              >
                my build
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "myBuild" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "myBuild" && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    minWidth: 340,
                    background: "var(--op-card)",
                    border: "1px solid var(--op-border)",
                    borderRadius: 10,
                    padding: 6,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                    zIndex: 40,
                  }}
                >
                  {/* SAAS */}
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", padding: "6px 10px 4px" }}>SAAS</div>
                  {myBuild.saas.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setOpen(null)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        padding: "8px 10px",
                        borderRadius: 6,
                        color: "var(--fg)",
                        transition: "background .12s",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{it.desc}</span>
                    </Link>
                  ))}
                  {/* Code Package */}
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", padding: "10px 10px 4px", borderTop: "1px solid var(--op-border)", marginTop: 6 }}>Code Package</div>
                  {myBuild.codePackage.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setOpen(null)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        padding: "8px 10px",
                        borderRadius: 6,
                        color: "var(--fg)",
                        transition: "background .12s",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{it.desc}</span>
                    </Link>
                  ))}
                  {/* Packages */}
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", padding: "10px 10px 4px", borderTop: "1px solid var(--op-border)", marginTop: 6 }}>Packages</div>
                  {myBuild.packages.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      onClick={() => setOpen(null)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        padding: "8px 10px",
                        borderRadius: 6,
                        color: "var(--fg)",
                        transition: "background .12s",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{it.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/school-pickup/wilshire"
              onClick={() => setOpen(null)}
              style={{
                color: "var(--op-muted)",
                textDecoration: "none",
                fontSize: "inherit",
                fontFamily: "inherit",
              }}
            >
              june's school
            </Link>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "interactiveTools" ? null : "interactiveTools")}
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
                  color: open === "interactiveTools" ? "var(--fg)" : "var(--op-muted)",
                }}
              >
                tools
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "interactiveTools" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "interactiveTools" && dropdown(interactiveTools)}
            </div>

            <div style={{ position: "relative" }}>
              <button
                onClick={() => setOpen(open === "blog" ? null : "blog")}
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
                  color: open === "blog" ? "var(--fg)" : "var(--op-muted)",
                }}
              >
                blog
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: open === "blog" ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path d="M2 4 L5 7 L8 4" />
                </svg>
              </button>
              {open === "blog" && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    minWidth: 340,
                    background: "var(--op-card)",
                    border: "1px solid var(--op-border)",
                    borderRadius: 10,
                    padding: 4,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
                    zIndex: 40,
                  }}
                >
                  <Link
                    href="/blog"
                    onClick={() => setOpen(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: 6,
                      color: "var(--fg)",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      borderBottom: "1px solid var(--op-border)",
                      marginBottom: 4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    View All Articles
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--op-muted)" }}>→</span>
                  </Link>
                  {blogLinks.map((it, i) => (
                    <React.Fragment key={it.href}>
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
                        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.005em", lineHeight: 1.3 }}>{it.name}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                          {it.desc}
                        </span>
                      </Link>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              href="https://calendly.com/subodhkc/30min"
              target="_blank"
              rel="noopener noreferrer"
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
              Schedule Meeting →
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
                <span style={{ fontWeight: 600, fontSize: 14 }}>Subodh KC</span>
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

            {/* About section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
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

            {/* Services link */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 20 }}>
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

            {/* My Build section */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", marginBottom: 10, padding: "0 12px" }}>My Build</div>

              {/* SAAS */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--op-muted)", padding: "4px 12px 2px", opacity: 0.7 }}>SAAS</div>
              {myBuild.saas.map((s) => (
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
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-secondary)" }}>{s.desc}</span>
                </Link>
              ))}

              {/* Code Package */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--op-muted)", padding: "8px 12px 2px", opacity: 0.7, borderTop: "1px solid var(--op-border)", marginTop: 6 }}>Code Package</div>
              {myBuild.codePackage.map((p) => (
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
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-secondary)" }}>{p.desc}</span>
                </Link>
              ))}

              {/* Packages */}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--op-muted)", padding: "8px 12px 2px", opacity: 0.7, borderTop: "1px solid var(--op-border)", marginTop: 6 }}>Packages</div>
              {myBuild.packages.map((p) => (
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
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-secondary)" }}>{p.desc}</span>
                </Link>
              ))}
            </div>

            {/* June's School */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 16 }}>
              <Link
                href="/school-pickup/wilshire"
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
                June's School
              </Link>
            </div>

            {/* Interactive Tools section */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", marginBottom: 10, padding: "0 12px" }}>Tools</div>
              {interactiveTools.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
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
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-secondary)" }}>{t.desc}</span>
                </Link>
              ))}
            </div>

            {/* Blog section */}
            <div style={{ borderTop: "1px solid var(--op-border)", paddingTop: 16, marginBottom: 24 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--op-muted)", marginBottom: 10, padding: "0 12px" }}>Blog</div>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "9px 12px",
                  borderRadius: 6,
                  textDecoration: "none",
                  color: "var(--fg)",
                  marginBottom: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--card-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>View All Articles</span>
              </Link>
              {blogLinks.map((b) => (
                <Link
                  key={b.href}
                  href={b.href}
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
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-secondary)" }}>{b.desc}</span>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 20, borderTop: "1px solid var(--op-border)", position: "sticky", bottom: 0, background: "var(--op-card)" }}>
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

            <Link
              href="https://calendly.com/subodhkc/30min"
              target="_blank"
              rel="noopener noreferrer"
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
              Schedule Meeting →
            </Link>
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
          .nav-registry-label { display: none; }
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
