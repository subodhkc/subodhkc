import type { Metadata } from "next";
import Link from "next/link";
import { gunzipSync } from "node:zlib";
import { FIELD_GUIDE_SOURCE_PARTS } from "../team-field-guide.html/source";
import { CANONICAL_FIELD_GUIDE_PART_1 } from "./canonical-part-1";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "TM Forum Hackathon | Canonical Event Field Guide",
  description: "Canonical event-day operating guide for HAIEC + LogSense at the TM Forum Trustworthy AI & Data Hackathon, with the older v4 reference preserved as an explicitly archived source.",
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
const HAIEC_LAB_URL = "https://www.haiec.com/dashboard/assurance-lab";
const LOGSENSE_URL = "https://github.com/subodhkc/Enterprise-AI-Forensic-Log-Analyzer-";
const FIELD_GUIDE_SOURCE_BASE64 = CANONICAL_FIELD_GUIDE_PART_1 + FIELD_GUIDE_SOURCE_PARTS.slice(1).join("");

type GuideResult =
  | { ok: true; body: string; css: string; diagnostics: Record<string, string | number> }
  | { ok: false; error: string; diagnostics: Record<string, string | number> };

function loadArchivedGuide(): GuideResult {
  const diagnostics: Record<string, string | number> = {
    source: "preserved-v4-source: canonical-part-1 + verified-parts-2-8",
    base64Length: FIELD_GUIDE_SOURCE_BASE64.length,
  };
  try {
    const compressed = Buffer.from(FIELD_GUIDE_SOURCE_BASE64, "base64");
    diagnostics.compressedBytes = compressed.byteLength;
    const document = gunzipSync(compressed).toString("utf8");
    diagnostics.documentChars = document.length;
    const rawCss = Array.from(document.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)).map((m) => m[1]).join("\n")
      .replace(/:root\s*\{/g, ":scope{")
      .replace(/body::before\s*\{/g, ":scope::before{")
      .replace(/body\s*\{/g, ":scope{")
      .replace(/html\s*\{/g, ":scope{");
    const bodyMatch = document.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) throw new Error("Decoded archived document has no body");
    const body = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "");
    diagnostics.bodyChars = body.length;
    const css = `@scope (.tmf-archived-guide) {\n${rawCss}\n}`;
    return { ok: true, body, css, diagnostics };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error), diagnostics };
  }
}

const freezeRows = [
  ["Common evidence binding", "Native run/session ID, authoritative RUN_START, trace/span IDs, agent execution + model/tool invocation IDs, gateway identity, ServiceNow sys_id/native AWS IDs, eventTime/observedAt/ingestedAt semantics, clock domain/skew, source qualification and assessed-run selection rule."],
  ["C7 · Event recording", "Expected-event basis/manifest, required zones/enforcement points, stable event identity/order, timing-gap limit and allowed exception rate. Observed events alone cannot prove completeness."],
  ["C9 · Drift/performance", "KPI name, producer, unit, direction, cadence, comparable-window rule, calibration data, frozen baseline snapshot/digest, drift threshold, violating-window allowance, alert owner/recipient and ServiceNow human-loop path."],
  ["C16 · Spend cap", "Provider call IDs, input/output/cache token semantics, retry accounting, cost/token basis, hard cap, over-cap allowance if any, enforcement/refusal hook and definition of an executed provider call."],
] as const;

