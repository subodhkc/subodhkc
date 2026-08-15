// components/home/OperatingMethodSection.tsx - six-stage operating method (02)
import Link from "next/link";

const STAGES = [
  {
    num: "01",
    name: "Research",
    value:
      "Understand reality before committing to it. Evidence about your workflows, constraints, customers, and market replaces assumption and vendor narrative.",
  },
  {
    num: "02",
    name: "Reframe",
    value:
      "Find the opportunity behind the request. The stated problem is rarely the valuable one. Reframing turns a purchase order into a decision worth making.",
  },
  {
    num: "03",
    name: "Prove & Decide",
    value:
      "Evidence, trade-offs, and a recommendation an executive can sign. Build, buy, configure, integrate, wait, or stop. The answer is allowed to be no.",
  },
  {
    num: "04",
    name: "Architect",
    value:
      "System, data, human, and control design that survives production. What the AI does, what people keep, what happens when it is wrong, and how it is governed.",
  },
  {
    num: "05",
    name: "Mobilize",
    value:
      "Ownership, dependencies, risks, and execution cadence. The decision becomes a program with named owners, sequenced work, and visible status.",
  },
  {
    num: "06",
    name: "Improve",
    value:
      "Production evidence drives the next decision: scale, change, or stop. Systems that cannot be measured cannot be defended.",
  },
];

export function OperatingMethodSection() {
  return (
    <section
      id="method"
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
          02
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
          One method. Six disciplines.
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
        Every engagement, from a $500 workflow assessment to an enterprise advisory relationship,
        runs on the same operating method. Each stage exists because it creates a specific kind of value.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 14,
        }}
      >
        {STAGES.map((s) => (
          <div
            key={s.num}
            style={{
              padding: "24px 24px 22px",
              borderRadius: 12,
              border: "1px solid var(--op-border)",
              background: "var(--op-card)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--op-accent)",
                  letterSpacing: "0.04em",
                }}
              >
                {s.num}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--fg)",
                }}
              >
                {s.name}
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>
              {s.value}
            </p>
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
          The same method, visible in shipped systems and published frameworks.
        </p>
        <Link
          href="/portfolio"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--op-accent)",
            textDecoration: "none",
          }}
        >
          Selected work →
        </Link>
      </div>
    </section>
  );
}
