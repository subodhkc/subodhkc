import type { Metadata } from "next";
import Link from "next/link";
import { gunzipSync } from "node:zlib";
import { FIELD_GUIDE_SOURCE_PARTS } from "../team-field-guide.html/source";
import { CANONICAL_FIELD_GUIDE_PART_1 } from "./canonical-part-1";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "TM Forum Hackathon | Field Guide v4.1",
  description: "TM Forum Trustworthy AI & Data Hackathon team field guide with event-day START HERE operating layer and preserved source reference.",
  robots: { index: false, follow: false },
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
const HAIEC_LAB_URL = "https://www.haiec.com/dashboard/assurance-lab";
const LOGSENSE_URL = "https://github.com/subodhkc/Enterprise-AI-Forensic-Log-Analyzer-";
const FIELD_GUIDE_SOURCE_BASE64 =
  CANONICAL_FIELD_GUIDE_PART_1 + FIELD_GUIDE_SOURCE_PARTS.slice(1).join("");

type GuideResult =
  | { ok: true; body: string; css: string; diagnostics: Record<string, string | number> }
  | { ok: false; error: string; diagnostics: Record<string, string | number> };

function loadFieldGuide(): GuideResult {
  const diagnostics: Record<string, string | number> = {
    source: "canonical-part-1 + verified-parts-2-8",
    base64Length: FIELD_GUIDE_SOURCE_BASE64.length,
    prefix: FIELD_GUIDE_SOURCE_BASE64.slice(0, 20),
    suffix: FIELD_GUIDE_SOURCE_BASE64.slice(-20),
  };

  try {
    const compressed = Buffer.from(FIELD_GUIDE_SOURCE_BASE64, "base64");
    diagnostics.compressedBytes = compressed.byteLength;
    const source = gunzipSync(compressed);
    diagnostics.sourceBytes = source.byteLength;
    const document = source.toString("utf8");
    diagnostics.documentChars = document.length;

    const rawCss = Array.from(document.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
      .map((match) => match[1])
      .join("\n")
      .replace(/:root\s*\{/g, ":scope{")
      .replace(/body::before\s*\{/g, ":scope::before{")
      .replace(/body\s*\{/g, ":scope{")
      .replace(/html\s*\{/g, ":scope{");

    const bodyMatch = document.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) throw new Error("Decoded document has no <body> element");

    const body = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "");
    diagnostics.bodyChars = body.length;
    diagnostics.sectionCount = (body.match(/<section\s+id=/gi) ?? []).length;

    const theme = `
      :scope{
        --bg:#2b2e33;--surface:#34373d;--surface-2:#3b3e44;
        --border:rgba(235,230,216,.12);--border-strong:rgba(22,208,136,.32);
        --text:#ebe6d8;--muted:#bbb5a9;--dim:#8f8a81;
        --violet:#16d088;--violet-deep:#0fa56d;--pink:#d6b56f;
        --cyan:#67c8d8;--green:#16d088;--amber:#e6bd66;--red:#ef8c83;
      }
      .brand .dot{background:linear-gradient(135deg,#16d088,#7de0b8);box-shadow:0 0 14px rgba(22,208,136,.5)}
      h1{background:linear-gradient(120deg,#fff 8%,#ebe6d8 45%,#8ee8c4 88%);-webkit-background-clip:text;background-clip:text;color:transparent}
    `;

    const css = `@scope (.tmf-guide-ui) {\n${rawCss}\n${theme}\n}`;
    return { ok: true, body, css, diagnostics };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      diagnostics,
    };
  }
}

function TopBar() {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(235,230,216,.12)", background: "rgba(43,46,51,.96)", backdropFilter: "blur(12px)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 13 }}>
        <Link href="/tm-forum-challenge" style={{ color: "#16d088", fontWeight: 800, textDecoration: "none" }}>TM Forum Team Hub</Link>
        <span style={{ color: "#77736b" }}>·</span>
        <a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>Live Intake</a>
        <a href={LOGSENSE_URL} target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>LogSense</a>
        <a href={HAIEC_LAB_URL} target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>HAIEC Lab</a>
        <a href="/tm-forum/agentic-assurance-deck" style={{ color: "#ebe6d8", textDecoration: "none" }}>Technical Deck</a>
        <a href={DRIVE_URL} target="_blank" rel="noreferrer" style={{ marginLeft: "auto", color: "#16d088", textDecoration: "none", border: "1px solid rgba(22,208,136,.35)", borderRadius: 8, padding: "5px 9px", fontWeight: 700 }}>Judgment-Day Drive ↗</a>
      </div>
    </div>
  );
}

