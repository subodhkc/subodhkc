// components/home/PossibilitySection.tsx - imagination-trigger section (01)
import Link from "next/link";

const QUESTIONS = [
  "What could your customers stop waiting for?",
  "What could your strongest people stop doing manually?",
  "What decision would improve if evidence arrived sooner?",
  "What capability is practical today that was not economical a year ago?",
  "Where could one better system remove several downstream problems?",
  "What should remain human?",
];

export function PossibilitySection() {
  return (
    <section
      id="possibility"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "56px 28px 40px",
        borderTop: "1px solid var(--op-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, paddingBottom: 24 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--op-accent)",
          }}
        >
          01
        </span>
        <h2
          style={{
            fontSize: "clamp(26px, 3.8vw, 40px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--fg)",
          }}
        >
          See what you may be missing.
        </h2>
      </div>

      <p
        style={{
          maxWidth: 680,
          fontSize: 17,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          margin: "0 0 32px",
        }}
      >
        The most expensive AI mistakes are not bad decisions. They are the possibilities nobody
        examined. Six questions worth asking before the next budget cycle:
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 14,
        }}
      >
        {QUESTIONS.map((q, i) => (
          <div
            key={i}
            style={{
              padding: "20px 22px",
              borderRadius: 12,
              border: "1px solid var(--op-border)",
              background: "var(--op-card)",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--op-accent)",
                letterSpacing: "0.04em",
                paddingTop: 3,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "var(--fg)" }}>{q}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 28,
          paddingTop: 20,
          borderTop: "1px solid var(--op-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.04em",
            color: "var(--text-secondary)",
          }}
        >
          Every possibility runs the same gauntlet:{" "}
          <span style={{ color: "var(--fg)" }}>Research → Reframe → Prove &amp; Decide.</span>
        </p>
        <Link
          href="#method"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--op-accent)",
            textDecoration: "none",
          }}
        >
          The method ↓
        </Link>
      </div>
    </section>
  );
}
