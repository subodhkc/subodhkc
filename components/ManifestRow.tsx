// components/ManifestRow.tsx — list layout row for the production systems grid
"use client";

import * as React from "react";
import Link from "next/link";
import { Glyph } from "./Glyph";
import { useRequestAccess } from "./AccessProvider";
import type { Product, ProductStatus } from "@/data/products";

const STATUS_COLOR: Record<ProductStatus, string> = {
  live: "#0a8a4a",
  stable: "#0a8a4a",
  beta: "#c79a2a",
  soon: "#a0a0a0",
};

interface Props {
  product: Product;
  index: number;
  glyphStyle: "outline" | "filled";
}

export function ManifestRow({ product, index, glyphStyle }: Props) {
  const isExt = product.primary.href.startsWith("http");
  const requestAccess = useRequestAccess();

  const onClick = (e: React.MouseEvent) => {
    if (product.gated) {
      e.preventDefault();
      requestAccess(product);
    }
  };

  const sharedStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "40px 44px 1.5fr 2fr 1fr 14px",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    borderBottom: "1px solid var(--op-border)",
    color: "var(--fg)",
    transition: "background .12s",
  };

  const inner = (
    <>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-secondary)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          background: "var(--chip)",
          display: "grid",
          placeItems: "center",
          color: "var(--op-accent)",
        }}
      >
        <Glyph kind={product.glyph} size={22} style={glyphStyle} />
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{product.name}</span>
        <span
          aria-label={product.status}
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: STATUS_COLOR[product.status],
          }}
        />
      </span>
      <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.45 }}>{product.tagline}</span>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--text-secondary)",
          textAlign: "right",
        }}
      >
        {product.meta}
      </span>
      <span style={{ color: "var(--text-secondary)" }}>↗</span>
    </>
  );

  const onEnter = (e: React.MouseEvent<HTMLElement>) =>
    ((e.currentTarget as HTMLElement).style.background = "var(--card-hover)");
  const onLeave = (e: React.MouseEvent<HTMLElement>) =>
    ((e.currentTarget as HTMLElement).style.background = "transparent");

  if (isExt && !product.gated) {
    return (
      <a
        href={product.primary.href}
        target="_blank"
        rel="noopener noreferrer"
        style={sharedStyle}
        onClick={onClick}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {inner}
      </a>
    );
  }

  if (product.gated) {
    return (
      <button
        type="button"
        onClick={(e) => onClick(e as any)}
        style={{ ...sharedStyle, appearance: "none", border: "none", background: "transparent", width: "100%", cursor: "pointer", textAlign: "left", borderBottom: "1px solid var(--op-border)" }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={product.primary.href} style={sharedStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {inner}
    </Link>
  );
}
