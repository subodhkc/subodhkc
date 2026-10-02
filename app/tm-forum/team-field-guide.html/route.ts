import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SOURCE_DIR = join(
  process.cwd(),
  "public",
  "tm-forum",
  "data",
  "team-field-guide-v4-original",
);

const PARTS = [
  "part-1.txt",
  "part-2.txt",
  "part-3.txt",
  "part-4.txt",
  "part-5.txt",
  "part-6.txt",
  "part-7.txt",
  "part-8.txt",
] as const;

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

function getFieldGuideHtml(): string {
  const encoded = PARTS.map((part) =>
    readFileSync(join(SOURCE_DIR, part), "utf8"),
  )
    .join("")
    .replace(/\s+/g, "");

  const source = gunzipSync(Buffer.from(encoded, "base64"));
  const digest = createHash("sha256").update(source).digest("hex");
  const html = source.toString("utf8");

  if (source.byteLength !== EXPECTED_BYTES) {
    throw new Error(`TM Forum Field Guide byte length mismatch: ${source.byteLength}`);
  }
  if (digest !== EXPECTED_SHA256) {
    throw new Error(`TM Forum Field Guide SHA-256 mismatch: ${digest}`);
  }
  if (!html.includes("Event Field Guide v4.0") || !html.includes("The Operating Manual")) {
    throw new Error("TM Forum Field Guide title markers missing");
  }
  if (!html.trimEnd().endsWith("</html>")) {
    throw new Error("TM Forum Field Guide closing HTML missing");
  }
  for (const id of REQUIRED_SECTIONS) {
    if (!html.includes(`id="${id}"`)) {
      throw new Error(`TM Forum Field Guide section missing: ${id}`);
    }
  }

  return html;
}

export function GET() {
  try {
    return new Response(getFieldGuideHtml(), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, max-age=0",
        "X-TM-Forum-Field-Guide": "direct-server-v4-original",
      },
    });
  } catch (error) {
    console.error("TM Forum Field Guide render failed", error);
    return new Response(
      "TM Forum Field Guide could not be rendered from its verified source.",
      {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}
