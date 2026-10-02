"use client";

import { useEffect, useState } from "react";
import { ungzip } from "pako";

const PARTS = [
  "/tm-forum/data/team-field-guide/part-1.txt",
  "/tm-forum/data/team-field-guide/part-2.txt",
  "/tm-forum/data/team-field-guide/part-3.txt",
  "/tm-forum/data/team-field-guide/part-4.txt",
] as const;

const REQUIRED_SECTIONS = [
  "six", "glance", "mission", "controls", "worked", "allowed", "tools",
  "haiec", "architecture", "judging", "deliverables", "schedule",
  "logistics", "focus", "validation",
] as const;

const DRIVE_URL = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";

function decodeBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function alignToSite(html: string) {
  const replacements: Array<[string, string]> = [
    ["--bg:#0a0a12;", "--bg:#2b2e33;"],
    ["--surface:#13111f;", "--surface:#34373d;"],
    ["--surface-2:#1a1730;", "--surface-2:#3a3d43;"],
    ["--border:rgba(167,139,250,.15);", "--border:rgba(235,230,216,.11);"],
    ["--border-strong:rgba(167,139,250,.32);", "--border-strong:rgba(22,208,136,.32);"],
    ["--text:#ece9f7;", "--text:#ebe6d8;"],
    ["--muted:#a29ec0;", "--muted:#b8b3a7;"],
    ["--dim:#6b6788;", "--dim:#858178;"],
    ["--violet:#a78bfa;", "--violet:#16d088;"],
    ["--violet-deep:#7c3aed;", "--violet-deep:#0fa66e;"],
    ["--pink:#f472b6;", "--pink:#d6b56f;"],
    ["--cyan:#22d3ee;", "--cyan:#67c8d8;"],
    ["--green:#34d399;", "--green:#16d088;"],
  ];

  let themed = replacements.reduce((current, [from, to]) => current.replace(from, to), html);

  const utilityCss = `
<style id="subodhkc-team-links">
.team-utility{position:sticky;top:60px;z-index:49;background:rgba(43,46,51,.96);border-bottom:1px solid #404349;backdrop-filter:blur(12px)}
.team-utility .team-utility-inner{max-width:1180px;margin:0 auto;padding:9px 24px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.team-utility a{font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;letter-spacing:.03em;text-decoration:none;color:#ebe6d8;border:1px solid #404349;border-radius:7px;padding:7px 10px;background:#34373d}
.team-utility a.primary{color:#16d088;border-color:#16d088}
@media(max-width:760px){.team-utility{top:60px}.team-utility .team-utility-inner{padding:8px 16px}}
</style>`;

  const utilityBar = `<div class="team-utility"><div class="team-utility-inner"><a class="primary" href="/tm-forum-challenge">TEAM HUB</a><a href="/tm-forum/team-environment-integration-intake.html">FULL INTAKE</a><a href="/tm-forum/assurance-report-template.html">REPORT TEMPLATE</a><a href="${DRIVE_URL}" target="_blank" rel="noreferrer">GOOGLE DRIVE ↗</a></div></div>`;

  themed = themed.replace("</head>", `${utilityCss}</head>`);
  themed = themed.replace("</header>", `</header>${utilityBar}`);
  return themed;
}

export default function FieldGuidePage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const responses = await Promise.all(PARTS.map((path) => fetch(path, { cache: "no-store" })));
        const failed = responses.findIndex((response) => !response.ok);
        if (failed !== -1) throw new Error(`Source part ${failed + 1} returned ${responses[failed].status}.`);

        const encoded = (await Promise.all(responses.map((response) => response.text())))
          .join("")
          .replace(/\s+/g, "");
        const decoded = ungzip(decodeBase64(encoded), { to: "string" });
        if (typeof decoded !== "string") throw new Error("Bundled decompressor returned an unexpected payload.");

        const complete =
          decoded.length > 90000 &&
          decoded.includes("Event Field Guide v4.0") &&
          decoded.includes("The Operating Manual") &&
          decoded.trimEnd().endsWith("</html>") &&
          REQUIRED_SECTIONS.every((id) => decoded.includes(`id="${id}"`));

        if (!complete) throw new Error("Field Guide integrity check failed; source is incomplete.");
        if (cancelled) return;

        const html = alignToSite(decoded);
        document.open();
        document.write(html);
        document.close();
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Unknown loading error.");
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#2b2e33", color: "#ebe6d8", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "min(760px, 100%)", background: "#34373d", border: `1px solid ${error ? "#a65c5c" : "#404349"}`, borderRadius: 14, padding: 28, fontFamily: "system-ui, sans-serif" }}>
        <strong style={{ color: error ? "#f3b3b3" : "#16d088" }}>{error ? "Field Guide failed to load." : "Loading complete TM Forum Field Guide…"}</strong>
        {error ? <p style={{ color: "#d5d0c4", lineHeight: 1.6 }}>{error}</p> : <p style={{ color: "#b8b3a7" }}>Using the locally bundled decoder. No external CDN is required.</p>}
        {error && <p><a href="/tm-forum-challenge" style={{ color: "#16d088" }}>Return to Team Hub</a> · <a href={DRIVE_URL} style={{ color: "#16d088" }}>Open Drive</a></p>}
      </div>
    </main>
  );
}
