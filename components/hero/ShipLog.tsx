// components/hero/ShipLog.tsx — scrolling release feed
"use client";

import * as React from "react";
import { SHIP_LOG } from "@/data/ship-log";

export function ShipLog() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const marquee = marqueeRef.current;
    if (!container || !marquee) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      marquee.style.animationPlayState = 'paused';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          marquee.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
        });
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const items = [...SHIP_LOG, ...SHIP_LOG];
  return (
    <div
      ref={containerRef}
      style={{
        borderTop: "1px solid var(--op-border)",
        borderBottom: "1px solid var(--op-border)",
        background: "color-mix(in oklab, var(--op-card) 70%, transparent)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 110,
          background: "linear-gradient(90deg, var(--bg) 35%, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 110,
          background: "linear-gradient(-90deg, var(--bg) 35%, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 3,
          padding: "0 22px",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--op-accent)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--op-accent)",
            animation: "hero-pulse 1.6s ease-in-out infinite",
          }}
        />
        /ship.log
      </div>

      <div
        ref={marqueeRef}
        style={{
          display: "flex",
          gap: 0,
          animation: "marquee 55s linear infinite",
          padding: "12px 0 12px 180px",
          width: "max-content",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--text-secondary)",
        }}
      >
        {items.map((it, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              paddingRight: 40,
            }}
          >
            <span style={{ color: "var(--fg)" }}>{it.ver}</span>
            <span style={{ opacity: 0.6 }}>{it.note}</span>
            <span
              style={{
                fontSize: 10,
                padding: "1px 6px",
                border: "1px solid var(--op-border)",
                borderRadius: 999,
                opacity: 0.8,
              }}
            >
              {it.when}
            </span>
            <span style={{ opacity: 0.35 }}>▸</span>
          </span>
        ))}
      </div>
    </div>
  );
}
