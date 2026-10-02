import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { FIELD_GUIDE_SOURCE_BASE64 } from "./source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const source = gunzipSync(Buffer.from(FIELD_GUIDE_SOURCE_BASE64, "base64"));
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
        "X-TM-Forum-Field-Guide": "bundled-server-v4-original",
      },
    });
  } catch (error) {
    console.error("TM Forum Field Guide render failed", error);
    return new Response(
      "TM Forum Field Guide could not be rendered from its bundled verified source.",
      {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }
}
