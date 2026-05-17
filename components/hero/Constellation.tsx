// components/hero/Constellation.tsx
"use client";

import * as React from "react";
import { Glyph } from "@/components/Glyph";
import type { Product } from "@/data/products";

interface Props {
  products: Product[];
}

const NODES = [
  { x: 80,  y: 200, r: 22, d: 0 },
  { x: 175, y: 100, r: 26, d: 0.4 },
  { x: 260, y: 220, r: 22, d: 0.8 },
  { x: 350, y: 60,  r: 22, d: 1.2 },
  { x: 420, y: 175, r: 28, d: 1.6 },
  { x: 500, y: 280, r: 22, d: 2.0 },
  { x: 555, y: 110, r: 22, d: 2.4 },
  { x: 620, y: 220, r: 26, d: 2.8 },
  { x: 700, y: 140, r: 22, d: 3.2 },
  { x: 760, y: 250, r: 22, d: 3.6 },
  { x: 830, y: 80,  r: 22, d: 4.0 },
  { x: 875, y: 195, r: 22, d: 4.4 },
  { x: 940, y: 280, r: 22, d: 4.8 },
  { x: 955, y: 130, r: 22, d: 5.2 },
  { x: 240, y: 50,  r: 22, d: 5.6 },
];

const EDGES: Array<[number, number, number]> = [
  [0, 1, 0],
  [0, 2, 0.6],
  [1, 2, 1.2],
  [1, 3, 1.8],
  [1, 14, 0.3],
  [3, 4, 0.9],
  [2, 5, 1.5],
  [4, 5, 2.1],
  [4, 6, 2.7],
  [5, 7, 0.4],
  [6, 7, 1.0],
  [6, 8, 1.6],
  [7, 9, 2.2],
  [8, 10, 0.5],
  [8, 11, 1.1],
  [9, 11, 1.7],
  [9, 12, 2.3],
  [10, 13, 0.7],
  [11, 12, 1.3],
  [11, 13, 1.9],
  [12, 13, 0.2],
];

export function Constellation({ products }: Props) {
  const items = products.slice(0, NODES.length);

  const scrollToProduct = React.useCallback((id: string) => {
    const el = document.getElementById(`product-${id}`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top - 100, behavior: "smooth" });
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1000 / 320",
        minHeight: 220,
        maxHeight: 360,
      }}
    >
      <svg
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
      >
        {EDGES.map(([a, b, d], i) => {
          if (a >= NODES.length || b >= NODES.length) return null;
          const A = NODES[a];
          const B = NODES[b];
          return (
            <g key={i}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--border)" strokeWidth="1" opacity="0.7" />
              <line
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="var(--accent)"
                strokeWidth="1.2"
                strokeDasharray="6 80"
                style={{ animation: `flow 9s linear ${d}s infinite`, opacity: 0.55 }}
              />
            </g>
          );
        })}

        {items.map((p, i) => {
          const N = NODES[i];
          if (!N) return null;
          return (
            <g
              key={p.id}
              transform={`translate(${N.x} ${N.y})`}
              style={{ cursor: "pointer" }}
              onClick={() => scrollToProduct(p.id)}
            >
              <circle r={N.r + 14} fill="transparent" />
              <g
                style={{
                  animation: `node-float 6s ease-in-out ${N.d}s infinite`,
                  transformOrigin: "center",
                  transformBox: "fill-box",
                }}
              >
                <circle r={N.r + 6} fill="none" stroke="var(--accent)" strokeWidth="0.6" opacity="0.25" />
                <circle r={N.r} fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                <g transform="translate(-14 -14)" style={{ color: "var(--accent)" }}>
                  <Glyph kind={p.glyph} size={28} />
                </g>
              </g>
              <g className="node-label" style={{ opacity: 0, pointerEvents: "none" }}>
                <rect
                  x={-46}
                  y={N.r + 8}
                  width="92"
                  height="20"
                  rx="3"
                  fill="var(--card)"
                  stroke="var(--border)"
                  strokeWidth="0.7"
                />
                <text
                  x={0}
                  y={N.r + 22}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="var(--fg)"
                >
                  {p.name}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
