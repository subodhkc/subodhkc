import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TM Forum Trustworthy AI & Data Hackathon | Team Challenge Hub",
  description:
    "Team reference hub for the TM Forum Trustworthy AI & Data Hackathon, including challenge controls, judging flow, working HTML tools, screenshots, shared Drive resources and event logistics.",
  robots: { index: false, follow: false },
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";

const controls = [
  { id: "7", code: "AIA-LOG-001", title: "Automatic event recording", mode: "Event driven", measure: "Expected-event coverage, timing gaps, exception rate", proof: "Expected IDs, events, timestamps and run links" },
  { id: "9", code: "AIA-ARC-006", title: "Drift and performance", mode: "Continuous", measure: "Relative drop against a frozen baseline by comparable window", proof: "Baseline, live values, windows, alerts, owner and response" },
  { id: "16", code: "ACN-COST-001", title: "Per-run spend cap", mode: "In transaction", measure: "Input plus output tokens reconciled across agents and retries", proof: "Call IDs, token counts, budget version and stop records" },
];

const resources = [
  {
    title: "Team Field Guide",
    href: "/tm-forum/team-field-guide.html",
    type: "HTML · START HERE",
    body: "Challenge structure, controls, judging, operating model, first-hour sequence and onsite verification points.",
    action: "OPEN FIELD GUIDE HTML",
    primary: true,
  },
  {
    title: "Environment & Integration Intake",
    href: "/tm-forum/team-environment-integration-intake.html",
    type: "HTML · LIVE WORKSHEET",
    body: "Capture environment access, gateways, telemetry, run identity, C7/C9/C16 details, judging constraints and missing artifacts.",
    action: "OPEN INTAKE HTML",
    primary: true,
  },
  {
    title: "Shared Google Drive",
    href: DRIVE_URL,
    type: "TEAM FILES",
    body: "Shared working folder for source material, evidence, handoff files, competition artifacts and team collaboration.",
    action: "OPEN GOOGLE DRIVE",
    primary: true,
  },
  {
    title: "Assurance Report Template",
    href: "/tm-forum/assurance-report-template.html",
    type: "HTML · REPORT TEMPLATE",
    body: "Illustrative AL0 to AL2 forensic assurance structure. Sample statuses are placeholders, not measured competition findings.",
    action: "OPEN REPORT HTML",
    primary: false,
  },
] as const;

const screenshots = [
  { id: "1AZfUIBC7G7_SPVV-xwNmY4sdHgxYNUET", title: "Separate decision from enforcement", note: "Control register, evaluator, evidence ledger, control test and the four transport patterns." },
  { id: "1uilUeVPXt7wXq81A4cwl0uaKx8Urut1g", title: "Three-agent lab topology", note: "Customer, IT and network zones with zone gateways and the shared model gateway." },
  { id: "14CJS-LsW3Qdt4AmS6_X0i8JZ7wtIFTK8", title: "Controls 7, 9 and 16", note: "Event recording, drift and performance, and per-run spend cap." },
  { id: "19XAB4IUw2cofNWbhWyUXoENwwzp3y6uz", title: "Claim-to-evidence control tree", note: "Claim, control objective, risk, control test and evidence structure." },
  { id: "1YDULe4mVOVr790qbIrU5psCVkq5PUduk", title: "Control 16 worked example", note: "Declare, enforce, record, test and show for the shared model gateway." },
  { id: "19nCZjS_vBxqUfKZkH7JqpoPoEs95AkFl", title: "Controls 7 and 9 examples", note: "Illustrative measurement patterns for timing gaps and drift against a frozen baseline." },
  { id: "1XHgNwDGh5GOjQL7HIA8dp1kJgvLF-NKU", title: "Six required steps", note: "The required implementation order plus the bonus paths." },
  { id: "1kAE3KldF9uKdDHi-2t8Q78fLmfx372jh", title: "How the team will be judged", note: "Completion, quality and bonus criteria, including what loses marks." },
  { id: "1Bkcud7G-NWPLNLj9H5NbcrHmhhWinb86", title: "Judgment-day artifacts", note: "Evidence file, threshold document, control test tool, named runs, architecture sketch and gap list." },
] as const;

