// components/hero/ConstellationBackground.tsx
// Subtle constellation of product/release nodes as a hero background.
// Desktop: interactive (hover labels, click to navigate via Next router).
// Mobile: purely decorative (no interaction, reduced opacity).
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Glyph } from "@/components/Glyph";
import { PRODUCTS, type Product } from "@/data/products";

// Curated node layout — positions avoid the hero text area (left-center).
// Nodes cluster toward the right side and edges, leaving the H1/tagline zone clear.
// Radii are kept very small (5-8) so nodes remain subtle at all viewport sizes.
const NODES = [
  { x: 930, y: 40,  r: 6, d: 0 },
  { x: 870, y: 90,  r: 7, d: 0.4 },
  { x: 960, y: 160, r: 6, d: 0.8 },
  { x: 800, y: 50,  r: 6, d: 1.2 },
  { x: 740, y: 140, r: 7, d: 1.6 },
  { x: 680, y: 80,  r: 6, d: 2.0 },
  { x: 640, y: 190, r: 6, d: 2.4 },
  { x: 580, y: 130, r: 7, d: 2.8 },
  { x: 520, y: 60,  r: 6, d: 3.2 },
  { x: 470, y: 170, r: 6, d: 3.6 },
  { x: 410, y: 100, r: 6, d: 4.0 },
  { x: 360, y: 210, r: 6, d: 4.4 },
  { x: 300, y: 70,  r: 6, d: 4.8 },
  { x: 250, y: 160, r: 7, d: 5.2 },
  { x: 190, y: 110, r: 6, d: 5.6 },
];

const EDGES: Array<[number, number, number]> = [
  [0, 1, 0],
  [0, 2, 0.6],
  [1, 3, 1.2],
  [1, 4, 1.8],
  [2, 4, 0.3],
  [3, 5, 0.9],
  [4, 6, 1.5],
  [5, 7, 2.1],
  [6, 7, 2.7],
  [5, 8, 0.4],
  [7, 9, 1.0],
  [8, 10, 1.6],
  [9, 11, 2.2],
  [10, 12, 0.5],
  [11, 13, 1.1],
  [12, 14, 0.7],
  [13, 14, 1.3],
];

export function ConstellationBackground() {
  const router = useRouter();
  const items = PRODUCTS.slice(0, NODES.length);

  const handleClick = React.useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as Element;
    const hit = target.closest(".constellation-bg-hit") as Element | null;
    if (!hit) return;
    const href = hit.getAttribute("data-href");
    if (href) {
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener noreferrer");
      } else {
        router.push(href);
      }
    }
  }, [router]);

  return (
    <div
      aria-hidden
      className="constellation-bg"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <svg
        className="constellation-bg-svg"
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid slice"
        onClick={handleClick}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          opacity: 0.22,
        }}
      >
        {/* Edges — static base line + subtle flowing dash */}
        {EDGES.map(([a, b, d], i) => {
          if (a >= NODES.length || b >= NODES.length) return null;
          const A = NODES[a];
          const B = NODES[b];
          return (
            <g key={`edge-${i}`}>
              <line
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="var(--op-border)"
                strokeWidth="0.8"
                opacity="0.5"
              />
              <line
                x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke="var(--op-accent)"
                strokeWidth="1"
                strokeDasharray="4 90"
                style={{ animation: `flow 12s linear ${d}s infinite`, opacity: 0.3 }}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {items.map((p: Product, i: number) => {
          const N = NODES[i];
          if (!N) return null;
          // Compute label width based on product name length
          const labelWidth = Math.max(80, p.name.length * 7 + 16);
          return (
            <g
              key={p.id}
              className="constellation-bg-node"
              transform={`translate(${N.x} ${N.y})`}
            >
              {/* Float animation wrapper */}
              <g className="constellation-bg-float" style={{
                animation: `node-float 7s ease-in-out ${N.d}s infinite`,
                transformOrigin: "center",
                transformBox: "fill-box",
              }}>
                {/* Outer ring — very subtle */}
                <circle r={N.r + 3} fill="none" stroke="var(--op-accent)" strokeWidth="0.4" opacity="0.12" />
                {/* Node body */}
                <circle r={N.r} fill="var(--op-card)" stroke="var(--op-border)" strokeWidth="0.6" opacity="0.65" />
                {/* Glyph icon */}
                <g transform={`translate(-${N.r * 0.5} -${N.r * 0.5})`} style={{ color: "var(--op-accent)", opacity: 0.45 }}>
                  <Glyph kind={p.glyph} size={N.r} />
                </g>
              </g>
              {/* Hover label — CSS controls visibility via class, not inline style */}
              <g className="constellation-bg-label" pointerEvents="none">
                <rect
                  x={-labelWidth / 2}
                  y={N.r + 4}
                  width={labelWidth}
                  height="14"
                  rx="2"
                  fill="var(--op-card)"
                  stroke="var(--op-border)"
                  strokeWidth="0.5"
                  opacity="0.95"
                />
                <text
                  x={0}
                  y={N.r + 14}
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="var(--font-mono)"
                  fill="var(--fg)"
                >
                  {p.name}
                </text>
              </g>
              {/* Invisible hit area for hover + click — desktop only via CSS */}
              <circle
                className="constellation-bg-hit"
                r={N.r + 6}
                fill="transparent"
                style={{ pointerEvents: "auto", cursor: "pointer" }}
                data-href={p.primary.href}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
