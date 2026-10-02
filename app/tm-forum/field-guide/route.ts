import { readFileSync } from "node:fs";
import path from "node:path";
import { gunzipSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-static";

const PARTS = ["part-1.txt", "part-2.txt", "part-3.txt", "part-4.txt"] as const;

function readFieldGuide(): string {
  const dataDir = path.join(
    process.cwd(),
    "public",
    "tm-forum",
    "data",
    "team-field-guide",
  );

  const encoded = PARTS.map((part) =>
    readFileSync(path.join(dataDir, part), "utf8"),
  )
    .join("")
    .replace(/\s+/g, "");

  const html = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");

  if (
    html.length < 90000 ||
    !html.includes("Trustworthy AI &amp; Data Hackathon") ||
    !html.includes("The Operating Manual")
  ) {
    throw new Error("TM Forum Field Guide source failed integrity validation.");
  }

  return html;
}

export function GET() {
  return new Response(readFieldGuide(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
