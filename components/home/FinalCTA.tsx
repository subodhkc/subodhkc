// components/home/FinalCTA.tsx - closing CTA section
import Link from "next/link";

export function FinalCTA() {
  return (
    <section
      id="start"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "80px 28px 80px",
        borderTop: "1px solid var(--op-border)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--op-accent)",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ width: 18, height: 1, background: "var(--op-accent)" }} />
        09 / start
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "var(--fg)",
          maxWidth: 800,
        }}
      >
        From possibility to decision.
        <br />
        From decision to production.
      </h2>

      <p
        style={{
          marginTop: 24,
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          maxWidth: 600,
        }}
      >
        If you are deciding where AI belongs in your organization, the easiest entry point is the
        AI Advisor Desk. If your decisions are interconnected and the stakes are higher, Fractional
        AI Advisor is the next step.
      </p>

      {/* CTAs */}
      <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Link
          href="/ai-advisor"
          data-track="homepage_ai_advisor_click"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--fg)",
            color: "var(--bg)",
            border: "none",
            borderRadius: 999,
            padding: "14px 28px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Explore AI Advisor →
        </Link>
        <Link
          href="/advisory"
          data-track="homepage_fractional_click"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            color: "var(--fg)",
            border: "1px solid var(--op-border)",
            borderRadius: 999,
            padding: "14px 28px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Explore Fractional Advisory
        </Link>
        <Link
          href="/contact?subject=discuss-ai"
          data-track="homepage_discuss_ai_click"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--op-muted)",
            padding: "14px 16px",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          Discuss an AI Decision
        </Link>
      </div>
    </section>
  );
}