function StartHere() {
  return (
    <section className="tmf-ops">
      <div className="tmf-ops-hero">
        <div className="tmf-ops-kicker">START HERE · EVENT OPERATOR LAYER</div>
        <h1>HAIEC is built. Live interface binding remains.</h1>
        <p>
          The supplied Customer / IT / Network agents are the primary system under assurance. We are not rebuilding the agent platform.
          <strong> LogSense reconstructs and measures what happened. HAIEC owns the frozen governing instance and deterministic Control Test.</strong>
        </p>
        <div className="tmf-ops-locks">
          <code>DISPLAY NAME != EVIDENCE IDENTITY</code>
          <code>LOGSENSE MEASUREMENT != HAIEC VERDICT</code>
          <code>INGEST TIME != EVENT TIME</code>
          <code>LIVE DECISION != POST-RUN CONTROL SATISFACTION</code>
        </div>
      </div>

      <div className="tmf-ops-section">
        <div className="tmf-ops-heading"><span>01</span><div><h2>First hour</h2><p>Connect, identify, capture control facts, then qualify. Do not freeze from assumptions.</p></div></div>
        <div className="tmf-ops-grid four">
          <article><b>0–15 · CONNECT</b><p>Verify Workshop/AWS account, AgentCore, Customer/IT/Network agents, model/agent gateway, OTel, CloudWatch, Digital Twin/KPI source, ServiceNow AICT / Agent Studio, AWS→ServiceNow connector, HAIEC external connectivity and LogSense.</p></article>
          <article><b>15–30 · IDENTITY</b><p>Resolve native run/session ID, authoritative RUN_START, trace/span IDs, agent execution IDs, model/tool invocation IDs, gateway IDs, ServiceNow <code>sys_id</code>, and native AWS/AgentCore IDs.</p></article>
          <article><b>30–45 · CONTROL FACTS</b><p><strong>C7:</strong> expected event manifest, zones, enforcement points, order and timing fields. <strong>C9:</strong> KPI, unit/direction, baseline, comparable-window rule, alert and human recipient. <strong>C16:</strong> provider call IDs, tokens, retries, accounting scope, cap and refusal hook.</p></article>
          <article><b>45–60 · QUALIFY</b><p>For each source mark READY / LIMITED / BLOCKED / ONSITE VERIFY. Show the architecture and control path to mentor/support before the real freeze.</p></article>
        </div>
      </div>

      <div className="tmf-ops-section freeze">
        <div className="tmf-ops-heading"><span>02</span><div><h2>Freeze discipline</h2><p>Calibration and assessed evidence must not collapse into one step.</p></div></div>
        <div className="tmf-callout amber">
          <strong>CALIBRATE BEFORE FREEZE — NEVER TUNE THE THRESHOLD FROM ASSESSED RESULTS</strong>
          <code>DECLARE → FREEZE → RUN → EVIDENCE → CONTROL TEST</code>
          <p>Human/team selects thresholds from organizer requirements plus calibration/non-assessed information. AI/ChatGPT/Devin may help interpret requirements or calibration data, but must not silently choose or change a frozen threshold from assessed results. If a threshold changes: <b>NEW POLICY VERSION → NEW RUN</b>. Never rewrite the previous assessed result.</p>
        </div>
      </div>

      <details className="tmf-detail" open>
        <summary>Time, run identity and mirrored telemetry</summary>
        <div className="tmf-detail-grid">
          <article><h3>Timestamp semantics</h3><p><code>eventTime</code> = source-declared occurrence time. <code>observedAt</code> = another system&apos;s record time. <code>ingestedAt</code> = LogSense/HAIEC receipt time.</p><p>Also capture UTC offset, sourceClock/clock domain, precision, sync mechanism, known skew and whether cross-source comparison is safe. A parseable timestamp does not establish comparable clocks.</p></article>
          <article><h3>Correlation hierarchy</h3><p><code>runId → traceId → sessionId → agentExecutionId → tool/model invocation ID</code></p><p><b>CORRELATION HIERARCHY != AUTOMATIC RUN MEMBERSHIP</b>. Membership requires a native relation or approved deterministic mapping. <b>TIMESTAMP PROXIMITY != RUN MEMBERSHIP</b>. <b>FIRST EVENT SEEN != RUN START</b>.</p></article>
          <article><h3>Mirrored telemetry</h3><p>OTel + CloudWatch + Gateway + AICT may describe the same underlying action. <b>MULTIPLE RECORDS != MULTIPLE ACTIONS.</b> Preserve corroboration, count by stable invocation/event identity where available, and show a gap rather than invent heuristic deduplication.</p></article>
        </div>
      </details>

      <details className="tmf-detail" open>
        <summary>Ask two different questions</summary>
        <div className="tmf-detail-grid two">
          <article className="tmf-query"><h3>WHAT HAPPENED? → LogSense</h3><p>Run reconstruction, timeline, arbitrary T1→T2 forensic window where supported, actions/calls, KPI changes, source refs, gaps and unknowns.</p><code>NO CONTROL VERDICT</code></article>
          <article className="tmf-query"><h3>DID THE CONTROL HOLD? → HAIEC</h3><p>Reusable control → Frozen Event Governing Instance → run/window → deterministic calculation → SATISFIED / NOT_SATISFIED / NOT_EVALUATED → exact evidence refs → limitations/gaps.</p><code>LOGSENSE MEASUREMENT != HAIEC VERDICT</code></article>
        </div>
      </details>

      <details className="tmf-detail">
        <summary>Source / repository decision tree and five evidence planes</summary>
        <div className="tmf-detail-grid">
          <article><h3>A · Repository available + deployment binding proven</h3><p>Repo → commit → build/deployment identity → runtime identity → HAIEC verified source scan.</p></article>
          <article><h3>B · Local source/archive/workspace</h3><p>Exact snapshot/digest → HAIEC local scan → deployment/config identity → runtime identity.</p></article>
          <article><h3>C · No source</h3><p>Use ODA CR/config, IAM/ACL, Cedar/Guardrail, AgentCore configuration and runtime telemetry. Show <b>CODE_CAPABLE NOT ESTABLISHED</b>. Do not manufacture static proof.</p></article>
        </div>
        <div className="tmf-plane-flow">
          <span><b>REQUESTED</b><small>ODA change request / declared change</small></span>
          <span><b>POLICY_AUTHORIZED</b><small>approved CR / effective Cedar / Guardrail / configuration</small></span>
          <span><b>EFFECTIVELY_GRANTED</b><small>IAM / ACL / AgentCore / gateway effective state</small></span>
          <span><b>CODE_CAPABLE</b><small>exact source/config static analysis, if available</small></span>
          <span><b>OBSERVED</b><small>OTel / gateway / CloudWatch / AICT runtime evidence</small></span>
        </div>
        <div className="tmf-callout"><b>A COPIED/FORKED REPO != DEPLOYED SOURCE</b> unless independently bound to the running asset. Missing planes remain UNKNOWN / NOT ESTABLISHED.</div>
      </details>

      <details className="tmf-detail">
        <summary>C7 / C9 / C16 edge semantics</summary>
        <div className="tmf-detail-grid">
          <article><h3>C7 · Event recording</h3><p>A complete result requires the declared scope across all required zones/enforcement points. Partial telemetry cannot look like complete recording. Missing or unjoinable required evidence remains visible.</p></article>
          <article><h3>C9 · Drift / performance</h3><p>Bind KPI, unit/direction, baseline version, comparable window, threshold, violating-window allowance, alert, named ServiceNow recipient/queue, required response, and acknowledgement/action or documented silence. Silence is an observed governance fact; never fabricate remediation.</p></article>
          <article><h3>C16 · Spend cap</h3><p>Distinguish <b>executed within cap</b>, <b>over-cap attempt prevented</b>, and <b>executed over-cap breach</b>. Runtime DENY is preventive-control evidence, not automatically an executed overspend breach. Do not claim atomic reservation/no-overshoot unless proven onsite.</p></article>
        </div>
      </details>

      <details className="tmf-detail">
        <summary>Runtime evaluator, ServiceNow human loop, and egress fallback</summary>
        <div className="tmf-detail-grid">
          <article><h3>Runtime evaluator</h3><p><b>May this action happen now?</b> Used at a genuine enforcement point. Its live ALLOW/DENY family is not the scored post-run Control Test.</p></article>
          <article><h3>Control Test</h3><p><b>Did this control hold for this declared run/window?</b> Uses reconciled evidence plus the frozen governing policy and returns SATISFIED / NOT_SATISFIED / NOT_EVALUATED.</p></article>
          <article><h3>C9 human loop</h3><p>C9 drift breach → deterministic alert condition → ServiceNow / AICT queue or named human → acknowledgement/action OR documented silence → evidence bound to run → HAIEC proof. ServiceNow does not become the C9 evaluator.</p></article>
          <article><h3>Egress fallback</h3><p>First test AgentCore→HAIEC HTTPS/MCP, AWS→HAIEC, and ServiceNow→HAIEC. If sanctioned egress is blocked: runtime evidence → LogSense → Competition Evidence Bundle → HAIEC from the team IDE/browser → post-run Control Test. Do not deploy a duplicate HAIEC stack for appearance.</p></article>
        </div>
      </details>

      <details className="tmf-detail">
        <summary>AL0 / AL1 / AL2 and capability ladder</summary>
        <p className="tmf-detail-lede">Use AL0 / AL1 / AL2 only if the live event exposes those states. Treat each as a separate environment state, run/evidence set and forensic reconstruction. Never mix their records into one giant run.</p>
        <div className="tmf-ladder">
          <span>L1 · one complete scored control</span><span>L2 · C7 + C9 + C16</span><span>L3 · five-plane assurance</span><span>L4 · C9 ServiceNow human loop</span><span>L5 · real-time C16</span><span>L6 · second genuine enforcement point</span><span>L7 · adversarial Nemotron scenario</span><span>L8 · LogSense forensic time-window exploration + HAIEC deterministic answer</span>
        </div>
        <div className="tmf-callout amber"><b>DO NOT SACRIFICE THE SIX ARTIFACTS OR TWO-MINUTE PROOF FOR BONUS WORK.</b></div>
      </details>

      <details className="tmf-detail">
        <summary>Organizer interface confirmations — team reference</summary>
        <ol className="tmf-numbered">
          <li>Can existing external HTTPS/MCP assurance services be invoked from AgentCore/ServiceNow, and is there a supported synchronous refusal hook?</li>
          <li>Which telemetry/run/time identifiers are authoritative and programmatically accessible?</li>
          <li>Are authoritative C7/C9/C16 schemas/evidence structures supplied, and are worked numerical examples illustrative?</li>
          <li>Non-blocking: is exact supplied source/build/deployment identity available?</li>
        </ol>
        <p className="tmf-detail-lede"><b>Posture:</b> HAIEC IS BUILT — LIVE INTERFACE BINDING REMAINS. These are interface confirmations, not architecture-approval requests.</p>
      </details>

      <details className="tmf-detail" open>
        <summary>Judgment-Day Drive and preservation</summary>
        <div className="tmf-detail-grid two">
          <article><h3>Six final artifact containers</h3><ol><li>Evidence File</li><li>Threshold & Governance Document</li><li>Control Test / Judge Operator Card</li><li>Named Runs Register</li><li>One-Page Architecture</li><li>Gap / Remediation / Retest Register</li></ol><p>Working Architecture Sketch is a mentor/pre-event aid, not an additional final artifact.</p><a href={DRIVE_URL} target="_blank" rel="noreferrer">Open Judgment-Day Drive ↗</a></article>
          <article><h3>Before lab access ends</h3><ul><li>Export representative raw records.</li><li>Preserve native ID/run/correlation map and mapping/source refs.</li><li>Preserve frozen policy IDs/digests and PASS/BREACH/RETEST IDs.</li><li>Preserve bundle/analysis/result IDs.</li><li>Export the six final artifacts and secrets-scrub the judge package.</li><li>Verify it opens without the live lab and a second teammate can operate it.</li><li>Revoke/rotate temporary event credentials afterward.</li></ul></article>
        </div>
      </details>

      <div className="tmf-reference-divider">
        <span>DEEP REFERENCE MATERIAL BELOW</span>
        <p>The source-preserving Field Guide follows unchanged. The event operator layer above is the canonical place to start.</p>
      </div>
    </section>
  );
}

