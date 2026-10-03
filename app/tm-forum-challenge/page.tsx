import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TM Forum Trustworthy AI & Data Hackathon | Team Challenge Hub",
  description:
    "Open team operations hub for the TM Forum Trustworthy AI & Data Hackathon: event gates, Field Guide, live intake, LogSense, HAIEC Assurance Lab, Judgment-Day artifacts, and presentation decks.",
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
const LOGSENSE_URL = "https://github.com/subodhkc/Enterprise-AI-Forensic-Log-Analyzer-";
const HAIEC_LAB_URL = "https://www.haiec.com/dashboard/assurance-lab";
const DECK_URL = "/tm-forum/haiec-agentic-assurance-deck.html";
const JUDGE_CUT_URL = "/tm-forum/haiec-judge-cut.html";

const controls = [
  { id: "7", code: "AIA-LOG-001", title: "Automatic event recording", measure: "Freeze expected events/scope, required zones or enforcement points, timing-gap rule and exception allowance; evaluate only against qualified event-time evidence." },
  { id: "9", code: "AIA-ARC-006", title: "Drift & performance", measure: "Freeze KPI profile, baseline snapshot, comparable-window rule, threshold/allowance and named human alert path before the assessed run." },
  { id: "16", code: "ACN-COST-001", title: "Per-run spend cap", measure: "Freeze provider-call accounting semantics, token fields, retry policy, hard cap and enforcement scope; reconcile actual executed usage after the run." },
] as const;

const primary = [
  { n: "01", title: "FIELD GUIDE — START HERE", href: "/tm-forum/field-guide", body: "Canonical event operator guide: first-hour sequence, evidence identity, clock integrity, freeze discipline, Nemotron/AICT gates, source qualification and judge flow.", external: false },
  { n: "02", title: "LIVE ENVIRONMENT INTAKE", href: "/tm-forum/team-environment-integration-intake.html", body: "Capture P0 connectivity, telemetry, identity, time, source/deployment and C7/C9/C16 facts. Export before leaving the session.", external: true },
  { n: "03", title: "LOGSENSE EVENT WORKBENCH", href: LOGSENSE_URL, body: "Private GitHub repository. Request access first if your GitHub account cannot open it. After access, clone/open in Devin and run `logsense` / `logsense ui`. LogSense reconstructs and measures; it never owns HAIEC verdicts.", external: true },
  { n: "04", title: "HAIEC ASSURANCE LAB", href: HAIEC_LAB_URL, body: "Use the existing HAIEC judge workspace for frozen event governing instances, deterministic Control Tests, evidence refs and limitations. Event policies are not frozen until onsite discovery/calibration is complete.", external: true },
  { n: "05", title: "JUDGMENT-DAY DRIVE", href: DRIVE_URL, body: "Evidence File, Threshold/Governance Document, Control Test/Operator Card, Test Cases + Named PASS/Breach Runs, One-Page Architecture, and Gap/Remediation/Retest Register.", external: true },
  { n: "06", title: "HAIEC AGENTIC ASSURANCE DECK", href: DECK_URL, body: "Full technical thesis deck: observability vs assurance, deterministic control proof, five evidence planes, event-integration boundaries and clearly labeled synthetic examples.", external: true },
] as const;

const freezeNeeds = [
  ["COMMON", "Native run/session identity, authoritative RUN_START, trace/span and invocation IDs, event-time semantics, clock domain/skew, stable agent/gateway/ServiceNow identities, qualified evidence sources and assessed-run selection rule."],
  ["C7", "Organizer/workflow expected-event basis, required zones/enforcement points, event identity/order/timing fields, allowed timing gap and tolerated exception rule."],
  ["C9", "KPI name/producer/value/unit/direction, calibration data, baseline snapshot, comparable-window rule, threshold, violating-window allowance, alert owner/recipient and ServiceNow human-loop path."],
  ["C16", "Provider model-call IDs, input/output/cache token semantics, retry accounting, cost/token basis, hard cap, over-cap allowance if any, gateway/tool refusal hook and what constitutes an executed provider call."],
] as const;

