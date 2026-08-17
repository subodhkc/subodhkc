// components/home/HowIWork.tsx - compressed operating method
const STAGES = [
  { label: "Research", desc: "Understand reality before committing to a solution." },
  { label: "Reframe", desc: "Find the useful question behind the initial request." },
  { label: "Prove & Decide", desc: "Pressure-test value, options, evidence and trade-offs." },
  { label: "Architect", desc: "Design the business, technical, human and control model." },
  { label: "Mobilize", desc: "Create ownership, sequence and executable next steps." },
  { label: "Improve", desc: "Use production evidence to scale, change or stop." },
];

export function HowIWork() {
  return (
    <section
      id="method"
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "80px 28px 60px",
        borderTop: "1px solid var(--op-border)",
      }}
    >
      {/* Header */}
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
        06 / how I work
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--fg)",
        }}
      >
        One method. Six disciplines.
      </h2>

      <p
        style={{
          marginTop: 16,
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          maxWidth: 600,
        }}
      >
        Every engagement runs on the same operating method, from a single advisory session to a
        multi-month implementation.
      </p>

      {/* Connected progression */}
      <div style={{ marginTop: 40 }}>
        <div className="method-flow" style={{ display: "flex", alignItems: "stretch", gap: 0, overflow: "hidden" }}>
          {STAGES.map((stage, i) => (
            <div key={stage.label} style={{ display: "flex", alignItems: "stretch", flex: "1 1 0", minWidth: 0 }}>
              <div
                style={{
                  flex: 1,
                  padding: "20px 14px",
                  background: i === 0 ? "var(--op-card)" : "transparent",
                  borderTop: "1px solid var(--op-border)",
                  borderBottom: "1px solid var(--op-border)",
                  borderLeft: i === 0 ? "1px solid var(--op-border)" : "none",
                  borderRight: "1px solid var(--op-border)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--op-muted)",
                    marginBottom: 6,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", marginBottom: 6 }}>
                  {stage.label}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.45 }}>
                  {stage.desc}
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  style={{ display: "flex", alignItems: "center", padding: "0 2px", color: "var(--op-accent)", flexShrink: 0 }}
                  className="method-arrow"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7 H11" />
                    <path d="M9 5 L11 7 L9 9" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Principle */}
      <div
        style={{
          marginTop: 32,
          padding: "20px 24px",
          border: "1px solid var(--op-border)",
          borderRadius: 8,
          background: "var(--op-card)",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--op-muted)",
          }}
        >
          Principle
        </span>
        <span style={{ fontSize: 16, color: "var(--fg)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
          The answer is allowed to be no.
        </span>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .method-flow {
            flex-direction: column !important;
          }
          .method-flow > div {
            flex: 1 1 100% !important;
          }
          .method-arrow {
            transform: rotate(90deg);
            padding: 4px 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