const integrations = [
  ["AWS / AgentCore", "Need account/region, agent/runtime/deployment IDs, run/session IDs, gateway endpoint and model/tool invocation IDs. Direct HAIEC ingestion is preferred only if sanctioned; otherwise LogSense normalizes/export-binds the evidence."],
  ["Agent Gateway", "Treat as an enforcement + visibility candidate. Prove that the relevant invocations actually cross it. C16 real-time bonus requires a genuine synchronous pre-invocation/refusal hook; runtime ALLOW/DENY is not the post-run verdict."],
  ["OTel / CloudWatch", "Primary runtime evidence sources. Capture schema/version, event-time fields, trace/span/call IDs, resource identity, sampling/retention/export method and mirrored-record behavior before counting C7/C16."],
  ["ServiceNow AICT", "Create a unique HAIEC-named AWS connector. Prove agent discovery and capture connector ID + sys_ids/native IDs. Model/trace discovery may be incomplete; qualify what is actually visible. Use AICT/human-loop facts as evidence, not as HAIEC verdicts."],
  ["ODA / Cedar / Guardrails", "Use only when approval/effective state, scope, actor and revision are established. A CR or policy file by itself does not automatically establish POLICY_AUTHORIZED; effective permission evidence is needed for EFFECTIVELY_GRANTED."],
  ["Digital Twin / KPI", "Identify the C9 KPI producer, field, unit/direction and comparable-window semantics. Calibration can inform the baseline; freeze the metric profile + baseline before the assessed run."],
  ["Nemotron", "Organizer requirement applies to the agent path: a valid solution needs Nemotron in the agents. Verify the supplied agents' actual model identity first. If they are Nemotron-backed, preserve that binding; if we create/replace an agent, configure it to use Nemotron. HAIEC's evaluator remains deterministic."],
  ["HAIEC MCP", "Own MCP may be brought into the event and connected via AgentCore. Use it for query/operation friction reduction or a Nemotron-backed query assistant. MCP/LLM may resolve structured query parameters or explain persisted results; neither selects thresholds nor computes the authoritative verdict."],
] as const;