export default function TmForumChallengePage() {
  return (
    <div className="tmf-page">
      <section className="tmf-hero">
        <div className="tmf-kicker">TEAM OPERATIONS · TM FORUM INNOVATE AMERICAS 2026</div>
        <h1>Agentic Assurance — The Quest for Proof</h1>
        <p className="tmf-lede">
          One open operating surface for the event. The supplied or competition-deployed agents are the system under assurance.
          <strong> HAIEC code and evaluator semantics are ready; event-specific governing data must still be discovered, qualified and frozen onsite.</strong>
        </p>
        <div className="tmf-meta">
          <span>Sun 4 Oct: environment access + build</span>
          <span>Mon 5 Oct: build + ServiceNow/AWS integration</span>
          <span>Tue 6 Oct: final work ends 10:00 · preliminary judging 10:45</span>
          <span>Wed 7 Oct: awards</span>
        </div>
        <div className="tmf-warning">
          <strong>Operating rule:</strong> organizer material and live environment evidence take precedence. UNKNOWN / ONSITE VERIFY stay visible until a source establishes the fact.
        </div>
      </section>

      <section className="tmf-critical">
        <div><b>EVENT GATE A · NEMOTRON</b><p>The organizer stated that a valid solution needs Nemotron in the agent path. First verify the supplied agents&apos; actual model identity. If the supplied path is Nemotron-backed, preserve and evidence that binding. If we build/replace an agent, configure it to use Nemotron. <strong>HAIEC&apos;s evaluator remains deterministic and does not ask Nemotron whether a control passed.</strong></p></div>
        <div><b>EVENT GATE B · AWS ↔ SERVICENOW AICT</b><p>The AWS-to-AI Control Tower integration is part of the hackathon run. Create a uniquely HAIEC-named connector, prove agent discovery, capture stable IDs, and treat model/trace discovery as source-qualified because the organizers warned it may be incomplete.</p></div>
        <div><b>EVENT GATE C · TELEMETRY</b><p>Prove one real record from the agent gateway and OTel/CloudWatch path before control freeze. Determine whether HAIEC can ingest directly or whether LogSense must normalize/export the Competition Evidence Bundle.</p></div>
      </section>

      <section className="tmf-start" aria-label="Start here">
        <div className="tmf-start-copy">
          <div className="tmf-start-label">START HERE</div>
          <h2>Six working links. One operating sequence.</h2>
          <p>Field Guide → Intake → LogSense reconstruction → HAIEC Control Test → Judgment-Day package → presentation. The full deck tells the architecture story; the judge cut is optimized for the 10-minute presentation.</p>
          <div className="tmf-deck-row">
            <a className="tmf-deck-button" href={DECK_URL} target="_blank" rel="noreferrer">FULL TECHNICAL DECK →</a>
            <a className="tmf-deck-button secondary" href={JUDGE_CUT_URL} target="_blank" rel="noreferrer">7-SLIDE JUDGE CUT →</a>
          </div>
        </div>
        <div className="tmf-start-actions">
          {primary.map((item) => (
            <a key={item.n} className="tmf-big-action" href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
              <span>{item.n}</span><div><b>{item.title}</b><small>{item.body}</small></div><strong>OPEN ↗</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>01</span><div><h2>What is frozen — and what is not</h2><p>Do not confuse the HAIEC software baseline with the event governing instance.</p></div></div>
        <div className="tmf-status-grid">
          <article><small>HAIEC CODE BASELINE</small><h3>READY / KEEP STABLE</h3><p>Canonical evidence intake, C7/C9/C16 evaluator semantics, result vocabulary, evidence binding, query surfaces and judge workspace are the pre-event technical baseline.</p></article>
          <article><small>EVENT GOVERNING POLICIES</small><h3>NOT YET FROZEN</h3><p>Threshold values, C7 expected-event scope, C9 baseline/KPI profile, C16 accounting/cap, source identities and event-specific evidence bindings require organizer/live-environment facts first.</p></article>
          <article><small>ASSESSED RUN</small><h3>NOT YET BOUND</h3><p>Freeze the governing policy before the assessed run. When the platform generates the real run ID, bind that exact run under the already-frozen rules; never choose a convenient run afterward.</p></article>
          <article><small>CHANGE RULE</small><h3>VERSION, NEVER REWRITE</h3><p>If any threshold, scope, baseline or binding rule changes after freeze: create a new governing version and a new assessed run. Preserve the prior result.</p></article>
        </div>
        <div className="tmf-freeze-needs">{freezeNeeds.map(([k,v]) => <article key={k}><b>{k}</b><p>{v}</p></article>)}</div>
        <div className="tmf-freeze"><strong>DISCOVER → QUALIFY → CALIBRATE → DECLARE → FREEZE → RUN → EVIDENCE → CONTROL TEST</strong><span>Calibration data may inform the freeze. Assessed-run results may not be used to tune the already-frozen threshold.</span></div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>02</span><div><h2>How HAIEC satisfies the event stack</h2><p>Each platform contributes evidence or enforcement. HAIEC needs exact interfaces and stable identity—not another dashboard.</p></div></div>
        <div className="tmf-integration-grid">
          <article><b>AWS / AgentCore</b><p><strong>Organizer gives:</strong> staged agent runtime and supported AWS services.</p><p><strong>We need:</strong> account/region, agent/runtime IDs, run/session identity, gateway endpoint, model/tool invocation IDs and deployment identity.</p><p><strong>HAIEC path:</strong> ingest directly if sanctioned, otherwise LogSense normalizes and exports source-qualified evidence.</p></article>
          <article><b>Agent Gateway + OTel / CloudWatch</b><p><strong>Organizer gives:</strong> runtime gateway plus instrumentation/CloudWatch visibility.</p><p><strong>We need:</strong> event-time fields, trace/span/call IDs, source coverage, token/cost fields, policy/refusal records and a way to query/export.</p><p><strong>HAIEC path:</strong> OBSERVED evidence for C7/C9/C16; gateway may also become a real C16 enforcement point if a synchronous hook exists.</p></article>
          <article><b>ServiceNow AI Control Tower</b><p><strong>Organizer expects:</strong> AWS↔AICT connector and human-loop use.</p><p><strong>We need:</strong> unique connector ID/name, discovered agent sys_ids/native IDs, session/trace records where available, alert/recipient/acknowledgement or documented silence.</p><p><strong>HAIEC path:</strong> inventory/governance/human-loop evidence; never treat AICT&apos;s own evaluation as the HAIEC C9/C16 verdict.</p></article>
          <article><b>ODA / Cedar / Guardrails / config</b><p><strong>We need:</strong> approved/effective policy or change record with actor, scope, revision and effective time.</p><p><strong>HAIEC path:</strong> supports POLICY_AUTHORIZED or EFFECTIVELY_GRANTED only when the evidence actually establishes that plane. A change request alone is not approval.</p></article>
          <article><b>Digital Twin / KPI source</b><p><strong>We need:</strong> KPI name, unit, direction, producer, cadence, comparable-window semantics and calibration/baseline records.</p><p><strong>HAIEC path:</strong> freeze the C9 metric profile + baseline digest, then evaluate violating windows deterministically.</p></article>
          <article><b>Nemotron</b><p><strong>Event role:</strong> model in the agent path and optional adversarial/query-assist workflows.</p><p><strong>HAIEC path:</strong> record model identity/invocation as evidence. AI may translate a natural-language judge question into structured query parameters or explain a persisted result; it does not determine the result.</p></article>
        </div>
      </section>

      <section className="tmf-section"><div className="tmf-section-head"><span>03</span><div><h2>The three scored controls</h2><p>Technical paths exist. Real event evidence plus a frozen governing instance turns them into assessed results.</p></div></div><div className="tmf-controls">{controls.map((control) => <article key={control.id}><div className="tmf-control-top"><span>{control.id}</span><code>{control.code}</code></div><h3>{control.title}</h3><p>{control.measure}</p><div className="tmf-control-lock">AVAILABLE ≠ EVENT ASSESSED</div></article>)}</div></section>

      <section className="tmf-section"><div className="tmf-section-head"><span>04</span><div><h2>First-hour operating sequence</h2><p>Bind and qualify before changing code.</p></div></div><div className="tmf-sequence"><article><b>0–15 · CONNECT</b><p>Workshop/AWS, agents, gateway, OTel/CloudWatch, KPI/digital twin, ServiceNow AICT connector path, HAIEC egress and LogSense.</p></article><article><b>15–30 · IDENTITY</b><p>Run/session/RUN_START, trace/span, agent execution, model/tool invocation, gateway, AWS native IDs and ServiceNow sys_ids. Prefix team-created ServiceNow names with HAIEC.</p></article><article><b>30–45 · CONTROL FACTS</b><p>Capture the exact C7 expected-event basis, C9 KPI/baseline/human loop, and C16 provider-call/token/retry/cap/refusal semantics.</p></article><article><b>45–60 · QUALIFY</b><p>READY / LIMITED / BLOCKED / ONSITE VERIFY. Show the path to a mentor/support contact before the real freeze.</p></article></div></section>

      <section className="tmf-support"><div><b>SUPPORT / BLOCKER PATH</b><p>Stay connected to the team Microsoft Teams room. Use one team SPOC for the Main Meeting Chat, start with the team name, and prefix urgent issues with <strong>Blocker</strong>. Use the onsite help desk as the parallel escalation path.</p></div><div><b>TUESDAY CUT-OFF</b><p>Final working time: 08:00–10:00. Preliminary judging kickoff: 10:30. Presentations: 10:45–13:30. Finalists: 14:00. Finalist judging: 14:30–16:30. Venue moves to the Marriott Dallas Allen / Innovate Americas site.</p></div></section>

      <section className="tmf-endcap"><p>Core operating split</p><div className="tmf-operating-split"><span><b>WHAT HAPPENED?</b> → LogSense → reconstruction / measurement → <em>NO CONTROL VERDICT</em></span><span><b>DID THE CONTROL HOLD?</b> → HAIEC → frozen governing instance / deterministic Control Test / exact evidence refs</span></div><div className="tmf-end-actions"><a href="/tm-forum/field-guide">Field Guide</a><a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer">Intake</a><a href={DECK_URL} target="_blank" rel="noreferrer">Full Deck</a><a href={JUDGE_CUT_URL} target="_blank" rel="noreferrer">Judge Cut</a><a href={DRIVE_URL} target="_blank" rel="noreferrer">Judgment-Day Drive</a></div></section>

      <style>{`
        .tmf-page{max-width:1240px;margin:0 auto;padding:54px 28px 80px;font-family:var(--font-sans);color:var(--fg)}.tmf-hero{padding:34px;border:1px solid var(--op-border);border-radius:20px;background:linear-gradient(145deg,var(--op-card),var(--bg));box-shadow:0 20px 55px rgba(0,0,0,.18)}.tmf-kicker{font-family:var(--font-mono);font-size:11px;letter-spacing:.13em;color:var(--op-accent);margin-bottom:14px}.tmf-hero h1{font-family:var(--font-serif);font-size:clamp(42px,7vw,76px);line-height:.98;letter-spacing:-.035em;margin:0 0 18px;font-weight:400;max-width:980px}.tmf-lede{font-size:18px;line-height:1.65;color:var(--text-secondary);max-width:950px;margin:0}.tmf-lede strong{color:var(--fg)}.tmf-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.tmf-meta span{font-family:var(--font-mono);font-size:11px;padding:6px 9px;border:1px solid var(--op-border);border-radius:999px;color:var(--text-secondary);background:var(--bg)}.tmf-warning{margin-top:22px;padding:13px 15px;border-left:3px solid var(--op-accent);background:rgba(22,208,136,.06);font-size:14px;line-height:1.6}
        .tmf-critical,.tmf-support{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.tmf-critical>div,.tmf-support>div{border:1px solid var(--op-border);border-radius:14px;padding:17px;background:var(--op-card)}.tmf-critical b,.tmf-support b{font:800 11px/1.2 var(--font-mono);color:var(--op-accent);letter-spacing:.04em}.tmf-critical p,.tmf-support p{font-size:13px;line-height:1.55;color:var(--text-secondary);margin:9px 0 0}.tmf-support{grid-template-columns:1fr 1fr;margin-top:42px}
        .tmf-start{margin-top:22px;padding:24px;border:2px solid var(--op-accent);border-radius:18px;background:linear-gradient(135deg,rgba(22,208,136,.10),var(--op-card));display:grid;grid-template-columns:.72fr 1.28fr;gap:24px;align-items:start}.tmf-start-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;color:var(--op-accent);margin-bottom:8px}.tmf-start h2{font-family:var(--font-serif);font-size:34px;font-weight:400;margin:0 0 10px}.tmf-start p{margin:0;color:var(--text-secondary);line-height:1.6}.tmf-deck-row{display:flex;gap:9px;flex-wrap:wrap}.tmf-deck-button{display:inline-flex;margin-top:18px;padding:11px 14px;border-radius:10px;background:var(--fg);color:var(--bg);text-decoration:none;font:700 11px/1 var(--font-mono)}.tmf-deck-button.secondary{background:transparent;color:var(--fg);border:1px solid var(--op-border)}.tmf-start-actions{display:grid;gap:10px}.tmf-big-action{display:grid;grid-template-columns:34px 1fr auto;gap:14px;align-items:center;padding:15px 16px;border:1px solid var(--op-border);border-radius:12px;background:var(--bg);color:var(--fg);text-decoration:none}.tmf-big-action:hover{border-color:var(--op-accent)}.tmf-big-action>span{font-family:var(--font-mono);font-size:11px;color:var(--op-accent)}.tmf-big-action b{display:block;font-size:14px}.tmf-big-action small{display:block;color:var(--text-secondary);font-size:12px;margin-top:3px;line-height:1.45}.tmf-big-action strong{font-family:var(--font-mono);font-size:11px;color:var(--op-accent)}
        .tmf-section{padding:54px 0 4px}.tmf-section-head{display:flex;gap:16px;align-items:flex-start;margin-bottom:22px}.tmf-section-head>span{font-family:var(--font-mono);font-size:12px;color:var(--op-accent);padding-top:7px}.tmf-section-head h2{font-family:var(--font-serif);font-size:clamp(30px,4vw,48px);font-weight:400;line-height:1.05;margin:0 0 8px}.tmf-section-head p{margin:0;color:var(--text-secondary);max-width:800px;line-height:1.6}.tmf-status-grid,.tmf-sequence{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.tmf-status-grid article,.tmf-sequence article,.tmf-controls article,.tmf-freeze-needs article,.tmf-integration-grid article{padding:18px;border:1px solid var(--op-border);border-radius:14px;background:var(--op-card)}.tmf-status-grid small{font:700 10px/1 var(--font-mono);letter-spacing:.08em;color:var(--op-accent)}.tmf-status-grid h3{font-size:16px;margin:12px 0 10px}.tmf-status-grid p,.tmf-sequence p,.tmf-controls p,.tmf-freeze-needs p,.tmf-integration-grid p{font-size:13px;line-height:1.55;color:var(--text-secondary);margin:7px 0 0}.tmf-status-grid p b,.tmf-integration-grid strong{color:var(--fg)}.tmf-freeze-needs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.tmf-freeze-needs b,.tmf-integration-grid article>b{color:var(--op-accent)}.tmf-freeze{display:grid;gap:9px;margin-top:14px;padding:18px;border:1px solid rgba(230,189,102,.38);border-radius:14px;background:rgba(230,189,102,.06)}.tmf-freeze strong{font-size:13px}.tmf-freeze span{font-size:13px;color:var(--text-secondary)}.tmf-integration-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.tmf-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.tmf-control-top{display:flex;align-items:center;gap:10px}.tmf-control-top>span{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--op-accent);color:#06120d;font-weight:700}.tmf-control-top code{font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)}.tmf-controls h3{font-size:20px;margin:16px 0 10px}.tmf-control-lock{margin-top:14px;padding-top:12px;border-top:1px solid var(--op-border);font:700 10px/1.4 var(--font-mono);color:var(--op-accent)}.tmf-sequence article b{font-family:var(--font-mono);font-size:12px;color:var(--op-accent)}
        .tmf-endcap{margin-top:50px;padding:28px;border:1px solid var(--op-border);border-radius:18px;background:var(--op-card)}.tmf-endcap>p{font:700 11px/1 var(--font-mono);color:var(--op-accent);letter-spacing:.08em}.tmf-operating-split{display:grid;grid-template-columns:1fr 1fr;gap:12px}.tmf-operating-split span{padding:15px;border:1px solid var(--op-border);border-radius:12px;font-size:13px;line-height:1.55}.tmf-end-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.tmf-end-actions a{color:var(--fg);text-decoration:none;border-bottom:1px solid var(--op-accent);font-size:13px}@media(max-width:960px){.tmf-start{grid-template-columns:1fr}.tmf-status-grid,.tmf-sequence,.tmf-integration-grid,.tmf-critical{grid-template-columns:1fr 1fr}.tmf-controls{grid-template-columns:1fr}.tmf-operating-split{grid-template-columns:1fr}}@media(max-width:640px){.tmf-page{padding:32px 16px 60px}.tmf-hero{padding:24px}.tmf-status-grid,.tmf-sequence,.tmf-integration-grid,.tmf-critical,.tmf-support,.tmf-freeze-needs{grid-template-columns:1fr}.tmf-big-action{grid-template-columns:28px 1fr}.tmf-big-action>strong{display:none}}
      `}</style>
    </div>
  );
}
