// data/ship-log.ts — recent shipments marquee
export interface ShipEntry {
  ver: string;
  note: string;
  when: string;
}

export const SHIP_LOG: ShipEntry[] = [
  { ver: "llmverify v0.4.2", note: "drift detector for tools/", when: "4h" },
  { ver: "haiec-action v1.3.0", note: "EU AI Act rules pack", when: "1d" },
  { ver: "kestrelvoice", note: "after-hours scheduling GA", when: "2d" },
  { ver: "doc-timeline", note: "cross-doc dedupe v2", when: "4d" },
  { ver: "shadow-ai v0.2.0", note: "first OSS release", when: "1w" },
  { ver: "haiec-osint mvp", note: "public OSINT scoring", when: "2w" },
  { ver: "csm6 framework", note: "whitepaper update", when: "2w" },
  { ver: "frontofai", note: "weekday briefing v3", when: "3w" },
];