export default function TmForumFieldGuidePage() {
  const guide = loadFieldGuide();

  if (!guide.ok) {
    return (
      <main style={{ background: "#2b2e33", color: "#ebe6d8", minHeight: "100vh" }}>
        <TopBar />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>TM Forum Field Guide source diagnostic</h1>
          <p style={{ color: "#ef8c83", fontWeight: 700 }}>{guide.error}</p>
          <p style={{ color: "#bbb5a9" }}>The canonical route is returning the decode failure instead of throwing a Next.js server exception. The compressed source chunks were not hand-edited by this event-operator update.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#34373d", padding: 16, borderRadius: 10, overflowX: "auto" }}>{JSON.stringify(guide.diagnostics, null, 2)}</pre>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#2b2e33", minHeight: "100vh", color: "#ebe6d8" }}>
      <style dangerouslySetInnerHTML={{ __html: guide.css }} />
      <style>{`
        .tmf-ops{max-width:1180px;margin:0 auto;padding:34px 24px 56px;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .tmf-ops-hero{border:1px solid rgba(22,208,136,.35);border-radius:18px;padding:28px;background:linear-gradient(145deg,rgba(22,208,136,.08),#34373d)}
        .tmf-ops-kicker{font:800 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#16d088;letter-spacing:.13em}.tmf-ops-hero h1{font-size:clamp(32px,5vw,58px);line-height:1.02;margin:14px 0 14px;color:#fff;background:none;-webkit-text-fill-color:initial}.tmf-ops-hero p{max-width:900px;color:#bbb5a9;line-height:1.65}.tmf-ops-hero strong{color:#ebe6d8}
        .tmf-ops-locks{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.tmf-ops-locks code,.tmf-callout code{font:700 11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;color:#8ee8c4;border:1px solid rgba(22,208,136,.24);border-radius:999px;padding:6px 9px;background:#2b2e33}
        .tmf-ops-section{margin-top:34px}.tmf-ops-heading{display:flex;gap:14px;align-items:flex-start;margin-bottom:16px}.tmf-ops-heading>span{font:800 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#16d088;margin-top:8px}.tmf-ops-heading h2{font-size:30px;margin:0 0 6px}.tmf-ops-heading p{margin:0;color:#bbb5a9}
        .tmf-ops-grid{display:grid;gap:12px}.tmf-ops-grid.four{grid-template-columns:repeat(4,minmax(0,1fr))}.tmf-ops-grid article,.tmf-detail-grid article{padding:16px;border:1px solid rgba(235,230,216,.12);border-radius:12px;background:#34373d}.tmf-ops-grid b{color:#16d088;font:800 12px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}.tmf-ops-grid p,.tmf-detail-grid p{color:#bbb5a9;font-size:13px;line-height:1.6}.tmf-ops-grid strong,.tmf-detail-grid strong{color:#ebe6d8}
        .tmf-callout{display:grid;gap:10px;padding:16px;border:1px solid rgba(22,208,136,.3);border-radius:12px;background:rgba(22,208,136,.05);color:#bbb5a9}.tmf-callout strong,.tmf-callout b{color:#ebe6d8}.tmf-callout.amber{border-color:rgba(230,189,102,.4);background:rgba(230,189,102,.06)}.tmf-callout.amber>strong{color:#e6bd66}
        .tmf-detail{margin-top:14px;border:1px solid rgba(235,230,216,.12);border-radius:12px;background:#303338;overflow:hidden}.tmf-detail summary{cursor:pointer;padding:15px 18px;font-weight:800;color:#ebe6d8}.tmf-detail[open] summary{border-bottom:1px solid rgba(235,230,216,.1)}.tmf-detail>*:not(summary){margin-left:18px;margin-right:18px}.tmf-detail-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:16px;margin-bottom:16px}.tmf-detail-grid.two{grid-template-columns:1fr 1fr}.tmf-detail h3{font-size:16px;margin:0 0 8px;color:#ebe6d8}.tmf-detail code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#8ee8c4}.tmf-query code{display:inline-block;margin-top:8px;font-size:11px;font-weight:800}.tmf-detail-lede{color:#bbb5a9;line-height:1.6}
        .tmf-plane-flow{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:14px;margin-bottom:14px}.tmf-plane-flow span{padding:12px;border:1px solid rgba(22,208,136,.2);border-radius:10px;background:#34373d}.tmf-plane-flow b{display:block;color:#16d088;font:800 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}.tmf-plane-flow small{display:block;color:#bbb5a9;margin-top:5px;line-height:1.4}
        .tmf-ladder{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 18px}.tmf-ladder span{padding:10px 12px;border-radius:9px;border:1px solid rgba(235,230,216,.12);background:#34373d;color:#bbb5a9;font-size:13px}.tmf-numbered,.tmf-detail ul,.tmf-detail ol{color:#bbb5a9;line-height:1.65}.tmf-detail a{color:#16d088}
        .tmf-reference-divider{margin-top:42px;padding:22px;border-top:1px solid rgba(235,230,216,.16);border-bottom:1px solid rgba(235,230,216,.16);text-align:center}.tmf-reference-divider span{font:800 11px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;color:#16d088}.tmf-reference-divider p{margin:8px 0 0;color:#8f8a81}
        @media(max-width:900px){.tmf-ops-grid.four,.tmf-detail-grid,.tmf-plane-flow{grid-template-columns:1fr 1fr}}@media(max-width:620px){.tmf-ops-grid.four,.tmf-detail-grid,.tmf-detail-grid.two,.tmf-plane-flow,.tmf-ladder{grid-template-columns:1fr}}
      `}</style>
      <TopBar />
      <StartHere />
      <div className="tmf-guide-ui" dangerouslySetInnerHTML={{ __html: guide.body }} />
    </main>
  );
}
