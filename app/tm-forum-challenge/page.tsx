import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TM Forum Trustworthy AI & Data Hackathon | Team Challenge Hub",
  description:
    "Team operations hub for the TM Forum Trustworthy AI & Data Hackathon: Field Guide, live environment intake, LogSense workbench, HAIEC Assurance Lab, Judgment-Day artifacts, and the HAIEC technical thesis deck.",
  robots: { index: false, follow: false },
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
const LOGSENSE_URL = "https://github.com/subodhkc/Enterprise-AI-Forensic-Log-Analyzer-";
const HAIEC_LAB_URL = "https://www.haiec.com/dashboard/assurance-lab";
const DECK_URL = "/tm-forum/haiec-agentic-assurance-deck.html";

const controls = [
  { id: "7", code: "AIA-LOG-001", title: "Automatic event recording", measure: "Expected-event coverage, required zones/enforcement points, timing gaps, exception rate." },
  { id: "9", code: "AIA-ARC-006", title: "Drift & performance", measure: "Frozen baseline, comparable windows, threshold/allowance, alert and named human recipient." },
  { id: "16", code: "ACN-COST-001", title: "Per-run spend cap", measure: "Provider-executed calls, input/output tokens, retries, cap and genuine refusal/enforcement evidence." },
] as const;

const primary = [
  { n: "01", title: "FIELD GUIDE — START HERE", href: "/tm-forum/field-guide", body: "Mission, first-hour sequence, evidence identity, clock integrity, freeze discipline, query routing and judge-ready operating rules.", external: false },
  { n: "02", title: "LIVE ENVIRONMENT INTAKE", href: "/tm-forum/team-environment-integration-intake.html", body: "Capture P0 connectivity, telemetry, identity, time, source/deployment and C7/C9/C16 facts without losing the first-hour record.", external: true },
  { n: "03", title: "LOGSENSE EVENT WORKBENCH", href: LOGSENSE_URL, body: "Open the merged LogSense repo in Devin and run `logsense` / `logsense ui` to use the competition workbench. LogSense reconstructs and measures what happened — never HAIEC verdicts.", external: true },
  { n: "04", title: "HAIEC ASSURANCE LAB", href: HAIEC_LAB_URL, body: "Use the existing HAIEC judge workspace for frozen governing instances, deterministic Control Tests and exact evidence-backed results.", external: true },
  { n: "05", title: "JUDGMENT-DAY DRIVE", href: DRIVE_URL, body: "Evidence File, Threshold & Governance Document, Control Test / Judge Operator Card, Named Runs Register, One-Page Architecture, and Gap / Remediation / Retest Register.", external: true },
  { n: "06", title: "HAIEC AGENTIC ASSURANCE DECK", href: DECK_URL, body: "Corrected standalone HTML technical thesis: observability vs assurance, deterministic control proof, five evidence planes, claim boundaries, and synthetic examples clearly separated from assessed event evidence.", external: true },
] as const;

