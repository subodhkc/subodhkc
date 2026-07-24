// components/Registry.tsx — filterable/searchable production systems grid + manifest list
"use client";

import * as React from "react";
import { ProductCard } from "./ProductCard";
import { ManifestRow } from "./ManifestRow";
import { PRODUCTS, FILTER_ORDER, KIND_LABEL } from "@/data/products";
import type { ProductKind } from "@/data/products";

type FilterKey = "all" | ProductKind;

interface Props {
  layout?: "grid" | "list";
  showInstall?: boolean;
  glyphStyle?: "outline" | "filled";
  density?: "regular" | "compact";
}

export function Registry({
  layout = "grid",
  showInstall = true,
  glyphStyle = "outline",
  density = "regular",
}: Props) {
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: PRODUCTS.length,
      platform: 0,
      package: 0,
      enterprise: 0,
      tool: 0,
      oss: 0,
    };
    PRODUCTS.forEach((p) => c[p.kind]++);
    return c;
  }, []);

  const filtered = React.useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filter !== "all" && p.kind !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.meta.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, query]);

  return (
    <section id="products" style={{ maxWidth: 1240, margin: "0 auto", padding: "32px 28px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          paddingBottom: 16,
          borderBottom: "1px solid var(--op-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--op-accent)",
            }}
          >
            §01
          </span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--fg)" }}>
            Production systems
          </h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
            showing {String(filtered.length).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--op-border)",
            borderRadius: 999,
            padding: "5px 12px",
            background: "var(--op-card)",
            minWidth: 220,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--op-muted)" strokeWidth="1.4">
            <circle cx="5" cy="5" r="3.5" />
            <line x1="8" y1="8" x2="11" y2="11" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="filter products…"
            style={{
              appearance: "none",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--fg)",
              width: "100%",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "16px 0 24px" }}>
        {FILTER_ORDER.map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              appearance: "none",
              background: filter === k ? "var(--fg)" : "transparent",
              color: filter === k ? "var(--bg)" : "var(--fg)",
              border: `1px solid ${filter === k ? "var(--fg)" : "var(--op-border)"}`,
              borderRadius: 999,
              padding: "5px 11px",
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "background .12s, color .12s, border-color .12s",
            }}
          >
            <span>{k === "all" ? "all" : KIND_LABEL[k].toLowerCase()}</span>
            <span style={{ color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
              {String(counts[k]).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      {layout === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: density === "compact" ? 12 : 16,
            paddingBottom: 60,
          }}
        >
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              showInstall={showInstall}
              glyphStyle={glyphStyle}
              density={density}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            border: "1px solid var(--op-border)",
            borderRadius: 10,
            overflow: "hidden",
            background: "var(--op-card)",
            marginBottom: 60,
          }}
        >
          {filtered.map((p, i) => (
            <ManifestRow key={p.id} product={p} index={i} glyphStyle={glyphStyle} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div
          style={{
            padding: "40px 0 80px",
            textAlign: "center",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
          }}
        >
          no products match. clear the filter to see all {PRODUCTS.length}.
        </div>
      )}
    </section>
  );
}
