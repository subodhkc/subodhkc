import Link from "next/link";

const PATH = ["Request", "AI Agent", "Tool", "Authority", "API", "Consequence"];

const EVIDENCE = [
  ["Intended", "Refund up to $2,500"],
  ["Approved policy", "Refund up to $2,500"],
  ["Credential authority", "Not yet established"],
  ["Application capability", "Refund up to $10,000"],
  ["Observed", "$100 synthetic test"],
] as const;

export function ActionConsequenceAtlas({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="atlas-shell"
      aria-label="Synthetic Action-to-Consequence Atlas showing a refund authority mismatch"
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--op-border)",
        borderRadius: 14,
        background: "color-mix(in srgb, var(--op-card) 88%, transparent)",
        padding: compact ? 20 : 28,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--op-accent)" }}>
            Synthetic demonstration
          </div>
          <h3 style={{ margin: "7px 0 0", fontSize: compact ? 18 : 22, letterSpacing: "-.02em" }}>
            Action-to-Consequence Atlas
          </h3>
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--op-muted)" }}>REFUND / v1</span>
      </div>

      <div className="atlas-path" style={{ display: "grid", gridTemplateColumns: `repeat(${PATH.length}, minmax(0, 1fr))`, alignItems: "center", gap: 8 }}>
        {PATH.map((label, index) => (
          <div key={label} style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            <div
              style={{
                width: "100%",
                minHeight: 58,
                display: "grid",
                placeItems: "center",
                padding: "10px 8px",
                border: "1px solid var(--op-border)",
                borderRadius: 9,
                background: index === PATH.length - 1 ? "color-mix(in srgb, var(--op-accent) 12%, var(--op-card))" : "var(--bg)",
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                textAlign: "center",
                color: "var(--fg)",
              }}
            >
              {label}
            </div>
            {index < PATH.length - 1 && <span className="atlas-arrow" aria-hidden style={{ color: "var(--op-accent)", paddingLeft: 8 }}>→</span>}
          </div>
        ))}
      </div>

      {!compact && (
        <div className="atlas-evidence" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8 }}>
          {EVIDENCE.map(([label, value], index) => (
            <div key={label} style={{ padding: "12px 11px", borderTop: `2px solid ${index === 3 ? "var(--op-accent)" : "var(--op-border)"}`, background: "var(--bg)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--op-muted)" }}>{label}</div>
              <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.45, color: index === 3 ? "var(--fg)" : "var(--text-secondary)" }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <p style={{ margin: 0, maxWidth: 620, fontSize: 13, lineHeight: 1.55, color: "var(--text-secondary)" }}>
          The approved boundary and code-capable boundary do not agree. Missing credential evidence remains unresolved rather than becoming a green check.
        </p>
        <Link href="/solutions/haiec" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg)", textDecoration: "none", borderBottom: "1px solid var(--op-border)", paddingBottom: 2 }}>
          Inspect the assurance model →
        </Link>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .atlas-path { grid-template-columns: 1fr 1fr !important; }
          .atlas-arrow { display: none; }
          .atlas-evidence { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .atlas-path, .atlas-evidence { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
