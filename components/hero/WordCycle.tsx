// components/hero/WordCycle.tsx
"use client";

import * as React from "react";

interface Props {
  words: string[];
  intervalMs?: number;
}

export function WordCycle({ words, intervalMs = 2800 }: Props) {
  const [i, setI] = React.useState(0);
  const [phase, setPhase] = React.useState<"in" | "out">("in");

  React.useEffect(() => {
    const out = window.setTimeout(() => setPhase("out"), intervalMs - 320);
    const next = window.setTimeout(() => {
      setI((v) => (v + 1) % words.length);
      setPhase("in");
    }, intervalMs);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(next);
    };
  }, [i, words.length, intervalMs]);

  const longest = React.useMemo(
    () => words.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [words]
  );

  return (
    <span
      aria-live="polite"
      style={{
        display: "inline-grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "1fr",
        verticalAlign: "baseline",
        position: "relative",
        color: "var(--accent)",
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontWeight: 400,
        minWidth: `${longest.length * 0.54}em`,
      }}
    >
      <span style={{ visibility: "hidden", gridArea: "1 / 1", whiteSpace: "nowrap" }}>
        {longest}
      </span>
      <span
        key={i}
        style={{
          gridArea: "1 / 1",
          whiteSpace: "nowrap",
          opacity: phase === "in" ? 1 : 0,
          transform: phase === "in" ? "translateY(0)" : "translateY(-0.18em)",
          filter: phase === "in" ? "blur(0)" : "blur(4px)",
          transition:
            "opacity .32s cubic-bezier(.2,.7,.2,1), transform .32s cubic-bezier(.2,.7,.2,1), filter .32s",
          textDecoration: "underline",
          textDecorationThickness: "1px",
          textUnderlineOffset: "0.18em",
          textDecorationColor: "color-mix(in oklab, currentColor 30%, transparent)",
        }}
      >
        {words[i]}
      </span>
      <span
        style={{
          position: "absolute",
          right: "-0.18em",
          top: "0.08em",
          bottom: "0.18em",
          width: 2,
          background: "currentColor",
          opacity: 0.7,
          animation: "hero-blink 1s steps(2) infinite",
        }}
      />
    </span>
  );
}