export default function TmForumChallengePage() {
  return (
    <div className="tmf-page">
      <section className="tmf-hero">
        <div className="tmf-kicker">TEAM REFERENCE · TM FORUM INNOVATE AMERICAS 2026</div>
        <h1>Trustworthy AI & Data Hackathon</h1>
        <p className="tmf-lede">One operational page for the challenge model, controls, working HTML tools, shared files, screenshots, judging expectations and event logistics.</p>
        <div className="tmf-meta"><span>Oct 4 to 7, 2026</span><span>Dallas + Allen, Texas</span><span>HAIEC + LogSense</span><span>Team working hub</span></div>
        <div className="tmf-warning"><strong>Operating rule:</strong> organizer material and the live supplied environment take precedence. Items marked ONSITE VERIFY remain hypotheses until confirmed.</div>
      </section>

      <section className="tmf-start" aria-label="Start here">
        <div className="tmf-start-copy">
          <div className="tmf-start-label">START HERE</div>
          <h2>Open the working tools first</h2>
          <p>The Field Guide and Intake HTMLs are the two primary team tools. Keep the Drive folder open beside them during the event.</p>
        </div>
        <div className="tmf-start-actions">
          <a className="tmf-big-action" href="/tm-forum/team-field-guide.html" target="_blank" rel="noreferrer"><span>01</span><div><b>FIELD GUIDE HTML</b><small>Challenge, controls, judging and operating model</small></div><strong>OPEN ↗</strong></a>
          <a className="tmf-big-action" href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer"><span>02</span><div><b>INTAKE HTML</b><small>Live environment and evidence capture worksheet</small></div><strong>OPEN ↗</strong></a>
          <a className="tmf-big-action drive" href={DRIVE_URL} target="_blank" rel="noreferrer"><span>03</span><div><b>SHARED GOOGLE DRIVE</b><small>Team files, evidence and competition artifacts</small></div><strong>OPEN ↗</strong></a>
        </div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>01</span><div><h2>The challenge in one view</h2><p>Build evidence-backed controls around the running system without confusing telemetry, evaluation and enforcement.</p></div></div>
        <div className="tmf-flow"><div><b>AI system</b><small>Agents already running</small></div><span>→</span><div><b>Enforcement points</b><small>Observe, decide, refuse</small></div><span>→</span><div><b>Telemetry</b><small>What the system emits</small></div><span>+</span><div><b>Governance side</b><small>Control register, evaluator, evidence ledger, control tests</small></div></div>
        <div className="tmf-rule-grid"><article><b>Decision</b><p>The evaluator compares measured values against a declared rule and returns a verdict.</p></article><article><b>Enforcement</b><p>The enforcement point acts on the verdict. Keeping this separate prevents hidden policy state in the path.</p></article><article><b>Evidence</b><p>Records bind the run, control, threshold version and observation so another person can verify the result.</p></article><article><b>Control test</b><p>The judge should be able to ask about one control and one run and get the verdict with the records behind it.</p></article></div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>02</span><div><h2>The three event controls</h2><p>Complete one end to end at minimum. A second and third control increase coverage and bonus potential.</p></div></div>
        <div className="tmf-controls">{controls.map((control) => (<article key={control.id}><div className="tmf-control-top"><span>{control.id}</span><code>{control.code}</code></div><h3>{control.title}</h3><div className="tmf-pill">{control.mode}</div><p><b>Measure:</b> {control.measure}</p><p><b>Evidence:</b> {control.proof}</p></article>))}</div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>03</span><div><h2>What to build and what judges will test</h2><p>The highest leverage is a reproducible path from declared threshold to measured value to verdict to evidence.</p></div></div>
        <div className="tmf-two-col"><article className="tmf-panel"><h3>Required sequence</h3><ol><li>Choose the control or controls.</li><li>Declare and date threshold ranges before the assessed run.</li><li>Decide when in the timeline the control is checked.</li><li>Build the control at a selected enforcement point.</li><li>Build the control test and evaluator.</li><li>Run one passing case and one breaching case, then record the gaps.</li></ol></article><article className="tmf-panel"><h3>Judging focus</h3><ul><li><b>Completion:</b> how many of the three controls work end to end.</li><li><b>Live test:</b> can the team answer a named control/run question quickly.</li><li><b>Architecture:</b> can the design move to another enforcement point without rewriting the control.</li><li><b>Evidence:</b> are verdicts bound to a control, threshold version and run.</li><li><b>Honesty:</b> gaps and failures are recorded instead of converted into green checks.</li></ul></article></div>
      </section>

      <section className="tmf-section" id="resources">
        <div className="tmf-section-head"><span>04</span><div><h2>Team resources</h2><p>These links are intentionally large and direct. The two HTML tools and Drive folder should be the team&apos;s working tabs.</p></div></div>
        <div className="tmf-resources">{resources.map((resource) => (<a key={resource.href} className={resource.primary ? "primary" : ""} href={resource.href} target="_blank" rel="noreferrer"><small>{resource.type}</small><h3>{resource.title}</h3><p>{resource.body}</p><span>{resource.action} ↗</span></a>))}</div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>05</span><div><h2>Briefing screenshots</h2><p>All nine source screenshots are shown individually. Select any image to open the full-size version.</p></div></div>
        <div className="tmf-gallery">{screenshots.map((shot, index) => { const view = `https://drive.google.com/file/d/${shot.id}/view?usp=sharing`; const thumb = `https://drive.google.com/thumbnail?id=${shot.id}&sz=w1600`; return (<figure key={shot.id}><a href={view} target="_blank" rel="noreferrer"><img src={thumb} alt={`TM Forum briefing slide ${index + 1}: ${shot.title}`} loading={index < 2 ? "eager" : "lazy"} referrerPolicy="no-referrer" /></a><figcaption><span>{String(index + 1).padStart(2, "0")}</span><div><b>{shot.title}</b><p>{shot.note}</p><a className="tmf-image-link" href={view} target="_blank" rel="noreferrer">Open full image in Drive ↗</a></div></figcaption></figure>); })}</div>
      </section>

      <section className="tmf-section">
        <div className="tmf-section-head"><span>06</span><div><h2>Event logistics that affect execution</h2><p>Only the items that can affect team availability, support or judging are repeated here.</p></div></div>
        <div className="tmf-logistics"><article><b>Sunday and Monday</b><p>AT&amp;T Headquarters, 208 South Akard, Dallas. Check in at Building 1. Hackathon space is Building 3, 12th-floor auditorium.</p></article><article><b>Tuesday and Wednesday</b><p>Marriott Dallas Allen Hotel &amp; Convention Center, 777 Watters Creek Blvd, Allen. Hackathon room: Starlight Ballroom 3.</p></article><article><b>Judging window</b><p>Preliminary judging is Tuesday, with finalists announced afterward and finalist judging later that afternoon. Awards are Wednesday.</p></article><article><b>Support</b><p>Microsoft Teams is the official remote support channel. Each team has a room. The designated SPOC posts in the main chat, with urgent issues prefixed “Blocker”.</p></article></div>
      </section>

      <section className="tmf-endcap"><p>Fast path during the event</p><div><a href="/tm-forum/team-field-guide.html" target="_blank" rel="noreferrer">1. Field Guide HTML</a><span>→</span><a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer">2. Intake HTML</a><span>→</span><a href={DRIVE_URL} target="_blank" rel="noreferrer">3. Google Drive</a><span>→</span><a href="/tm-forum/assurance-report-template.html" target="_blank" rel="noreferrer">4. Report Template</a></div></section>

      <style>{`
        .tmf-page{max-width:1240px;margin:0 auto;padding:54px 28px 80px;font-family:var(--font-sans);color:var(--fg)}
        .tmf-hero{padding:34px;border:1px solid var(--op-border);border-radius:20px;background:linear-gradient(145deg,var(--op-card),var(--bg));box-shadow:0 20px 55px rgba(0,0,0,.18)}
        .tmf-kicker{font-family:var(--font-mono);font-size:11px;letter-spacing:.13em;color:var(--op-accent);margin-bottom:14px}
        .tmf-hero h1{font-family:var(--font-serif);font-size:clamp(42px,7vw,78px);line-height:.98;letter-spacing:-.035em;margin:0 0 18px;font-weight:400;max-width:900px}
        .tmf-lede{font-size:18px;line-height:1.65;color:var(--text-secondary);max-width:850px;margin:0}
        .tmf-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}.tmf-meta span,.tmf-pill{font-family:var(--font-mono);font-size:11px;padding:6px 9px;border:1px solid var(--op-border);border-radius:999px;color:var(--text-secondary);background:var(--bg)}
        .tmf-warning{margin-top:22px;padding:13px 15px;border-left:3px solid var(--op-accent);background:rgba(22,208,136,.06);font-size:14px;line-height:1.6}
        .tmf-start{margin-top:22px;padding:24px;border:2px solid var(--op-accent);border-radius:18px;background:linear-gradient(135deg,rgba(22,208,136,.10),var(--op-card));display:grid;grid-template-columns:.72fr 1.28fr;gap:24px;align-items:start}
        .tmf-start-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;color:var(--op-accent);margin-bottom:8px}.tmf-start h2{font-family:var(--font-serif);font-size:34px;font-weight:400;margin:0 0 10px}.tmf-start p{margin:0;color:var(--text-secondary);line-height:1.6}
        .tmf-start-actions{display:grid;gap:10px}.tmf-big-action{display:grid;grid-template-columns:34px 1fr auto;gap:14px;align-items:center;padding:15px 16px;border:1px solid var(--op-border);border-radius:12px;background:var(--bg);color:var(--fg);text-decoration:none}.tmf-big-action:hover{border-color:var(--op-accent);transform:translateY(-1px)}.tmf-big-action>span{font-family:var(--font-mono);font-size:11px;color:var(--op-accent)}.tmf-big-action b{display:block;font-size:14px;letter-spacing:.02em}.tmf-big-action small{display:block;color:var(--text-secondary);font-size:12px;margin-top:3px}.tmf-big-action strong{font-family:var(--font-mono);font-size:11px;color:var(--op-accent)}.tmf-big-action.drive{background:rgba(22,208,136,.07)}
        .tmf-section{padding:56px 0 8px}.tmf-section-head{display:flex;gap:16px;align-items:flex-start;margin-bottom:24px}.tmf-section-head>span{font-family:var(--font-mono);font-size:12px;color:var(--op-accent);padding-top:7px}.tmf-section-head h2{font-family:var(--font-serif);font-size:clamp(30px,4vw,48px);font-weight:400;line-height:1.05;margin:0 0 8px}.tmf-section-head p{margin:0;color:var(--text-secondary);max-width:760px;line-height:1.6}
        .tmf-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1.25fr;gap:10px;align-items:stretch}.tmf-flow div{border:1px solid var(--op-border);border-radius:14px;padding:18px;background:var(--op-card)}.tmf-flow b{display:block;margin-bottom:6px}.tmf-flow small{color:var(--text-secondary);line-height:1.45}.tmf-flow>span{align-self:center;color:var(--op-muted)}
        .tmf-rule-grid,.tmf-controls,.tmf-resources,.tmf-logistics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:14px}.tmf-rule-grid article,.tmf-panel,.tmf-controls article,.tmf-logistics article{padding:18px;border:1px solid var(--op-border);border-radius:14px;background:var(--op-card)}.tmf-rule-grid p,.tmf-controls p,.tmf-logistics p{font-size:14px;line-height:1.6;color:var(--text-secondary);margin:7px 0 0}
        .tmf-controls{grid-template-columns:repeat(3,minmax(0,1fr))}.tmf-control-top{display:flex;align-items:center;gap:10px}.tmf-control-top>span{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:var(--op-accent);color:#06120d;font-weight:700}.tmf-control-top code{font-family:var(--font-mono);font-size:12px;color:var(--text-secondary)}.tmf-controls h3{font-size:20px;margin:16px 0 10px}.tmf-pill{display:inline-block;margin-bottom:8px}
        .tmf-two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}.tmf-panel h3{font-size:20px;margin:0 0 12px}.tmf-panel ol,.tmf-panel ul{margin:0;padding-left:20px}.tmf-panel li{margin:10px 0;color:var(--text-secondary);line-height:1.55}.tmf-panel li b{color:var(--fg)}
        .tmf-resources{grid-template-columns:repeat(2,minmax(0,1fr))}.tmf-resources a{display:flex;flex-direction:column;min-height:245px;padding:24px;border:1px solid var(--op-border);border-radius:16px;background:var(--op-card);color:var(--fg);text-decoration:none;transition:transform .18s,border-color .18s,box-shadow .18s}.tmf-resources a.primary{border-width:2px;border-color:rgba(22,208,136,.62);background:linear-gradient(145deg,rgba(22,208,136,.08),var(--op-card))}.tmf-resources a:hover{transform:translateY(-3px);border-color:var(--op-accent);box-shadow:0 16px 32px rgba(0,0,0,.14)}.tmf-resources small{font-family:var(--font-mono);font-size:10px;color:var(--op-accent);text-transform:uppercase;letter-spacing:.09em}.tmf-resources h3{font-size:23px;margin:12px 0 9px}.tmf-resources p{font-size:14px;line-height:1.6;color:var(--text-secondary);margin:0 0 20px}.tmf-resources span{display:inline-flex;margin-top:auto;align-self:flex-start;font-family:var(--font-mono);font-size:12px;font-weight:700;padding:10px 13px;border-radius:9px;background:var(--fg);color:var(--bg)}
        .tmf-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.tmf-gallery figure{margin:0;border:1px solid var(--op-border);border-radius:16px;overflow:hidden;background:var(--op-card)}.tmf-gallery a{display:block;background:#fff}.tmf-gallery img{display:block;width:100%;height:auto;aspect-ratio:1.97/1;object-fit:contain;background:#fff}.tmf-gallery figcaption{display:grid;grid-template-columns:32px 1fr;gap:12px;padding:15px 16px}.tmf-gallery figcaption>span{font-family:var(--font-mono);font-size:11px;color:var(--op-accent);padding-top:2px}.tmf-gallery figcaption b{display:block;font-size:14px}.tmf-gallery figcaption p{margin:5px 0 7px;color:var(--text-secondary);font-size:12px;line-height:1.45}.tmf-image-link{color:var(--op-accent);font-family:var(--font-mono);font-size:10px;text-decoration:none}.tmf-image-link:hover{text-decoration:underline}
        .tmf-logistics{grid-template-columns:repeat(2,minmax(0,1fr))}.tmf-logistics article b{display:block;margin-bottom:5px}
        .tmf-endcap{margin-top:56px;padding:24px;border:1px solid var(--op-border);border-radius:16px;background:var(--op-card)}.tmf-endcap p{font-family:var(--font-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-secondary);margin:0 0 10px}.tmf-endcap div{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.tmf-endcap a{color:var(--fg);text-decoration:none;font-weight:600}.tmf-endcap a:hover{color:var(--op-accent)}.tmf-endcap span{color:var(--op-muted)}
        @media(max-width:900px){.tmf-start{grid-template-columns:1fr}.tmf-flow{grid-template-columns:1fr}.tmf-flow>span{display:none}.tmf-rule-grid,.tmf-controls{grid-template-columns:1fr 1fr}.tmf-hero{padding:26px}.tmf-page{padding:36px 20px 64px}}
        @media(max-width:640px){.tmf-rule-grid,.tmf-controls,.tmf-resources,.tmf-two-col,.tmf-logistics,.tmf-gallery{grid-template-columns:1fr}.tmf-section{padding-top:42px}.tmf-big-action{grid-template-columns:26px 1fr}.tmf-big-action strong{grid-column:2}.tmf-start{padding:18px}.tmf-start h2{font-size:29px}}
      `}</style>
    </div>
  );
}
