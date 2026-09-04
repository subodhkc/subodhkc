import { createHmac, timingSafeEqual } from "node:crypto";

export const HEB_ACCESS_COOKIE = "heb_chamber_access";

function configuredPassword() {
  return process.env.HEB_CHAMBER_PASSWORD || "hebchamber2026";
}

function signingSecret() {
  return process.env.HEB_CHAMBER_GATE_SECRET || configuredPassword();
}

export function verifyHebPassword(candidate: string) {
  const expected = Buffer.from(configuredPassword());
  const actual = Buffer.from(candidate.trim());
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function hebAccessToken() {
  return createHmac("sha256", signingSecret()).update("subodhkc:heb-chamber:v1").digest("hex");
}

export function verifyHebAccessToken(candidate: string | undefined) {
  if (!candidate) return false;
  const expected = Buffer.from(hebAccessToken());
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
