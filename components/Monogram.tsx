// components/Monogram.tsx
import * as React from "react";

export function Monogram({ size = 22, color }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth={1.6}
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 2 L26 14 L14 26 L2 14 Z" />
      <path d="M14 9 L19 14 L14 19 L9 14 Z" fill={color || "currentColor"} />
    </svg>
  );
}
