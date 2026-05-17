// components/Glyph.tsx
// Original geometric product marks — strict primitives composed into per-product
// identities. Stroke = currentColor so glyphs adopt theme.

import * as React from "react";

export type GlyphKind =
  | "shield"
  | "waves"
  | "frames"
  | "brackets"
  | "brackets-py"
  | "timeline"
  | "redact"
  | "scales"
  | "bars"
  | "stack"
  | "ring-split"
  | "octagon"
  | "radar"
  | "frame-anchor"
  | "nucleus";

export interface GlyphProps {
  kind: GlyphKind;
  size?: number;
  style?: "outline" | "filled";
  color?: string;
}

export function Glyph({ kind, size = 28, style = "outline", color }: GlyphProps) {
  const filled = style === "filled";
  const stroke = color || "currentColor";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 28 28",
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (kind) {
    case "shield":
      return (
        <svg {...common}>
          <path d="M14 3 L25 14 L14 25 L3 14 Z" fill={filled ? stroke : "none"} opacity={filled ? 0.08 : 1} />
          <path d="M14 3 L25 14 L14 25 L3 14 Z" />
          <path d="M14 8 L20 14 L14 20 L8 14 Z" />
        </svg>
      );
    case "waves":
      return (
        <svg {...common}>
          <line x1="5" y1="11" x2="5" y2="17" />
          <line x1="9" y1="8" x2="9" y2="20" />
          <line x1="14" y1="4" x2="14" y2="24" />
          <line x1="19" y1="8" x2="19" y2="20" />
          <line x1="23" y1="11" x2="23" y2="17" />
        </svg>
      );
    case "frames":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="22" height="22" rx="0.5" />
          <rect x="8" y="8" width="12" height="12" rx="0.5" />
          <rect x="12" y="12" width="4" height="4" rx="0.5" fill={stroke} />
        </svg>
      );
    case "brackets":
      return (
        <svg {...common}>
          <path d="M9 5 L4 5 L4 23 L9 23" />
          <path d="M19 5 L24 5 L24 23 L19 23" />
          <circle cx="14" cy="14" r="1.6" fill={stroke} stroke="none" />
        </svg>
      );
    case "brackets-py":
      return (
        <svg {...common}>
          <path d="M10 6 L4 14 L10 22" />
          <path d="M18 6 L24 14 L18 22" />
          <circle cx="14" cy="14" r="1.6" fill={stroke} stroke="none" />
        </svg>
      );
    case "timeline":
      return (
        <svg {...common}>
          <line x1="4" y1="14" x2="24" y2="14" />
          <circle cx="6" cy="14" r="2" fill={stroke} stroke="none" />
          <circle cx="14" cy="14" r="2" fill={stroke} stroke="none" />
          <circle cx="22" cy="14" r="2" fill={stroke} stroke="none" />
        </svg>
      );
    case "redact":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="22" height="22" rx="0.5" />
          <rect x="3" y="3" width="11" height="11" fill={stroke} stroke="none" />
          <line x1="14" y1="14" x2="25" y2="14" />
          <line x1="14" y1="14" x2="14" y2="25" />
        </svg>
      );
    case "scales":
      return (
        <svg {...common}>
          <line x1="14" y1="4" x2="14" y2="24" />
          <line x1="4" y1="24" x2="24" y2="24" />
          <path d="M7 18 L4 12 L10 12 Z" />
          <path d="M21 18 L18 12 L24 12 Z" />
        </svg>
      );
    case "bars":
      return (
        <svg {...common}>
          <line x1="4" y1="24" x2="24" y2="24" />
          <rect x="5" y="18" width="3" height="6" fill={stroke} stroke="none" />
          <rect x="10" y="12" width="3" height="12" fill={stroke} stroke="none" />
          <rect x="15" y="15" width="3" height="9" fill={stroke} stroke="none" />
          <rect x="20" y="8" width="3" height="16" fill={stroke} stroke="none" />
        </svg>
      );
    case "stack":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="4" rx="0.5" />
          <rect x="5" y="12" width="18" height="4" rx="0.5" />
          <rect x="7" y="18" width="18" height="4" rx="0.5" />
        </svg>
      );
    case "ring-split":
      return (
        <svg {...common}>
          <path d="M22 9 A10 10 0 1 1 6 19" />
          <circle cx="14" cy="14" r="2" fill={stroke} stroke="none" />
        </svg>
      );
    case "octagon":
      return (
        <svg {...common}>
          <path d="M9 3 L19 3 L25 9 L25 19 L19 25 L9 25 L3 19 L3 9 Z" />
          <circle cx="14" cy="14" r="2.5" fill={stroke} stroke="none" />
        </svg>
      );
    case "radar":
      return (
        <svg {...common}>
          <circle cx="14" cy="14" r="10" />
          <circle cx="14" cy="14" r="6" opacity="0.6" />
          <circle cx="14" cy="14" r="2.4" fill={stroke} stroke="none" />
          <line x1="14" y1="14" x2="22" y2="6" />
        </svg>
      );
    case "frame-anchor":
      return (
        <svg {...common}>
          <path d="M14 5 L24 22 L4 22 Z" />
          <line x1="9" y1="22" x2="19" y2="22" strokeWidth="2.6" />
          <circle cx="14" cy="14" r="1.6" fill={stroke} stroke="none" />
        </svg>
      );
    case "nucleus":
      return (
        <svg {...common}>
          <ellipse cx="14" cy="14" rx="10" ry="4" transform="rotate(35 14 14)" />
          <ellipse cx="14" cy="14" rx="10" ry="4" transform="rotate(-35 14 14)" />
          <circle cx="14" cy="14" r="2" fill={stroke} stroke="none" />
        </svg>
      );
  }
}
