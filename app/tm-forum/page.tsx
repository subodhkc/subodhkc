import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyPromptButton } from "@/components/tm-forum/CopyPromptButton";
import { HubQrCodes } from "@/components/tm-forum/HubQrCodes";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Copy,
  HelpCircle,
  Download,
  FileText,
  FileJson,
  FlaskConical,
  Layers,
  MonitorCheck,
  Network,
  PlugZap,
  RefreshCcw,
  Scale,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

export const metadata: Metadata = {
  title: "HAIEC × TM Forum 2026 — Judge Evidence Hub | Subodh KC",
  description:
    "TM Forum Innovate Americas 2026 Agentic Assurance: the complete evidence hub. Control results, reports, diagrams, reproducible verification, and a read-only HAIEC MCP interface for judges.",
  alternates: { canonical: "https://subodhkc.com/tm-forum" },
  openGraph: {
    title: "HAIEC × TM Forum 2026 — Agentic Assurance Judge Evidence Hub",
    description:
      "What happened. What the controls proved. What remains unknown. Reproduce the evidence yourself.",
    url: "https://subodhkc.com/tm-forum",
    type: "website",
  },
};

const HAIEC = "https://www.haiec.com";
const WORKSPACE = `${HAIEC}/dashboard/assurance-lab`;
const LOGIN = `${HAIEC}/login`;
const MCP = `${HAIEC}/api/mcp`;
const ASSET = "/tm-forum/assets";
const DIAG = "/tm-forum/diagrams";

const JUDGE_PROMPT = `You are reviewing HAIEC's TM Forum 2026 Agentic Assurance evidence.

Use the connected HAIEC MCP tools as the source of truth.

Do not infer unsupported facts.

Please:

1. Identify the assessed TM Forum AI system.
2. Show the current C7, C9 and C16 Control Test results.
3. Explain each result in plain English.
4. For each result show:
   - frozen policy
   - run ID
   - calculation
   - evidence references
   - limitations
5. Explain why C7 is NOT_SATISFIED.
6. Compare the C16 PASS and BREACH runs.
7. Tell me whether a valid C9 breach was established.
8. Explain whether delegation was proven.
9. Show the major findings.
10. Explain what remains UNKNOWN or NOT_ESTABLISHED and why.
11. Distinguish synthetic evidence from real assessed-event evidence.
12. Do not convert missing evidence into PASS.`;

const MCP_AGENT_SETUP_PROMPT = `Add the HAIEC read-only evidence server to my MCP configuration.

Server name: haiec
Transport: streamable HTTP
URL: https://www.haiec.com/api/mcp
Auth: Authorization: Bearer <paste your read-only judge key from the private handoff>

Steps:
1. Add the server block to this client's MCP config (the JSON format this client uses).
2. Reconnect or reload MCP servers.
3. List the available HAIEC tools so I can confirm the connection worked.
4. Then run the smoke query: "Show the C16 Control Test results for the assessed TM Forum system."

Do not store, print, or commit the API key anywhere else.`;

function Chip({ tone, children }: { tone: "proven" | "partial" | "unknown" | "neutral" | "info"; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    proven: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    partial: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    unknown: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
    neutral: "border-border bg-muted text-muted-foreground",
    info: "border-primary/30 bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide ${styles[tone]}`}>
      {children}
    </span>
  );
}

function ExtLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline ${className}`}>
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </a>
  );
}

function ReportCard({
  title,
  answers,
  href,
  pdf,
  status,
  note,
}: {
  title: string;
  answers: string;
  href?: string;
  pdf?: string;
  status: string;
  note?: string;
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base leading-snug">{title}</CardTitle>
          <Chip tone="neutral">{status}</Chip>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 text-sm">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">What this answers:</span> {answers}
        </p>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <FileText className="h-4 w-4" /> Open
            </a>
          )}
          {pdf && (
            <a href={pdf} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline" download>
              <Download className="h-4 w-4" /> PDF
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function DiagramFigure({ src, title, lookingAt, matters }: { src: string; title: string; lookingAt: string; matters: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="border-b border-border bg-card px-5 py-3">
        <figcaption className="text-sm font-semibold">{title}</figcaption>
      </div>
      <div className="flex justify-center bg-white p-4">
        <Image src={src} alt={title} width={880} height={420} className="h-auto w-full max-w-3xl" />
      </div>
      <div className="space-y-1.5 px-5 py-4 text-sm">
        <p>
          <span className="font-mono text-xs font-semibold text-primary">WHAT YOU ARE LOOKING AT — </span>
          <span className="text-muted-foreground">{lookingAt}</span>
        </p>
        <p>
          <span className="font-mono text-xs font-semibold text-primary">WHY IT MATTERS — </span>
          <span className="text-muted-foreground">{matters}</span>
        </p>
      </div>
    </figure>
  );
}

export default function TmForumHub() {
  return (
    <>
      <Hero
        subtitle="TM Forum Innovate Americas 2026 · Agentic Assurance: The Quest for Proof"
        title={
          <>
            HAIEC × TM Forum 2026
            <br />
            <span className="gradient-text">Judge Evidence Hub.</span>
          </>
        }
        description="What happened. What the controls proved. What remains unknown. Reproduce the evidence yourself."
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="#start" className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25">
            START HERE <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium">
            Open Judge Report
          </a>
          <ExtLink href={WORKSPACE} className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium !no-underline">
            Open HAIEC Judge Workspace
          </ExtLink>
          <Link href="#mcp" className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium">
            Connect HAIEC MCP
          </Link>
          <Link href="#reproduce" className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium">
            Reproduce the Proof
          </Link>
          <a href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.pdf`} download className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium">
            Download PDF
          </a>
          <Link href="#artifacts" className="inline-flex items-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium">
            View Required Artifacts
          </Link>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">
          A read-only judge account has been prepared for TM Forum reviewers. Credentials are provided separately in the official judge handoff.
        </p>
      </Hero>

      {/* quick-jump navigation */}
      <nav aria-label="Section navigation" className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="section-container flex gap-1 overflow-x-auto py-2 text-xs font-medium">
          {[
            ["#start", "Start"], ["#results", "Results"], ["#reports", "Reports"], ["#artifacts", "Artifacts"],
            ["#diagrams", "Diagrams"], ["#haiec", "HAIEC"], ["#mcp", "MCP"], ["#reproduce", "Reproduce"],
            ["#logsense", "LogSense"], ["#requirements", "Coverage"], ["#findings", "Open"], ["#downloads", "Downloads"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap rounded-md px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* ===================== START HERE ===================== */}
      <Section id="start" subtitle="Start Here" title="The whole case in one read" sectionNum="01">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          The competition supplied a governed AI runtime, raw evidence, and a starter kit. We reconstructed what the agents actually did, then tested three frozen controls against that evidence. One control failed honestly, two passed, and every verdict can be independently reproduced.
        </p>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["WHAT THE COMPETITION ASKED", "Prove that an agentic AI system can be governed and assured with evidence, not claims. Score scenarios, evaluate frozen controls, and let judges verify results independently."],
            ["WHAT WE BUILT", "HAIEC: versioned frozen policies, an authority/effect evidence model, deterministic Control Tests, persistent results, and a reproducible judge interface. LogSense: preservation, correlation, and reconstruction of runtime evidence."],
            ["WHAT WE TESTED", "Three frozen controls — C7 (delegation/logging coverage), C9 (latency policy), C16 (token spend cap) — plus four scenario runs including one failed remediation retest."],
            ["WHAT WE FOUND", "C7 NOT_SATISFIED (9/10 evidence categories; agent negotiation not observed). C9 SATISFIED twice with no manufactured breach. C16 one PASS and one real BREACH under the same frozen policy."],
            ["WHAT YOU CAN REPRODUCE", "All five persisted Control Test results via VERIFY in the Judge Workspace or the read-only verify API. Historical scenarios via REPLAY. The judge report is a self-contained artifact."],
            ["WHAT REMAINS OPEN", "Delegation (DAI) is UNKNOWN — surrounding facts are proven, the negotiation proof edge is not. ServiceNow integration is PARTIAL. No completed full Assurance Evaluation exists, and we do not pretend one does."],
          ].map(([h, b]) => (
            <div key={h} className="bg-background p-6">
              <h3 className="font-mono text-xs font-semibold tracking-wider text-primary">{h}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="mb-4 text-lg font-semibold">Six auditor questions</h3>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-card">
                  <th className="p-4">Question</th>
                  <th className="p-4">Answer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Best evidence</th>
                  <th className="p-4">Open limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="p-4 font-medium">Who acted?</td><td className="p-4">Customer, IT, and Network agents; governed runtime; operators.</td><td className="p-4"><Chip tone="proven">ESTABLISHED</Chip></td><td className="p-4 font-mono text-xs">Report §3, run register</td><td className="p-4">Run-start provenance is partially reconstructed.</td></tr>
                <tr><td className="p-4 font-medium">What was touched?</td><td className="p-4">Model calls, governed tools, telemetry sinks, cost ledger.</td><td className="p-4"><Chip tone="proven">ESTABLISHED</Chip></td><td className="p-4 font-mono text-xs">Report §4–§6</td><td className="p-4">Telemetry coverage bounded by connected sources.</td></tr>
                <tr><td className="p-4 font-medium">Was it authorized?</td><td className="p-4">Yes for the observed actions; authorization ≠ exercised delegation.</td><td className="p-4"><Chip tone="proven">ESTABLISHED</Chip></td><td className="p-4 font-mono text-xs">Report §7, five-plane matrix</td><td className="p-4">Permission evidence does not prove an action occurred.</td></tr>
                <tr><td className="p-4 font-medium">Who approved?</td><td className="p-4">Governance and approval records where present; no silent escalation observed.</td><td className="p-4"><Chip tone="partial">PARTIAL</Chip></td><td className="p-4 font-mono text-xs">Report §7, §15</td><td className="p-4">HITL approval linkage is an open frontier.</td></tr>
                <tr><td className="p-4 font-medium">Integrity?</td><td className="p-4">Frozen policies by digest; package 7a0bb5f3, 506 files, SHA-256 pinned.</td><td className="p-4"><Chip tone="proven">ESTABLISHED</Chip></td><td className="p-4 font-mono text-xs">Report J8–J9, DATA.json</td><td className="p-4">Digest binding shown; no clock-time freeze timestamps persisted.</td></tr>
                <tr><td className="p-4 font-medium">Reconstruct?</td><td className="p-4">Yes — VERIFY re-derives every verdict; REPLAY reconstructs scenarios.</td><td className="p-4"><Chip tone="proven">REPRODUCIBLE</Chip></td><td className="p-4 font-mono text-xs">Workspace PROVE panel</td><td className="p-4">Reproduction is historical, not a re-execution.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-primary/25 bg-primary/5 p-6 md:p-8">
          <h3 className="mb-4 font-mono text-xs font-semibold tracking-wider text-primary">THE 90-SECOND VERSION — SAY IT PLAINLY</h3>
          <ol className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
            <li><span className="font-mono text-primary">1.</span> The organizer gave us a governed runtime and an assurance scaffold; we turned it into a reproducible evidence system.</li>
            <li><span className="font-mono text-primary">2.</span> LogSense reconstructs what happened; HAIEC decides whether frozen controls actually held.</li>
            <li><span className="font-mono text-primary">3.</span> We preserved good and bad outcomes: an honest C7 failure, two C9 satisfactions without inventing a breach, and a comparable C16 pass and breach.</li>
            <li><span className="font-mono text-primary">4.</span> When evidence stops, HAIEC stops — permission does not become delegation and UNKNOWN does not become PASS.</li>
            <li><span className="font-mono text-primary">5.</span> Give us a control and a run; you can reproduce the result and inspect the evidence directly.</li>
          </ol>
        </div>
      </Section>

      {/* ===================== RESULTS ===================== */}
      <Section id="results" subtitle="Control Results" title="Three frozen controls, honest verdicts" sectionNum="02">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Each control was declared and frozen before the assessed runs, then evaluated deterministically afterward. A Control Test answers one question: did the frozen rule hold against the persisted evidence. It is not a scenario score and not a full Assurance Evaluation.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">C7 · AIA-LOG-001</CardTitle>
                <Chip tone="partial">NOT_SATISFIED</Chip>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">9 / 10</span> required evidence categories covered. Missing: IT ↔ Network <span className="font-mono">NEGOTIATION</span>.</p>
              <p>The system had relevant capability and permission, but the required negotiation evidence was not observed. HAIEC failed the control rather than inferring delegation from permission.</p>
              <p className="font-mono text-xs">Run fault-1791167110-5e3126 · Result ctr-abdf612f…4c7a · <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j3`}>full card J3</ExtLink></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">C9 · AIA-ARC-006</CardTitle>
                <Chip tone="proven">SATISFIED ×2</Chip>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Two assessed runs both satisfied the frozen latency policy (mean agent-window duration vs per-agent baseline). Eligible breach: <span className="font-mono">NOT_ESTABLISHED</span>.</p>
              <p>We did not manufacture a breach: the intended-breach run still satisfied the frozen policy (+28.5% did not degrade the measured metric below the rule). Workflow intent is not a verdict.</p>
              <p className="font-mono text-xs">Runs fault-1791183079-256a5e / fault-1791183213-228329 · <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j2`}>full card J2</ExtLink></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">C16 · ACN-COST-001</CardTitle>
                <Chip tone="proven">PASS + BREACH</Chip>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>One frozen cap of 60,000 tokens per run. Pass run measured <span className="font-mono">35,559</span>. Breach run measured <span className="font-mono">106,829</span> (17 calls, +46,829 overshoot, <span className="font-mono">SPEND_CAP_EXCEEDED</span>).</p>
              <p>Same frozen rule produced both outcomes on different persisted facts — a deterministic post-run Control Test, not a claim of inline pre-execution enforcement.</p>
              <p className="font-mono text-xs">Runs fault-1791167110-5e3126 / fault-1791165466-51ab52 · <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j2`}>full card J2</ExtLink></p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">DAI · Delegation</CardTitle>
                <Chip tone="unknown">UNKNOWN</Chip>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Permission and capability were established; observed delegation was not. UNKNOWN names the exact evidence frontier instead of guessing.</p>
              <p>UNKNOWN does not mean nothing was done. It means surrounding facts are proven and the stronger conclusion lacks its required proof edge.</p>
              <p className="font-mono text-xs"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s14`}>report §14</ExtLink> · <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#p1`}>why UNKNOWN is not empty (P1)</ExtLink></p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===================== REPORTS ===================== */}
      <Section id="reports" subtitle="Reports & Evidence" title="Every report, labeled by role" sectionNum="03">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          The judge report is a supplemental evidence report, not a canonical Master Assurance Report — no completed canonical Evaluation exists and we do not call it one. Everything below opens without a login and stays usable even if live systems are torn down.
        </p>

        <h3 className="mb-4 font-mono text-xs font-semibold tracking-wider text-primary">START HERE</h3>
        <div className="mb-10 grid gap-5 md:grid-cols-2">
          <ReportCard
            title="Final Supplemental Judge Evidence Report (HTML)"
            answers="The whole case: Judge Mode in ~90 seconds, then Proof Mode and the full Technical Appendix in one self-contained file."
            href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html`}
            pdf={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.pdf`}
            status="SUPPLEMENTAL · CURRENT"
          />
          <ReportCard
            title="Deterministic Fact Snapshot (JSON)"
            answers="Every canonical value used in the report: policy IDs, digests, runs, metrics, thresholds, results — machine-checkable."
            href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT_DATA.json`}
            status="EVIDENCE · CURRENT"
          />
        </div>

        <h3 className="mb-4 font-mono text-xs font-semibold tracking-wider text-primary">CONTROL & GOVERNANCE</h3>
        <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ReportCard title="Thresholds, Policy Digests & Freeze Proof" answers="Exact frozen thresholds, policy IDs, and SHA-256 digests for C7/C9/C16, plus the honest temporal-binding chain." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j8`} status="IN REPORT J8" />
          <ReportCard title="Control Test Results" answers="Uniform control cards: policy, version, run, metric, threshold, formula, observed value, verdict, evidence, limitation, reproduction." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j2`} status="IN REPORT J2/§5" />
          <ReportCard title="Named Assessed Runs Register" answers="Every run ID, its role, and which result it produced — scenario runs kept distinct from assessed control runs." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j7`} status="IN REPORT J7/§6" />
          <ReportCard title="Gap / Remediation / Retest Register" answers="Open gaps bound to control, run, and evidence — including the S2 failed retest preserved as NOT_FIXED." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s15`} status="IN REPORT §15/P1" />
          <ReportCard title="Report Narrative Source (Markdown)" answers="Editable source text of the judge report for reviewers who want to diff claims against evidence." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT_SOURCE.txt`} status="SOURCE" />
        </div>

        <h3 className="mb-4 font-mono text-xs font-semibold tracking-wider text-primary">FORENSICS (LOGSENSE)</h3>
        <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ReportCard title="LogSense Reconstruction" answers="What LogSense reconstructed from raw platform telemetry: normalized events, correlation keys, and the run evidence chain." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s4`} status="IN REPORT §4" note="No standalone LogSense HTML report exists; its output is embedded in the report and replayable via REPLAY." />
          <ReportCard title="Scenario Analysis & Retest" answers="S1 (6/8), S2 (5/10), S2 retest (5/10, NOT_FIXED), S3 (8/10) — scores, findings, and what each proved." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s6`} status="IN REPORT §6" />
          <ReportCard title="Findings & Security Analysis" answers="Runtime enforcement evidence, security findings, detection coverage, and the detector-vs-Control-Test distinction." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s11`} status="IN REPORT §9–§12" />
        </div>

        <h3 className="mb-4 font-mono text-xs font-semibold tracking-wider text-primary">ASSURANCE</h3>
        <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ReportCard title="Five-Plane Assurance Matrix" answers="Requested, policy-authorized, effectively-granted, code-capable, observed — five independent evidence planes." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s7`} status="IN REPORT §7" />
          <ReportCard title="C7 Delegation Frontier" answers="Exactly where the delegation proof edge stops: capability yes, permission yes, observed negotiation no." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s8`} status="IN REPORT §8" />
          <ReportCard title="Evidence Quality & Detection Coverage" answers="How each evidence class was qualified, and what monitoring/detection actually covered." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s12`} status="IN REPORT §12" />
          <ReportCard title="ServiceNow AI Control Tower Boundary" answers="What ServiceNow integration established — and exactly what it does not prove." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s13`} status="IN REPORT §13 · PARTIAL" />
          <ReportCard title="Finding & Retest Lineage" answers="How findings bind to runs and how the failed S2 remediation is preserved rather than hidden." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s6`} status="IN REPORT" />
        </div>

        <h3 className="mb-4 font-mono text-xs font-semibold tracking-wider text-primary">ARCHITECTURE</h3>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ReportCard title="One-Page Architecture" answers="System → evidence → assurance in one view: runtime, LogSense, HAIEC evaluation, and the judge interface." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j6`} status="IN REPORT J6" />
          <ReportCard title="Monitoring & Alert Pipeline" answers="Telemetry intake, monitoring binders, alerts, and the synthetic canary that proved the pipeline without faking an incident." href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s9`} status="IN REPORT §9" />
          <ReportCard title="Diagram Pack (8 SVG)" answers="All source-backed diagrams as standalone files, also inlined in the report." href="#diagrams" status="ON THIS PAGE" />
        </div>
      </Section>

      {/* ===================== REQUIRED ARTIFACTS ===================== */}
      <Section id="artifacts" subtitle="Required Judge Artifacts" title="The six required artifacts" sectionNum="04">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          The six organizer artifacts live in the official judge handoff (Google Drive folder, distributed with frozen package 7a0bb5f3). For each one we show what it answers and the covering section of the public report so judges never wait on Drive access.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-card">
                <th className="p-4">Artifact</th>
                <th className="p-4">What it answers</th>
                <th className="p-4">Public coverage</th>
                <th className="p-4">Canonical copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr><td className="p-4 font-medium">01 · Evidence File / START HERE</td><td className="p-4">Where all evidence lives and how to begin.</td><td className="p-4"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j1`}>Report J1</ExtLink></td><td className="p-4"><Chip tone="neutral">DRIVE HANDOFF</Chip></td></tr>
              <tr><td className="p-4 font-medium">02 · Threshold &amp; Governance</td><td className="p-4">Frozen thresholds, policy IDs, digests, governance rules.</td><td className="p-4"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j8`}>Report J8</ExtLink></td><td className="p-4"><Chip tone="neutral">DRIVE HANDOFF</Chip></td></tr>
              <tr><td className="p-4 font-medium">03 · Control Test Judge Operator Card</td><td className="p-4">How a judge operates and verifies each control.</td><td className="p-4"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j10`}>Report J10</ExtLink></td><td className="p-4"><Chip tone="neutral">DRIVE HANDOFF</Chip></td></tr>
              <tr><td className="p-4 font-medium">04 · Named Assessed Runs Register</td><td className="p-4">Every assessed run, its role, and its result.</td><td className="p-4"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j7`}>Report J7</ExtLink></td><td className="p-4"><Chip tone="neutral">DRIVE HANDOFF</Chip></td></tr>
              <tr><td className="p-4 font-medium">05 · One-Page Architecture</td><td className="p-4">The system and assurance architecture at a glance.</td><td className="p-4"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#j6`}>Report J6</ExtLink></td><td className="p-4"><Chip tone="neutral">DRIVE HANDOFF</Chip></td></tr>
              <tr><td className="p-4 font-medium">06 · Gap / Remediation / Retest Register</td><td className="p-4">Open gaps, remediations, and retest lineage.</td><td className="p-4"><ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s15`}>Report §15</ExtLink></td><td className="p-4"><Chip tone="neutral">DRIVE HANDOFF</Chip></td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Frozen package: <span className="font-mono">7a0bb5f3</span> · 506 files · SHA-256 <span className="font-mono">0321b7127e544c5dcad453608f5e22f72c0c409735f07a1b924eaa4ecc4d966a</span> · state <span className="font-mono">FROZEN_DISTRIBUTED</span>. Distributed via the official handoff; not re-hosted here pending a full privacy review of the 506-file bundle.
        </p>
      </Section>

      {/* ===================== DIAGRAMS ===================== */}
      <Section id="diagrams" subtitle="Diagrams" title="The evidence, drawn" sectionNum="05">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Each diagram is generated from the same persisted values as the report. Two additional diagrams — the starter-kit-to-HAIEC pipeline and the cross-source correlation chain — are inside the report at J6 and the Proof Mode evidence section.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <DiagramFigure src={`${DIAG}/01_SYSTEM_PROOF_FLOW.svg`} title="System → Evidence → Assurance" lookingAt="The end-to-end path from governed runtime events through LogSense reconstruction into HAIEC control evaluation and judge verification." matters="It shows where each claim comes from. Nothing in the verdicts relies on narration." />
          <DiagramFigure src={`${DIAG}/02_FIVE_PLANE_ASSURANCE.svg`} title="Five-Plane Assurance" lookingAt="Five independent evidence planes: requested, policy-authorized, effectively-granted, code-capable, observed." matters="Enterprise governance often stops at approved. HAIEC asks what actually happened after approval." />
          <DiagramFigure src={`${DIAG}/03_CONTROL_RESULTS.svg`} title="Control Results" lookingAt="C7, C9, and C16 side by side with their frozen thresholds and measured values." matters="One frozen rule can honestly produce both pass and breach verdicts on different facts." />
          <DiagramFigure src={`${DIAG}/04_C7_DELEGATION_FRONTIER.svg`} title="C7 Delegation Frontier" lookingAt="Exactly where C7 evidence stops: capability and permission established, observed negotiation absent." matters="Permission is not delegation. The verdict fails at the missing proof edge, not before or after it." />
          <DiagramFigure src={`${DIAG}/05_C16_PASS_VS_BREACH.svg`} title="C16 PASS vs BREACH" lookingAt="Two runs, one frozen 60,000-token cap: 35,559 passes, 106,829 breaches." matters="Identical policy, different facts, different verdicts — the definition of deterministic evaluation." />
          <DiagramFigure src={`${DIAG}/06_DETECTION_VS_CONTROL_TEST.svg`} title="Detection vs Control Test" lookingAt="Why generic detector findings and deterministic Control Tests answer different questions." matters="Zero generic findings does not mean a control passed. Each has its own contract." />
          <DiagramFigure src={`${DIAG}/07_SCENARIO_REPLAY.svg`} title="Scenario Replay" lookingAt="The four scenario runs including the S2 retest that stayed NOT_FIXED." matters="Scenario scores are preserved as scores — never upgraded into control verdicts." />
          <DiagramFigure src={`${DIAG}/08_SERVICENOW_BOUNDARY.svg`} title="ServiceNow Boundary" lookingAt="What the ServiceNow AI Control Tower integration established and where its proof stops." matters="A real boundary statement beats a claimed integration. PARTIAL is shown as PARTIAL." />
        </div>
      </Section>

      {/* ===================== OPEN HAIEC ===================== */}
      <Section id="haiec" subtitle="Open HAIEC" title="The live system, read-only" sectionNum="06">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          A read-only judge account has been prepared for TM Forum reviewers. Credentials are provided separately in the official judge handoff and are never published. Everything read-only on this page also works offline via the report artifacts.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader><MonitorCheck className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">Judge Workspace</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Control results, VERIFY / VERIFY ALL, scenario REPLAY, enforcement evidence, findings, and the honest frontier — one surface.</p>
              <p><ExtLink href={WORKSPACE}>haiec.com/dashboard/assurance-lab</ExtLink></p>
              <Chip tone="info">READ-ONLY JUDGE</Chip>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><ShieldCheck className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">Sign In</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Use the read-only judge credentials from the private handoff.</p>
              <p><ExtLink href={LOGIN}>haiec.com/login</ExtLink></p>
              <p className="text-xs">No credentials appear in source, config, or downloads.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><PlugZap className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">MCP Endpoint</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Read-only Model Context Protocol interface for AI clients and IDEs.</p>
              <p className="font-mono text-xs break-all">{MCP}</p>
              <Link href="#mcp" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Setup guide <ArrowRight className="h-3.5 w-3.5" /></Link>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===================== MCP ===================== */}
      <Section id="mcp" subtitle="Connect HAIEC to Your AI Agent" title="Ask the evidence, not the team" sectionNum="07">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          HAIEC exposes a read-only MCP interface. Point any MCP-compatible AI client at it and ask questions — the answers come from persisted event data, so you do not have to trust our narration. The API key travels only in the private judge handoff.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><TerminalSquare className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">Any MCP client that supports a remote HTTP server with custom headers:</p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-card p-4 font-mono text-xs leading-relaxed">{`{
  "mcpServers": {
    "haiec": {
      "url": "https://www.haiec.com/api/mcp",
      "headers": {
        "Authorization": "Bearer \${HAIEC_MCP_API_KEY}"
      }
    }
  }
}`}</pre>
              <p className="text-xs text-muted-foreground">Substitute your read-only judge key for the placeholder. Never commit a config containing the real key.</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Open your client&apos;s MCP / tool settings.</li>
                <li>Add a server named <span className="font-mono">haiec</span>.</li>
                <li>URL: <span className="font-mono">https://www.haiec.com/api/mcp</span>.</li>
                <li>Header: <span className="font-mono">Authorization: Bearer &lt;judge key&gt;</span>.</li>
                <li>Save and reconnect; confirm HAIEC tools appear.</li>
                <li>Run a test query from the list below.</li>
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Copy className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">Prompts to paste</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="mb-2 font-medium">Full 12-step judge prompt</p>
                <CopyPromptButton text={JUDGE_PROMPT} label="Copy judge prompt" />
              </div>
              <div>
                <p className="mb-2 font-medium">Agent self-setup prompt (configures the MCP for you)</p>
                <CopyPromptButton text={MCP_AGENT_SETUP_PROMPT} label="Copy agent setup prompt" />
              </div>
              <div className="flex flex-wrap gap-4 pt-1 text-sm">
                <a href="/tm-forum/TMF_MCP_SETUP_GUIDE.txt" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline" download><Download className="h-4 w-4" /> MCP Setup Guide</a>
                <a href="/tm-forum/TMF_JUDGE_PROMPT_PACK.txt" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline" download><Download className="h-4 w-4" /> Judge Prompt Pack</a>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-lg">Questions that work</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Was C16 satisfied for the breach run?</li>
                <li>Why did C7 fail?</li>
                <li>Compare the C16 PASS and BREACH runs.</li>
                <li>Was delegation proven?</li>
                <li>What remains unknown?</li>
                <li>What did LogSense find vs what did HAIEC decide?</li>
                <li>Show the ServiceNow evidence and limitations.</li>
                <li>Explain the S2 original run and failed retest.</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Scale className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">Challenge the system</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">Questions designed to catch an assurance system that bluffs — with the honest expected answers.</p>
              <ul className="space-y-2 text-sm">
                <li><span className="text-muted-foreground">Does permission prove delegation?</span> <Chip tone="neutral">NO</Chip></li>
                <li><span className="text-muted-foreground">Did 84 real tools execute?</span> <Chip tone="neutral">NO — model turns, 1 real tool invocation</Chip></li>
                <li><span className="text-muted-foreground">Did the synthetic canary prove a real incident?</span> <Chip tone="neutral">NO — SYNTHETIC / NON-SCORED</Chip></li>
                <li><span className="text-muted-foreground">Does zero generic findings mean C16 passed?</span> <Chip tone="neutral">NO — different contracts</Chip></li>
                <li><span className="text-muted-foreground">Was ServiceNow fully integrated?</span> <Chip tone="neutral">PARTIAL</Chip></li>
                <li><span className="text-muted-foreground">Did C9 actually breach?</span> <Chip tone="neutral">NOT_ESTABLISHED</Chip></li>
                <li><span className="text-muted-foreground">Can you reproduce C16?</span> <Chip tone="neutral">YES — VERIFY</Chip></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===================== REPRODUCE ===================== */}
      <Section id="reproduce" subtitle="Reproduce the Proof" title="Same policy, same facts, same verdict" sectionNum="08">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          VERIFY re-derives each verdict from the frozen policy plus persisted measured facts — it never writes anything. REPLAY reconstructs historical scenarios. A NEW RUN would be fresh execution and is never presented as historical reproduction.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader><RefreshCcw className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">VERIFY</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Frozen policy + persisted facts → same deterministic verdict, re-derived on demand.</p>
              <p className="font-mono text-xs">Workspace → PROVE → REPRODUCE THE PROOF</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Layers className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">REPLAY</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Historical reconstruction of scenario runs: S1, S2, S2 retest, S3.</p>
              <p className="font-mono text-xs">GET /api/control-test/scenario-replay</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><FlaskConical className="h-6 w-6 text-primary" /><CardTitle className="pt-2 text-lg">NEW RUN</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Fresh execution. Never offered as reproduction and not part of the judged evidence set.</p>
              <p className="font-mono text-xs">Not part of historical proof</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead><tr className="bg-card"><th className="p-4">Verification</th><th className="p-4">Target</th><th className="p-4">Expected</th></tr></thead>
            <tbody className="divide-y divide-border">
              <tr><td className="p-4 font-medium">VERIFY C7</td><td className="p-4 font-mono text-xs">fault-1791167110-5e3126</td><td className="p-4 font-mono text-xs">NOT_SATISFIED · 9/10 · NEGOTIATION missing</td></tr>
              <tr><td className="p-4 font-medium">VERIFY C9 RUN 1</td><td className="p-4 font-mono text-xs">fault-1791183079-256a5e</td><td className="p-4 font-mono text-xs">SATISFIED</td></tr>
              <tr><td className="p-4 font-medium">VERIFY C9 RUN 2</td><td className="p-4 font-mono text-xs">fault-1791183213-228329</td><td className="p-4 font-mono text-xs">SATISFIED</td></tr>
              <tr><td className="p-4 font-medium">VERIFY C16 PASS</td><td className="p-4 font-mono text-xs">fault-1791167110-5e3126</td><td className="p-4 font-mono text-xs">SATISFIED · 35,559 / 60,000</td></tr>
              <tr><td className="p-4 font-medium">VERIFY C16 BREACH</td><td className="p-4 font-mono text-xs">fault-1791165466-51ab52</td><td className="p-4 font-mono text-xs">NOT_SATISFIED · 106,829 / 60,000</td></tr>
              <tr><td className="p-4 font-medium">VERIFY ALL</td><td className="p-4 font-mono text-xs">all five persisted results</td><td className="p-4 font-mono text-xs">5 / 5 CANONICAL RESULTS REPRODUCED — never &quot;5/5 passed&quot;</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Every command used in this event — package pull and hash verification, the control-test drill, evidence pull, scenario orchestration, LogSense workbench + MCP, HAIEC VERIFY/REPLAY, and the judge 2-minute path — is consolidated in the <a href="/tm-forum/TMF_TECHNICAL_CLI_RUNBOOK.txt" download className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><Download className="h-4 w-4" /> Technical CLI Runbook</a>.
        </p>
      </Section>

      {/* ===================== LOGSENSE ===================== */}
      <Section id="logsense" subtitle="LogSense" title="What happened vs whether the control held" sectionNum="09">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          LogSense answers <span className="font-semibold text-foreground">what happened</span> — it preserves, normalizes, correlates, and reconstructs runtime evidence. HAIEC answers <span className="font-semibold text-foreground">did the control hold</span> — deterministic evaluation against frozen policy. Keep them distinct.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-lg">Replay a scenario</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <ol className="list-decimal space-y-1 pl-5">
                <li>Sign in with the read-only judge account.</li>
                <li>Open the <ExtLink href={WORKSPACE}>Judge Workspace</ExtLink> → PROVE → REPRODUCE THE PROOF.</li>
                <li>Pick a scenario run: S1 <span className="font-mono text-xs">3348a2</span>, S2 <span className="font-mono text-xs">cb83f9</span>, S2 retest <span className="font-mono text-xs">668d63</span>, S3 <span className="font-mono text-xs">30b2dc</span>.</li>
                <li>REPLAY reconstructs the historical run — it does not re-execute it.</li>
              </ol>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">Forensic reading path</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Start at <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s4`}>report §4</ExtLink> for the reconstruction model, then <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s6`}>§6</ExtLink> for scenario analysis and <ExtLink href={`${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html#s11`}>§11</ExtLink> for findings.</p>
              <p>Deep evidence links are inside the report — telemetry stays in monitoring binders and is referenced, not dumped.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===================== REQUIREMENTS ===================== */}
      <Section id="requirements" subtitle="Requirements & Coverage" title="What was asked vs what was proven" sectionNum="10">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Requirement coverage is stated only where persisted evidence exists. PROVEN means the artifact and its result exist in the frozen package or platform. PARTIAL means real work with a real boundary. NOT_ESTABLISHED means we do not claim it.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead><tr className="bg-card"><th className="p-4">Capability</th><th className="p-4">Status</th><th className="p-4">Where verified</th></tr></thead>
            <tbody className="divide-y divide-border">
              {[
                ["Deterministic control evaluation (C7/C9/C16)", "proven", "PROVEN", "Report J2, VERIFY"],
                ["Frozen/versioned policies with digests", "proven", "PROVEN", "Report J8, DATA.json"],
                ["Same-policy PASS and BREACH (C16)", "proven", "PROVEN", "Report J2"],
                ["Honest failure surfaced (C7 9/10)", "proven", "PROVEN", "Report J3"],
                ["Multiple enforcement surfaces (model + tool)", "proven", "PROVEN", "Report J5/§9"],
                ["Adversarial / negative-path case", "proven", "PROVEN", "Report J4 (C16 breach)"],
                ["Live telemetry + monitoring", "proven", "PROVEN", "Report §9, dashboard"],
                ["Detection / alert pipeline", "proven", "PROVEN", "Synthetic canary, labeled NON-SCORED"],
                ["Scenario replay + failed-retest lineage", "proven", "PROVEN", "REPLAY, report §6"],
                ["Five-plane authority model + DAI frontier", "partial", "PARTIAL", "Report §7/§14 — delegation UNKNOWN"],
                ["ServiceNow AI Control Tower", "partial", "PARTIAL", "Report §13 — boundary shown"],
                ["Security findings + OWASP/ASI context", "partial", "PARTIAL", "Report §11–§12"],
                ["Read-only MCP judge interface", "proven", "PROVEN", "#mcp, endpoint live"],
                ["Portable evidence (HTML/PDF/JSON + package manifest)", "proven", "PROVEN", "#downloads"],
                ["Full canonical Assurance Evaluation + receipt", "unknown", "NOT_ESTABLISHED", "No completed Evaluation; nothing manufactured"],
              ].map(([cap, tone, label, where]) => (
                <tr key={cap}>
                  <td className="p-4 font-medium">{cap}</td>
                  <td className="p-4"><Chip tone={tone as "proven" | "partial" | "unknown"}>{label}</Chip></td>
                  <td className="p-4 text-muted-foreground">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ===================== FINDINGS / DOWNLOADS ===================== */}
      <Section id="findings" subtitle="Honest Frontier" title="What remains open" sectionNum="11">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          UNKNOWN does not mean we did nothing. It means surrounding facts are established but the evidence needed for the stronger conclusion is not present — and HAIEC refuses to infer across that missing proof edge.
        </p>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["DAI delegation", "Capability + permission established.", "Observed negotiation/delegation event.", "More evidence, not inference, would close it."],
            ["ServiceNow native identity", "Integration evidence exists.", "Full native-identity chain.", "Connector depth beyond event scope."],
            ["C9 eligible breach", "Two SATISFIED assessed runs.", "A run that actually breached the frozen policy.", "An intended-breach stimulus that degrades the metric."],
            ["Full Assurance Evaluation", "All Control Tests persisted.", "The canonical evaluations workflow run.", "Deliberately not manufactured for the event."],
            ["Run-start provenance", "Run records and results bound.", "Complete provenance chain at trigger.", "Additional source linkage."],
            ["Human-in-the-loop approval", "Governance records where present.", "Explicit HITL approval binding per action.", "Approval-event evidence."],
          ].map(([t, k, m, c]) => (
            <Card key={t}>
              <CardHeader><HelpCircle className="h-5 w-5 text-sky-500" /><CardTitle className="pt-2 text-base">{t}</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-mono text-xs font-semibold text-foreground">KNOWN — </span>{k}</p>
                <p><span className="font-mono text-xs font-semibold text-foreground">MISSING — </span>{m}</p>
                <p><span className="font-mono text-xs font-semibold text-foreground">CLOSES IT — </span>{c}</p>
                <Chip tone="unknown">UNKNOWN / OPEN</Chip>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="downloads" subtitle="Downloads" title="Take the evidence with you" sectionNum="12">
        <p className="mb-6 max-w-3xl text-sm font-medium uppercase tracking-wider text-muted-foreground">In plain English</p>
        <p className="-mt-8 mb-10 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Everything below is static, self-contained, and opens without a login — the evidence stays readable even if the IDE expires, the AWS environment is torn down, or presigned links die.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Final HTML Report", `${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.html`, "Self-contained; opens offline"],
            ["Final PDF Report", `${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT.pdf`, "Print-identical render"],
            ["Fact Snapshot (JSON)", `${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT_DATA.json`, "All canonical values"],
            ["Report Source (MD)", `${ASSET}/TMF_2026_HAIEC_JUDGE_REPORT_SOURCE.txt`, "Editable narrative"],
            ["Diagram 01 — Proof Flow", `${DIAG}/01_SYSTEM_PROOF_FLOW.svg`, "SVG"],
            ["Diagram 02 — Five Planes", `${DIAG}/02_FIVE_PLANE_ASSURANCE.svg`, "SVG"],
            ["Diagram 03 — Control Results", `${DIAG}/03_CONTROL_RESULTS.svg`, "SVG"],
            ["Diagram 04 — C7 Frontier", `${DIAG}/04_C7_DELEGATION_FRONTIER.svg`, "SVG"],
            ["Diagram 05 — C16 Pass vs Breach", `${DIAG}/05_C16_PASS_VS_BREACH.svg`, "SVG"],
            ["Diagram 06 — Detection vs Control", `${DIAG}/06_DETECTION_VS_CONTROL_TEST.svg`, "SVG"],
            ["Diagram 07 — Scenario Replay", `${DIAG}/07_SCENARIO_REPLAY.svg`, "SVG"],
            ["Diagram 08 — ServiceNow Boundary", `${DIAG}/08_SERVICENOW_BOUNDARY.svg`, "SVG"],
            ["MCP Setup Guide", "/tm-forum/TMF_MCP_SETUP_GUIDE.txt", "No secrets; placeholders only"],
            ["Judge Prompt Pack", "/tm-forum/TMF_JUDGE_PROMPT_PACK.txt", "Copy-paste queries"],
            ["Technical CLI Runbook", "/tm-forum/TMF_TECHNICAL_CLI_RUNBOOK.txt", "Every command — HAIEC primary, LogSense supplement, both options per task"],
            ["Judge-Cut Deck", "/tm-forum/haiec-judge-cut.html", "10-minute slide cut · SUPPLEMENTAL"],
            ["Assurance Deck", "/tm-forum/haiec-agentic-assurance-deck.html", "Full thesis deck · SUPPLEMENTAL"],
            ["Event Field Guide", "/tm-forum/field-guide", "Pre-event operator guide · HISTORICAL"],
          ].map(([t, href, note]) => (
            <a key={t} href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary/40">
              <span>
                {t}
                <span className="block text-xs font-normal text-muted-foreground">{note}</span>
              </span>
              <Download className="h-4 w-4 shrink-0 text-primary" />
            </a>
          ))}
        </div>
        <HubQrCodes />
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          The supplied environment tells us what agents were configured to do and emits evidence of what happened. LogSense reconstructs that evidence. HAIEC determines whether frozen controls actually held — distinguishing permission from delegation and preserving uncertainty instead of guessing. Team narration required for the material control proof: <span className="font-semibold text-foreground">no</span>.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          <FileJson className="mr-1 inline h-3.5 w-3.5" />
          Package <span className="font-mono">7a0bb5f3</span> · <span className="font-mono">submit.sh</span> NOT_EXECUTED · The judge report is a supplemental evidence report, not a canonical Master Assurance Report. · <Network className="mx-1 inline h-3.5 w-3.5" /> LogSense = what happened · HAIEC = did the control hold · <AlertCircle className="mx-1 inline h-3.5 w-3.5" /> UNKNOWN ≠ PASS.
        </p>
      </Section>
    </>
  );
}
