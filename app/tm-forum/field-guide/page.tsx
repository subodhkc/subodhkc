import type { Metadata } from "next";
import Link from "next/link";
import { gunzipSync } from "node:zlib";
import { FIELD_GUIDE_SOURCE_PARTS } from "../team-field-guide.html/source";
import { CANONICAL_FIELD_GUIDE_PART_1 } from "./canonical-part-1";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "TM Forum Hackathon | Field Guide v4.0",
  description: "Complete TM Forum Trustworthy AI & Data Hackathon team field guide rendered in the site UI.",
  robots: { index: false, follow: false },
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
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
        <a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>Full Intake</a>
        <a href="/tm-forum/assurance-report-template.html" target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>Report Template</a>
        <a href={DRIVE_URL} target="_blank" rel="noreferrer" style={{ marginLeft: "auto", color: "#16d088", textDecoration: "none", border: "1px solid rgba(22,208,136,.35)", borderRadius: 8, padding: "5px 9px", fontWeight: 700 }}>Shared Drive ↗</a>
      </div>
    </div>
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
          <p style={{ color: "#bbb5a9" }}>This page is intentionally returning the decode failure instead of throwing a Next.js server exception.</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "#34373d", padding: 16, borderRadius: 10, overflowX: "auto" }}>{JSON.stringify(guide.diagnostics, null, 2)}</pre>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#2b2e33", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: guide.css }} />
      <TopBar />
      <div className="tmf-guide-ui" dangerouslySetInnerHTML={{ __html: guide.body }} />
    </main>
  );
}
