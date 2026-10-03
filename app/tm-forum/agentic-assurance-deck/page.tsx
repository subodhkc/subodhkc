import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HAIEC Agentic Assurance | TM Forum 2026 Technical Thesis",
  description: "Pre-event architecture and technical thesis deck for HAIEC at TM Forum Innovate Americas 2026.",
  robots: { index: false, follow: false },
};

export default function AgenticAssuranceDeckPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#08060e", color: "#fff" }}>
      <div style={{ position: "fixed", zIndex: 110, bottom: 18, left: 18, display: "flex", gap: 8, alignItems: "center" }}>
        <Link
          href="/tm-forum-challenge"
          style={{
            fontFamily: "ui-monospace,SFMono-Regular,Menlo,monospace",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".08em",
            textDecoration: "none",
            color: "#f2eefb",
            border: "1px solid rgba(167,139,250,.28)",
            background: "rgba(8,6,14,.88)",
            backdropFilter: "blur(12px)",
            borderRadius: 999,
            padding: "8px 12px",
            boxShadow: "0 8px 30px rgba(0,0,0,.32)",
          }}
        >
          ← TM FORUM HUB
        </Link>
      </div>
      <iframe
        title="HAIEC — When AI Can Act, Proof Has to Catch Up"
        src="/tm-forum/haiec-agentic-assurance-deck.html"
        style={{ position: "fixed", zIndex: 100, inset: 0, width: "100%", height: "100%", border: 0, background: "#08060e" }}
        allowFullScreen
      />
    </main>
  );
}