export default function TmForumChallengePage() {
  return (
    <div className="tmf-page">
      <section className="tmf-hero">
        <div className="tmf-kicker">TEAM OPERATIONS · TM FORUM INNOVATE AMERICAS 2026</div>
        <h1>Agentic Assurance — The Quest for Proof</h1>
        <p className="tmf-lede">
          One bounded team surface for the event. The supplied Customer / IT / Network agents are the system under assurance.
          <strong> HAIEC is built; live interface binding remains.</strong>
        </p>
        <div className="tmf-meta">
          <span>Sun–Mon: build & investigation</span>
          <span>Tue: final event & judging</span>
          <span>Wed: awards / logistics</span>
          <span>Schedule subject to organizer update</span>
        </div>
        <div className="tmf-warning">
          <strong>Operating rule:</strong> organizer material and the live supplied environment take precedence. ONSITE VERIFY and UNKNOWN stay explicit until the live environment establishes them.
        </div>
      </section>

      <section className="tmf-start" aria-label="Start here">
        <div className="tmf-start-copy">
          <div className="tmf-start-label">START HERE</div>
          <h2>Six working links. One operating sequence.</h2>
          <p>Use the Field Guide first, capture the live environment in Intake, reconstruct in LogSense, prove controls in HAIEC, preserve the final package in the Judgment-Day Drive, and use the assurance deck for the architecture story.</p>
          <a className="tmf-deck-button" href={DECK_URL} target="_blank" rel="noreferrer">
            OPEN HAIEC TECHNICAL THESIS DECK →
          </a>
        </div>
        <div className="tmf-start-actions">
          {primary.map((item) => (
            <a key={item.n} className="tmf-big-action" href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
              <span>{item.n}</span>
              <div><b>{item.title}</b><small>{item.body}</small></div>
              <strong>OPEN ↗</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>01</span><div><h2>Current event state</h2><p>Capability truth is separated from event assessment.</p></div></div>
        <div className="tmf-status-grid">
          <article><small>HAIEC</small><h3>PRE-EVENT FROZEN</h3><p>C7 / C9 / C16 Control Test technical paths: <b>AVAILABLE</b>.</p><p>Event assessed: <b>NOT YET</b>.</p></article>
          <article><small>LOGSENSE</small><h3>EVENT OPERATOR PASS COMPLETE</h3><p>PR #86 truth synchronization and PR #87 operator pass are merged: forensic time window, query routing, capability ladder, identity/clock safety and C9/C16 event semantics.</p></article>
          <article><small>ENVIRONMENT</small><h3>ONSITE VERIFY</h3><p>AWS, ServiceNow, AgentCore, model/agent gateway, OTel/CloudWatch, digital twin/KPI source and external HAIEC connectivity must be proven live.</p></article>
          <article><small>JUDGMENT DAY</small><h3>CONTAINERS PREPARED</h3><p>Six artifact containers are prepared. Real evidence is <b>AWAITING LIVE EVENT</b>.</p></article>
        </div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>02</span><div><h2>The three scored controls</h2><p>Technical paths exist. Real event evidence is what turns them into assessed results.</p></div></div>
        <div className="tmf-controls">
          {controls.map((control) => (
            <article key={control.id}>
              <div className="tmf-control-top"><span>{control.id}</span><code>{control.code}</code></div>
              <h3>{control.title}</h3>
              <p>{control.measure}</p>
              <div className="tmf-control-lock">AVAILABLE ≠ EVENT ASSESSED</div>
            </article>
          ))}
        </div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>03</span><div><h2>Fast event sequence</h2><p>Do not redesign either product onsite. Bind, qualify, prove, then pursue bonus capability.</p></div></div>
        <div className="tmf-sequence">
          <article><b>0–15 · CONNECT</b><p>Access + one real record from each available source. Locate agents, gateway, OTel/CloudWatch, KPI/digital twin, ServiceNow, HAIEC and LogSense.</p></article>
          <article><b>15–30 · IDENTITY</b><p>Find run/session, RUN_START, trace/span, agent execution, model/tool invocation, gateway, AWS native and ServiceNow sys_ids.</p></article>
          <article><b>30–45 · CONTROL FACTS</b><p>Capture C7 expected events/timing, C9 KPI/baseline/human alert path, and C16 call/token/retry/cap/refusal facts.</p></article>
          <article><b>45–60 · QUALIFY</b><p>Mark every source READY / LIMITED / BLOCKED / ONSITE VERIFY. Show the architecture/control path to mentor/support before the first real freeze.</p></article>
        </div>
        <div className="tmf-freeze">
          <strong>CALIBRATE BEFORE FREEZE — NEVER TUNE THE THRESHOLD FROM ASSESSED RESULTS</strong>
          <code>DECLARE → FREEZE → RUN → EVIDENCE → CONTROL TEST</code>
          <span>If a threshold changes: NEW POLICY VERSION → NEW RUN.</span>
        </div>
      </section>

      <section className="tmf-endcap">
        <p>Core operating split</p>
        <div className="tmf-operating-split">
          <span><b>WHAT HAPPENED?</b> → LogSense → reconstruction / measurement → <em>NO CONTROL VERDICT</em></span>
          <span><b>DID THE CONTROL HOLD?</b> → HAIEC → frozen governing instance / deterministic Control Test / exact evidence refs</span>
        </div>
        <div className="tmf-end-actions">
          <a href="/tm-forum/field-guide">Field Guide</a>
          <a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer">Intake</a>
          <a href={DECK_URL} target="_blank" rel="noreferrer">Technical Thesis Deck</a>
          <a href={DRIVE_URL} target="_blank" rel="noreferrer">Judgment-Day Drive</a>
        </div>
      </section>

      <style>{`
        .tmf-page{max-width:1240px;margin:0 auto;padding:54px 28px 80px;font-family:var(--font-sans);color:var(--fg)}
        .tmf-hero{padding:34px;border:1px solid var(--op-border);border-radius:20px;background:linear-gradient(145deg,var(--op-card),var(--bg));box-shadow:0 20px 55px rgba(0,0,0,.18)}
        .tmf-kicker{font-family:var(--font-mono);font-size:11px;letter-spacing:.13em;color:var(--op-accent);margin-bottom:14px}
        .tmf-hero h1{font-family:var(--font-serif);font-size:clamp(42px,7vw,76px);line-height:.98;letter-spacing:-.035em;margin:0 0 18px;font-weight:400;max-width:980px}
        .tmf-lede{font-size:18px;line-height:1.65;color:var(--text-secondary);max-width:900px;margin:0}.tmf-lede strong{color:var(--fg)}
        .tmf-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.tmf-meta span{font-family:var(--font-mono);font-size:11px;padding:6px 9px;border:1px solid var(--op-border);border-radius:999px;color:var(--text-secondary);background:var(--bg)}
        .tmf-warning{margin-top:22px;padding:13px 15px;border-left:3px solid var(--op-accent);background:rgba(22,208,136,.06);font-size:14px;line-height:1.6}
        .tmf-start{margin-top:22px;padding:24px;border:2px solid var(--op-accent);border-radius:18px;background:linear-gradient(135deg,rgba(22,208,136,.10),var(--op-card));display:grid;grid-template-columns:.72fr 1.28fr;gap:24px;align-items:start}
        .tmf-start-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;color:var(--op-accent);margin-bottom:8px}.tmf-start h2{font-family:var(--font-serif);font-size:34px;font-weight:400;margin:0 0 10px}.tmf-start p{margin:0;color:var(--text-secondary);line-height:1.6}
        .tmf-deck-button{display:inline-flex;margin-top:18px;padding:11px 14px;border-radius:10px;background:var(--fg);color:var(--bg);text-decoration:none;font:700 11px/1 var(--font-mono);letter-spacing:.04em}
        .tmf-start-actions{display:grid;gap:10px}.tmf-big-action{display:grid;grid-template-columns:34px 1fr auto;gap:14px;align-items:center;padding:15px 16px;border:1px solid var(--op-border);border-radius:12px;background:var(--bg);color:var(--fg);text-decoration:none}.tmf-big-action:hover{border-color:var(--op-accent);transform:translateY(-1px)}.tmf-big-action>span{font-family:var(--font-mono);font-size:11px;color:var(--op-accent)}.tmf-big-action b{display:block;font-size:14px;letter-spacing:.02em}.tmf-big-action small{display:block;color:var(--text-secondary);font-size:12px;margin-top:3px;line-height:1.45}.tmf-big-action strong{font-family:var(--font-mono);font-size:11px;color:var(--op-accent)}
        .tmf-section{padding:56px 0 8px}.tmf-section-head{display:flex;gap:16px;align-items:flex-start;margin-bottom:24px}.tmf-section-head>span{font-family:var(--font-mono);font-size:12px;color:var(--op-accent);padding-top:7px}.tmf-section-head h2{font-family:var(--font-serif);font-size:clamp(30px,4vw,48px);font-weight:400;line-height:1.05;margin:0 0 8px}.tmf-section-head p{margin:0;color:var(--text-secondary);max-width:760px;line-height:1.6}
        .tmf-status-grid,.tmf-sequence{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.tmf-status-grid article,.tmf-sequence article,.tmf-controls article{padding:18px;border:1px solid var(--op-border);border-radius:14px;background:var(--op-card)}.tmf-status-grid small{font:700 10px/1 var(--font-mono);letter-spacing:.08em;color:var(--op-accent)}.tmf-status-grid h3{font-size:16px;margin:12px 0 10px}.tmf-status-grid p,.tmf-sequence p,.tmf-controls p{font-size:13px;line-height:1.55;color:var(--text-secondary);margin:7px 0 0}.tmf-status-grid p b{color:var(--fg)}
        .tmf-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.tmf-control-top{display:flex;align-items:center;gap:10px}.tmf-control-top>span{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--op-accent);color:#06120d;font-weight:700}.tmf-control-top code{font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)}.tmf-controls h3{font-size:20px;margin:16px 0 10px}.tmf-control-lock{margin-top:14px;padding-top:12px;border-top:1px solid var(--op-border);font:700 10px/1.4 var(--font-mono);color:var(--op-accent);letter-spacing:.05em}
        .tmf-sequence article b{font-family:var(--font-mono);font-size:12px;color:var(--op-accent)}.tmf-freeze{display:grid;gap:9px;margin-top:14px;padding:18px;border:1px solid rgba(230,189,102,.38);border-radius:14px;background:rgba(230,189,102,.06)}.tmf-freeze strong{font-size:13px;color:#e6bd66}.tmf-freeze code{font-family:var(--font-mono);color:var(--fg)}.tmf-freeze span{font-size:13px;color:var(--text-secondary)}
        .tmf-endcap{margin-top:56px;padding:24px;border:1px solid var(--op-border);border-radius:16px;background:var(--op-card)}.tmf-endcap>p{font:700 11px/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--text-secondary);margin:0 0 14px}.tmf-operating-split{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tmf-operating-split span{padding:14px;border:1px solid var(--op-border);border-radius:10px;font-size:13px;line-height:1.55;color:var(--text-secondary)}.tmf-operating-split b{color:var(--fg)}.tmf-operating-split em{color:var(--op-accent);font-style:normal;font-family:var(--font-mono);font-size:11px}.tmf-end-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}.tmf-end-actions a{color:var(--fg);text-decoration:none;font-weight:600}.tmf-end-actions a:hover{color:var(--op-accent)}
        @media(max-width:900px){.tmf-start{grid-template-columns:1fr}.tmf-status-grid,.tmf-sequence{grid-template-columns:1fr 1fr}.tmf-page{padding:36px 20px 64px}}
        @media(max-width:640px){.tmf-status-grid,.tmf-sequence,.tmf-controls,.tmf-operating-split{grid-template-columns:1fr}.tmf-big-action{grid-template-columns:26px 1fr}.tmf-big-action strong{grid-column:2}.tmf-start{padding:18px}.tmf-start h2{font-size:29px}.tmf-section{padding-top:42px}}
      `}</style>
    </div>
  );
}
