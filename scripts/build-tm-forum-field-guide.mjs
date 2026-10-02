import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";

const root = process.cwd();
const sourceDir = join(root, "public", "tm-forum", "data", "team-field-guide-v4-original");
const target = join(root, "public", "tm-forum", "team-field-guide.html");
const expectedSha256 = "32b208441fcf76157a64418154aa4a67ac458836343dafac40eb41d14f36e8ce";
const requiredSections = [
  "six", "glance", "mission", "controls", "worked", "allowed", "tools", "haiec",
  "architecture", "judging", "deliverables", "schedule", "logistics", "focus", "validation", "appendix",
];

const encoded = Array.from({ length: 8 }, (_, i) =>
  readFileSync(join(sourceDir, `part-${i + 1}.txt`), "utf8")
).join("").replace(/\s+/g, "");

const source = gunzipSync(Buffer.from(encoded, "base64"));
const digest = createHash("sha256").update(source).digest("hex");
const html = source.toString("utf8");

if (source.length !== 97821) throw new Error(`TM Forum Field Guide byte length mismatch: ${source.length}`);
if (digest !== expectedSha256) throw new Error(`TM Forum Field Guide SHA-256 mismatch: ${digest}`);
if (!html.includes("Event Field Guide v4.0") || !html.includes("The Operating Manual")) {
  throw new Error("TM Forum Field Guide title markers missing");
}
if (!html.trimEnd().endsWith("</html>")) throw new Error("TM Forum Field Guide closing HTML missing");
for (const id of requiredSections) {
  if (!html.includes(`id="${id}"`)) throw new Error(`TM Forum Field Guide section missing: ${id}`);
}

const replacements = [
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

let output = replacements.reduce((current, [from, to]) => current.replace(from, to), html);
const drive = "https://drive.google.com/drive/folders/1gGaVOgdVzjtY6DIIRPjIWD_zr0VjDgDR?usp=sharing";
const utilityCss = `<style id="subodhkc-team-links">.team-utility{position:sticky;top:60px;z-index:49;background:rgba(43,46,51,.96);border-bottom:1px solid #404349;backdrop-filter:blur(12px)}.team-utility-inner{max-width:1180px;margin:0 auto;padding:9px 24px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}.team-utility a{font:700 11px/1.2 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;text-decoration:none;color:#ebe6d8;border:1px solid #404349;border-radius:7px;padding:7px 10px;background:#34373d}.team-utility a.primary{color:#16d088;border-color:#16d088}@media(max-width:760px){.team-utility-inner{padding:8px 16px}}</style>`;
const utilityBar = `<div class="team-utility"><div class="team-utility-inner"><a class="primary" href="/tm-forum-challenge">TEAM HUB</a><a href="/tm-forum/team-environment-integration-intake.html">FULL INTAKE</a><a href="/tm-forum/assurance-report-template.html">REPORT TEMPLATE</a><a href="${drive}" target="_blank" rel="noreferrer">GOOGLE DRIVE ↗</a></div></div>`;

output = output
  .replace("</head>", `${utilityCss}</head>`)
  .replace("</header>", `</header>${utilityBar}`)
  .replace(
    '<html lang="en">',
    '<html lang="en"><!-- generated at build time from the exact attached Field Guide v4.0 source; no browser reconstruction required -->'
  );

writeFileSync(target, output, "utf8");
console.log(`TM Forum Field Guide generated as plain static HTML: ${target} (${Buffer.byteLength(output)} bytes)`);
