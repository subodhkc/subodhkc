import type { Metadata } from "next";
import Link from "next/link";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { FIELD_GUIDE_SOURCE_BASE64 } from "../team-field-guide.html/source";
import { GuideRenderer } from "./GuideRenderer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "TM Forum Hackathon | Field Guide v4.0",
  description: "Complete TM Forum Trustworthy AI & Data Hackathon team field guide rendered in the site UI.",
  robots: { index: false, follow: false },
};

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
const EXPECTED_BYTES = 97_821;
const EXPECTED_SHA256 = "32b208441fcf76157a64418154aa4a67ac458836343dafac40eb41d14f36e8ce";
const REQUIRED_SECTIONS = [
  "six",
  "glance",
  "mission",
  "controls",
  "worked",
  "allowed",
  "tools",
  "haiec",
  "architecture",
  "judging",
  "deliverables",
  "schedule",
  "logistics",
  "focus",
  "validation",
  "appendix",
] as const;

function loadFieldGuide() {
  const source = gunzipSync(Buffer.from(FIELD_GUIDE_SOURCE_BASE64, "base64"));
  const digest = createHash("sha256").update(source).digest("hex");
  const document = source.toString("utf8");

  if (source.byteLength !== EXPECTED_BYTES || digest !== EXPECTED_SHA256) {
    throw new Error("TM Forum Field Guide source integrity check failed.");
  }

  for (const id of REQUIRED_SECTIONS) {
    if (!document.includes(`id=\"${id}\"`)) {
      throw new Error(`TM Forum Field Guide section missing: ${id}`);
    }
  }

  const css = Array.from(document.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1])
    .join("\n")
    .replace(/:root\s*\{/g, ":host{")
    .replace(/body::before\s*\{/g, ".tmf-guide-body::before{")
    .replace(/body\s*\{/g, ".tmf-guide-body{")
    .replace(/html\s*\{/g, ":host{");

  const bodyMatch = document.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) throw new Error("TM Forum Field Guide body is missing.");

  const body = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "");

  const theme = `
    :host{
      display:block;
      --bg:#2b2e33;
      --surface:#34373d;
      --surface-2:#3b3e44;
      --border:rgba(235,230,216,.12);
      --border-strong:rgba(22,208,136,.32);
      --text:#ebe6d8;
      --muted:#bbb5a9;
      --dim:#8f8a81;
      --violet:#16d088;
      --violet-deep:#0fa56d;
      --pink:#7de0b8;
      --cyan:#6fd7c3;
      --green:#16d088;
      --amber:#e6bd66;
      --red:#ef8c83;
      background:var(--bg);
      color:var(--text);
    }
    .tmf-guide-body{min-height:100vh;background:var(--bg);color:var(--text);position:relative;isolation:isolate}
    .topbar{position:relative!important;top:auto!important}
    .brand .dot{background:linear-gradient(135deg,#16d088,#7de0b8);box-shadow:0 0 14px rgba(22,208,136,.5)}
    h1{background:linear-gradient(120deg,#fff 8%,#ebe6d8 45%,#8ee8c4 88%);-webkit-background-clip:text;background-clip:text;color:transparent}
  `;

  return { body, css: `${css}\n${theme}` };
}

export default function TmForumFieldGuidePage() {
  const guide = loadFieldGuide();

  return (
    <main style={{ background: "#2b2e33", minHeight: "100vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid rgba(235,230,216,.12)",
          background: "rgba(43,46,51,.96)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            fontSize: 13,
          }}
        >
          <Link href="/tm-forum-challenge" style={{ color: "#16d088", fontWeight: 800, textDecoration: "none" }}>
            TM Forum Team Hub
          </Link>
          <span style={{ color: "#77736b" }}>·</span>
          <a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>
            Full Intake
          </a>
          <a href="/tm-forum/assurance-report-template.html" target="_blank" rel="noreferrer" style={{ color: "#ebe6d8", textDecoration: "none" }}>
            Report Template
          </a>
          <a
            href={DRIVE_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              marginLeft: "auto",
              color: "#16d088",
              textDecoration: "none",
              border: "1px solid rgba(22,208,136,.35)",
              borderRadius: 8,
              padding: "5px 9px",
              fontWeight: 700,
            }}
          >
            Shared Drive ↗
          </a>
        </div>
      </div>

      <GuideRenderer html={guide.body} css={guide.css} />
    </main>
  );
}