export default function FieldGuidePage() {
  const archived = loadArchivedGuide();
  return (
    <div className="tmf-guide-page">
      <div className="tmf-topbar">
        <Link href="/tm-forum-challenge">TM Forum Hub</Link>
        <a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer">Live Intake</a>
        <a href={LOGSENSE_URL} target="_blank" rel="noreferrer">LogSense (private repo)</a>
        <a href={HAIEC_LAB_URL} target="_blank" rel="noreferrer">HAIEC Lab</a>
        <a href="/tm-forum/haiec-agentic-assurance-deck.html" target="_blank" rel="noreferrer">Full Deck</a>
        <a href="/tm-forum/haiec-judge-cut.html" target="_blank" rel="noreferrer">Judge Cut</a>
        <a className="drive" href={DRIVE_URL} target="_blank" rel="noreferrer">Judgment-Day Drive ↗</a>
      </div>

      <main className="tmf-canonical">
        <section className="hero">
          <div className="kicker">CANONICAL EVENT OPERATOR GUIDE · v5</div>
          <h1>Bind the live environment.<br/>Do not redesign the product.</h1>
          <p>LogSense reconstructs and measures what happened. HAIEC owns the frozen event governing instance, deterministic Control Test, exact evidence refs and limitations. The older v4 guide is preserved at the bottom only as an archived historical reference.</p>
          <div className="locks"><code>DISPLAY NAME != EVIDENCE IDENTITY</code><code>INGEST TIME != EVENT TIME</code><code>MULTIPLE RECORDS != MULTIPLE ACTIONS</code><code>LOGSENSE MEASUREMENT != HAIEC VERDICT</code><code>LIVE DECISION != POST-RUN CONTROL SATISFACTION</code></div>
        </section>

        <section className="gates">
          <article><b>GATE A · NEMOTRON</b><p>Organizer requirement is the agent path, not the HAIEC evaluator. Verify actual model identity of the supplied agents. If confirmed Nemotron-backed, that is the cleanest path. If we create/replace an agent, configure it to use Nemotron and retain model/invocation evidence.</p></article>
          <article><b>GATE B · AWS ↔ AICT</b><p>Create the unique HAIEC connector and prove discovery. Required facts: connector identity, AWS account/role/log group bindings, discovered agent sys_ids/native IDs, and what session/trace/model evidence is genuinely visible.</p></article>
          <article><b>GATE C · TELEMETRY</b><p>Prove one real gateway/OTel/CloudWatch record before freeze. If direct HAIEC egress is blocked, use runtime evidence → LogSense → Competition Evidence Bundle → HAIEC.</p></article>
        </section>

        <section>
          <div className="section-title"><span>01</span><div><h2>What is frozen</h2><p>The HAIEC code baseline is not the event policy freeze.</p></div></div>
          <div className="four">
            <article><b>READY / KEEP STABLE</b><p>HAIEC evaluator semantics, canonical evidence intake, C7/C9/C16 logic, result vocabulary, evidence binding and judge-query surfaces.</p></article>
            <article><b>NOT YET FROZEN</b><p>Event-specific thresholds, baseline, cap, expected-event scope, source identities, evidence-binding profile and assessed-run selection rule.</p></article>
            <article><b>FREEZE BEFORE RUN</b><p>After discovery + calibration, create the event governing instance. Freeze control ID/version, exact scope, threshold/baseline/cap, evidence requirements and source/binding profile.</p></article>
            <article><b>RUN BINDING</b><p>If the platform generates the run ID at execution time, bind the exact generated ID under the already-frozen governing rules. Never choose a convenient run after seeing results.</p></article>
          </div>
          <div className="freeze-table">{freezeRows.map(([k,v]) => <article key={k}><b>{k}</b><p>{v}</p></article>)}</div>
          <div className="callout amber"><b>DISCOVER → QUALIFY → CALIBRATE → DECLARE → FREEZE → RUN → EVIDENCE → CONTROL TEST</b><p>If scope/threshold/baseline/cap/binding rules change after freeze: NEW POLICY VERSION → NEW RUN. Preserve the prior result.</p></div>
        </section>

        <section>
          <div className="section-title"><span>02</span><div><h2>First hour</h2><p>Resolve interfaces and identity before touching architecture.</p></div></div>
          <div className="four"><article><b>0–15 · CONNECT</b><p>Workshop/AWS, AgentCore agents, gateway, OTel/CloudWatch, digital twin/KPI, ServiceNow AICT connector path, HAIEC external connectivity and LogSense.</p></article><article><b>15–30 · IDENTITY</b><p>Run/session/RUN_START, trace/span, agent execution, model/tool call IDs, gateway ID, AWS native IDs, ServiceNow sys_ids, connector ID and Nemotron model identity.</p></article><article><b>30–45 · CONTROL FACTS</b><p>C7 expected-event basis; C9 KPI/baseline/human loop; C16 token/retry/cap/refusal accounting. Capture exact schemas/payload examples.</p></article><article><b>45–60 · QUALIFY</b><p>READY / LIMITED / BLOCKED / ONSITE VERIFY. Confirm assumptions with mentor/support before the first event freeze.</p></article></div>
        </section>

        <section>
          <div className="section-title"><span>03</span><div><h2>How the event stack feeds HAIEC</h2><p>Each source must answer a specific evidence question.</p></div></div>
          <div className="integration-grid">{integrations.map(([k,v]) => <article key={k}><b>{k}</b><p>{v}</p></article>)}</div>
        </section>

        <section>
          <div className="section-title"><span>04</span><div><h2>Five evidence planes</h2><p>Never force one source to prove a different plane.</p></div></div>
          <div className="planes"><article><b>REQUESTED</b><p>What was asked / declared.</p></article><article><b>POLICY_AUTHORIZED</b><p>What an approved, effective policy/change permitted.</p></article><article><b>EFFECTIVELY_GRANTED</b><p>What the acting identity could actually exercise through IAM/ACL/runtime/gateway state.</p></article><article><b>CODE_CAPABLE</b><p>What exact deployed-bound source/config could cause. If source-to-deployment binding is absent: NOT ESTABLISHED.</p></article><article><b>OBSERVED</b><p>What runtime evidence shows actually happened.</p></article></div>
          <div className="callout"><b>A COPIED/FORKED REPO != DEPLOYED SOURCE.</b><p>Static analysis is only CODE_CAPABLE evidence when the analyzed snapshot can be bound to the running asset. Missing planes stay UNKNOWN / NOT ESTABLISHED.</p></div>
        </section>

        <section>
          <div className="section-title"><span>05</span><div><h2>Two questions, two tools</h2><p>Do not collapse forensic reconstruction and control judgment.</p></div></div>
          <div className="two"><article><b>WHAT HAPPENED? → LOGSENSE</b><p>Ingest, normalize, correlate, reconstruct, arbitrary time-window investigation where supported, KPI/token measurements, mirrored-record handling, source refs and gaps.</p><code>NO CONTROL VERDICT</code></article><article><b>DID THE CONTROL HOLD? → HAIEC</b><p>Frozen governing instance → exact run/window → deterministic calculation → SATISFIED / NOT_SATISFIED / NOT_EVALUATED → evidence refs → limitations.</p><code>QUERY != EVALUATE</code></article></div>
          <div className="callout"><b>LogSense repository is private.</b><p>If a teammate/Devin GitHub account cannot open it, request repository access first; once authorized, the repo root remains the safest onboarding entry because they may not have LogSense installed locally.</p></div>
        </section>

        <section>
          <div className="section-title"><span>06</span><div><h2>Control edge semantics</h2><p>Truthful failure states are part of the demonstration.</p></div></div>
          <div className="three"><article><b>C7</b><p>Observed events alone cannot prove completeness. Freeze expected event basis + assessed scope. Required evidence missing/unjoinable → visible gap or NOT_EVALUATED, not a green result.</p></article><article><b>C9</b><p>Freeze KPI/baseline/window/threshold/allowance. Human-loop path must exist and be evidenced. Record alert + named recipient/queue + acknowledgement/action when present; documented silence remains an observed governance fact, not fabricated remediation.</p></article><article><b>C16</b><p>Separate EXECUTED WITHIN CAP, OVER-CAP ATTEMPT PREVENTED and EXECUTED OVER-CAP BREACH. A runtime DENY is preventive evidence, not automatically an overspend breach. No atomic/no-overshoot claim unless proven.</p></article></div>
        </section>

        <section>
          <div className="section-title"><span>07</span><div><h2>Judgment Day</h2><p>Bring reproducible proof, not a green dashboard.</p></div></div>
          <div className="three"><article><b>Evidence + thresholds</b><p>Exportable evidence file plus dated/versioned threshold/governance document frozen before assessed runs.</p></article><article><b>Tool + test cases</b><p>Working Control Test/query tool plus test cases and named PASS/Breach runs under the same governing version.</p></article><article><b>Architecture + gaps</b><p>One-page execution/enforcement architecture and an honest gap/remediation/retest register.</p></article></div>
          <div className="callout green"><b>2-MINUTE PROOF FLOW</b><p>Judge names control → select exact assessed run → show frozen governing instance → execute/query persisted Control Test → show arithmetic + verdict → open exact evidence refs → state gaps/non-claims.</p></div>
        </section>

        <section>
          <div className="section-title"><span>08</span><div><h2>Support + schedule</h2><p>Operational details that prevent avoidable event-day failure.</p></div></div>
          <div className="two"><article><b>SUPPORT</b><p>Stay connected to the team Microsoft Teams room. One SPOC posts in Main Meeting Chat, starting with the team name. Prefix urgent issues with <strong>Blocker</strong>. Use the onsite help desk in parallel.</p></article><article><b>TUESDAY 6 OCT</b><p>07:00–07:45 check-in · 08:00–10:00 final working time · 10:30 judging kickoff · 10:45–13:30 preliminary judging · 14:00 finalists · 14:30–16:30 finalist judging. Venue: Marriott Dallas Allen / Innovate Americas.</p></article></div>
        </section>

        <details className="archive">
          <summary>Archived v4 Field Guide — preserved reference, superseded where this canonical guide differs</summary>
          <div className="archive-warning"><b>DO NOT TREAT THIS SECTION AS THE CURRENT OPERATING AUTHORITY.</b> It is preserved unchanged for provenance. Later immersion-session facts supersede earlier v4 assumptions, particularly Nemotron applicability, AWS↔AICT importance, human-loop framing, and live integration details.</div>
          {archived.ok ? <><style>{archived.css}</style><div className="tmf-archived-guide" dangerouslySetInnerHTML={{ __html: archived.body }} /></> : <pre>{JSON.stringify({ error: archived.error, ...archived.diagnostics }, null, 2)}</pre>}
        </details>
      </main>

      <style>{`
        .tmf-guide-page{background:#292c31;color:#ebe6d8;min-height:100vh;font-family:var(--font-sans)}.tmf-topbar{position:sticky;top:0;z-index:100;display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:10px max(20px,calc((100vw - 1180px)/2));background:rgba(41,44,49,.96);border-bottom:1px solid rgba(235,230,216,.12);backdrop-filter:blur(12px)}.tmf-topbar a{color:#ebe6d8;text-decoration:none;font-size:12px}.tmf-topbar a:first-child,.tmf-topbar .drive{color:#16d088;font-weight:800}.tmf-topbar .drive{margin-left:auto}.tmf-canonical{max-width:1180px;margin:0 auto;padding:38px 24px 90px}.hero{padding:30px;border:1px solid rgba(235,230,216,.12);border-radius:18px;background:#34373d}.kicker{font:800 11px/1 var(--font-mono);letter-spacing:.12em;color:#16d088}.hero h1{font:400 clamp(42px,6vw,68px)/1 var(--font-serif);margin:12px 0 18px}.hero p{max-width:900px;color:#c4c4be;font-size:17px;line-height:1.6}.locks{display:flex;gap:8px;flex-wrap:wrap;margin-top:20px}.locks code{padding:7px 9px;border:1px solid #50545b;border-radius:8px;background:#25282d;color:#b9ead7;font-size:11px}.gates{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}.gates article,section article{border:1px solid rgba(235,230,216,.12);border-radius:13px;background:#34373d;padding:17px}.gates b,section article>b{font:800 11px/1.3 var(--font-mono);color:#16d088}.gates p,section article p{font-size:13px;line-height:1.6;color:#c4c4be;margin:8px 0 0}.tmf-canonical>section:not(.hero):not(.gates){padding-top:50px}.section-title{display:flex;gap:14px;margin-bottom:18px}.section-title>span{font:800 12px/1.5 var(--font-mono);color:#16d088}.section-title h2{font:400 clamp(30px,4vw,44px)/1.05 var(--font-serif);margin:0 0 6px}.section-title p{margin:0;color:#aaa79f}.four,.three,.two,.integration-grid,.planes,.freeze-table{display:grid;gap:12px}.four{grid-template-columns:repeat(4,1fr)}.three{grid-template-columns:repeat(3,1fr)}.two{grid-template-columns:repeat(2,1fr)}.integration-grid{grid-template-columns:repeat(2,1fr)}.planes{grid-template-columns:repeat(5,1fr)}.freeze-table{grid-template-columns:repeat(2,1fr);margin-top:12px}.callout{margin-top:13px;padding:16px 18px;border:1px solid rgba(103,200,216,.35);border-radius:12px;background:rgba(103,200,216,.05)}.callout b{color:#67c8d8;font:800 12px var(--font-mono)}.callout p{margin:6px 0 0;color:#c4c4be;font-size:13px;line-height:1.6}.callout.amber{border-color:rgba(230,189,102,.4);background:rgba(230,189,102,.05)}.callout.amber b{color:#e6bd66}.callout.green{border-color:rgba(22,208,136,.4);background:rgba(22,208,136,.05)}.callout.green b{color:#16d088}.two code{display:inline-block;margin-top:12px;color:#e6bd66}.archive{margin-top:58px;border:1px solid #5a4f37;border-radius:14px;background:#22252a;overflow:hidden}.archive>summary{cursor:pointer;padding:18px;color:#e6bd66;font-weight:800}.archive-warning{padding:15px 18px;border-top:1px solid #5a4f37;border-bottom:1px solid #5a4f37;background:#342f23;color:#e9d7a7;font-size:13px;line-height:1.55}.tmf-archived-guide{padding-top:16px}@media(max-width:900px){.gates,.four,.three,.integration-grid,.planes{grid-template-columns:1fr 1fr}.tmf-topbar .drive{margin-left:0}}@media(max-width:620px){.tmf-canonical{padding:24px 15px 70px}.gates,.four,.three,.two,.integration-grid,.planes,.freeze-table{grid-template-columns:1fr}.hero{padding:22px}.tmf-topbar{padding:10px 14px}}
      `}</style>
    </div>
  );
}
