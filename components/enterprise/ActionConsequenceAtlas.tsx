import Link from "next/link";

const EVIDENCE = [
  { label: "Intended", value: "Give Alex access to one project", state: "stated" },
  { label: "Approved", value: "Viewer access only", state: "approved" },
  { label: "Application", value: "Can submit a role change", state: "established" },
  { label: "Authority", value: "Can assign Administrator", state: "divergence" },
  { label: "Observed", value: "Not yet established", state: "unknown" },
] as const;

const stateColor = {
  stated: "var(--text-secondary)",
  approved: "var(--op-accent)",
  established: "var(--fg)",
  divergence: "#d79b45",
  unknown: "var(--op-muted)",
} as const;

function Arrow() {
  return (
    <span className="atlas-flow-arrow" aria-hidden="true">
      <span className="atlas-flow-line" />
      <span className="atlas-flow-head">›</span>
    </span>
  );
}

function Node({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "consequence" }) {
  return (
    <div className={`atlas-node atlas-node-${tone}`}>
      <span className="atlas-node-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ActionConsequenceAtlas({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`atlas-shell ${compact ? "atlas-compact" : ""}`} aria-label="Synthetic Action and Access Map showing an administrator access mismatch">
      <div className="atlas-header">
        <div>
          <div className="atlas-kicker">Synthetic demonstration</div>
          <h3>AI Action &amp; Access Map</h3>
          <p>One request, two operating boundaries, one material difference.</p>
        </div>
        <span className="atlas-case">ACCESS CHANGE / v1</span>
      </div>

      <div className="atlas-map" role="img" aria-label="A request passes through an AI agent and application role control. Policy requires human approval, but available system authority can assign administrator access.">
        <Node label="Request" value="Give Alex access to one project" />
        <Arrow />
        <Node label="AI agent" value="Chooses a role change" />
        <Arrow />
        <Node label="Application" value="Can submit a role change" />
        <Arrow />

        <div className="atlas-boundaries">
          <div className="atlas-boundary atlas-boundary-approved">
            <span>Approved path</span>
            <strong>Human approval required</strong>
          </div>
          <div className="atlas-boundary atlas-boundary-available">
            <span>Available authority</span>
            <strong>Service account can assign Administrator</strong>
          </div>
        </div>

        <Arrow />
        <Node label="Consequence" value="Alex becomes an administrator" tone="consequence" />
      </div>

      <div className="atlas-decision">
        <span className="atlas-decision-marker" aria-hidden="true" />
        <div>
          <span>Material divergence</span>
          <strong>The system can reach a stronger action than the organization approved.</strong>
        </div>
      </div>

      {!compact && (
        <div className="atlas-evidence" aria-label="Evidence boundaries">
          {EVIDENCE.map(({ label, value, state }) => (
            <div key={label} style={{ borderTopColor: stateColor[state] }}>
              <span>{label}</span>
              <strong style={{ color: stateColor[state] }}>{value}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="atlas-footer">
        <p>
          HAIEC keeps the approved boundary, application capability, available authority, and observed evidence separate. Missing evidence remains visible.
        </p>
        <Link href="/solutions/haiec">Inspect the assurance model →</Link>
      </div>

      <style>{`
        .atlas-shell {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--op-border);
          border-radius: 18px;
          background:
            radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--op-accent) 11%, transparent), transparent 34%),
            linear-gradient(145deg, color-mix(in srgb, var(--op-card) 94%, transparent), color-mix(in srgb, var(--bg) 96%, transparent));
          padding: 30px;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.12);
        }
        .atlas-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .24;
          background-image:
            linear-gradient(var(--op-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--op-border) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 78%);
        }
        .atlas-header, .atlas-map, .atlas-decision, .atlas-evidence, .atlas-footer { position: relative; z-index: 1; }
        .atlas-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
        .atlas-kicker, .atlas-case, .atlas-node-label, .atlas-boundary span, .atlas-decision span, .atlas-evidence span {
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .atlas-kicker { font-size: 10px; color: var(--op-accent); }
        .atlas-header h3 { margin: 7px 0 0; font-size: 23px; letter-spacing: -.025em; }
        .atlas-header p { margin: 8px 0 0; font-size: 13px; color: var(--text-secondary); }
        .atlas-case { flex-shrink: 0; border: 1px solid var(--op-border); border-radius: 999px; padding: 7px 10px; font-size: 9px; color: var(--op-muted); background: var(--bg); }
        .atlas-map { display: grid; grid-template-columns: minmax(120px, .9fr) 28px minmax(120px, .85fr) 28px minmax(135px, .95fr) 28px minmax(190px, 1.25fr) 28px minmax(150px, 1fr); align-items: center; margin-top: 28px; }
        .atlas-node { min-height: 102px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; padding: 16px; border: 1px solid var(--op-border); border-radius: 12px; background: color-mix(in srgb, var(--bg) 94%, transparent); }
        .atlas-node-label { font-size: 9px; color: var(--op-muted); }
        .atlas-node strong { font-size: 13px; line-height: 1.4; font-weight: 560; }
        .atlas-node-consequence { border-color: color-mix(in srgb, #d79b45 58%, var(--op-border)); background: color-mix(in srgb, #d79b45 9%, var(--bg)); }
        .atlas-flow-arrow { position: relative; display: flex; align-items: center; width: 28px; color: var(--op-accent); }
        .atlas-flow-line { width: 100%; height: 1px; background: currentColor; opacity: .55; transform-origin: left; animation: atlas-line 1.8s ease-in-out infinite; }
        .atlas-flow-head { position: absolute; right: -1px; top: 50%; transform: translateY(-53%); font-size: 19px; line-height: 1; }
        .atlas-boundaries { display: grid; gap: 8px; }
        .atlas-boundary { min-height: 70px; display: flex; flex-direction: column; justify-content: center; gap: 7px; border-radius: 10px; padding: 12px 14px; background: var(--bg); }
        .atlas-boundary span { font-size: 8.5px; }
        .atlas-boundary strong { font-size: 12px; line-height: 1.35; font-weight: 560; }
        .atlas-boundary-approved { border: 1px solid color-mix(in srgb, var(--op-accent) 58%, var(--op-border)); }
        .atlas-boundary-approved span { color: var(--op-accent); }
        .atlas-boundary-available { border: 1px solid #8b6738; background: color-mix(in srgb, #d79b45 7%, var(--bg)); }
        .atlas-boundary-available span { color: #d79b45; }
        .atlas-decision { margin-top: 20px; display: flex; gap: 13px; align-items: center; border: 1px solid color-mix(in srgb, #d79b45 48%, var(--op-border)); border-radius: 11px; padding: 14px 16px; background: color-mix(in srgb, #d79b45 8%, var(--bg)); }
        .atlas-decision-marker { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; background: #d79b45; box-shadow: 0 0 0 5px color-mix(in srgb, #d79b45 16%, transparent); }
        .atlas-decision div { display: flex; flex-wrap: wrap; align-items: baseline; gap: 7px 14px; }
        .atlas-decision span { font-size: 9px; color: #d79b45; }
        .atlas-decision strong { font-size: 13px; line-height: 1.45; }
        .atlas-evidence { margin-top: 22px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
        .atlas-evidence > div { min-height: 78px; padding: 11px; border-top: 2px solid; background: color-mix(in srgb, var(--bg) 94%, transparent); }
        .atlas-evidence span { display: block; font-size: 8.5px; color: var(--op-muted); }
        .atlas-evidence strong { display: block; margin-top: 8px; font-size: 11.5px; line-height: 1.4; font-weight: 540; }
        .atlas-footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; gap: 20px; }
        .atlas-footer p { margin: 0; max-width: 690px; font-size: 12.5px; line-height: 1.55; color: var(--text-secondary); }
        .atlas-footer a { flex-shrink: 0; font-family: var(--font-mono); font-size: 10.5px; color: var(--fg); text-decoration: none; border-bottom: 1px solid var(--op-border); padding-bottom: 2px; }
        .atlas-compact { padding: 24px; }
        .atlas-compact .atlas-header h3 { font-size: 20px; }
        .atlas-compact .atlas-header p { display: none; }
        .atlas-compact .atlas-map { margin-top: 22px; }
        .atlas-compact .atlas-node { min-height: 88px; }
        .atlas-compact .atlas-footer p { max-width: 610px; }
        @keyframes atlas-line { 0%, 100% { transform: scaleX(.35); opacity: .25; } 50% { transform: scaleX(1); opacity: .75; } }
        @media (prefers-reduced-motion: reduce) { .atlas-flow-line { animation: none; transform: scaleX(1); } }
        @media (max-width: 980px) {
          .atlas-map { grid-template-columns: 1fr; gap: 0; }
          .atlas-flow-arrow { width: 28px; height: 28px; margin: 0 auto; transform: rotate(90deg); }
          .atlas-node { min-height: auto; gap: 9px; }
          .atlas-boundaries { width: 100%; }
          .atlas-evidence { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 620px) {
          .atlas-shell, .atlas-compact { padding: 20px; border-radius: 14px; }
          .atlas-header { flex-direction: column; gap: 14px; }
          .atlas-case { align-self: flex-start; }
          .atlas-evidence { grid-template-columns: 1fr; }
          .atlas-footer { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
