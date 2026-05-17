// components/hero/DotGrid.tsx
import * as React from "react";

export function DotGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(color-mix(in oklab, var(--fg) 18%, transparent) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        opacity: 0.45,
        pointerEvents: "none",
      }}
    />
  );
}
