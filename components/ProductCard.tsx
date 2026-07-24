// components/ProductCard.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Glyph } from "./Glyph";
import { InstallLine } from "./InstallLine";
import { useRequestAccess } from "./AccessProvider";
import type { Product, ProductStatus } from "@/data/products";

interface Props {
  product: Product;
  index: number;
  showInstall: boolean;
  glyphStyle: "outline" | "filled";
  density: "regular" | "compact";
}

const STATUS_COLOR: Record<ProductStatus, string> = {
  live: "#0a8a4a",
  stable: "#0a8a4a",
  beta: "#c79a2a",
  soon: "#a0a0a0",
};

function StatusDot({ status }: { status: ProductStatus }) {
  return (
    <span
      title={status}
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: STATUS_COLOR[status],
        flexShrink: 0,
      }}
    />
  );
}

function Arrow({ kind = "right" }: { kind?: "right" | "ext" }) {
  if (kind === "ext") {
    return (
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8 L8 4" />
        <path d="M5 4 H8 V7" />
      </svg>
    );
  }
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6 H9" />
      <path d="M7 4 L9 6 L7 8" />
    </svg>
  );
}

export function ProductCard({ product, index, showInstall, glyphStyle, density }: Props) {
  const isInstall = product.primary.type === "install";
  const showCmd = showInstall && isInstall && !product.gated;
  const isExt = product.primary.href.startsWith("http");
  const compact = density === "compact";
  const requestAccess = useRequestAccess();

  // staggered fade-in on scroll
  const ref = React.useRef<HTMLElement>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPrimary = (e: React.MouseEvent) => {
    if (product.gated) {
      e.preventDefault();
      requestAccess(product);
    }
  };

  return (
    <article
      ref={ref as any}
      id={`product-${product.id}`}
      style={{
        background: "var(--op-card)",
        border: "1px solid var(--op-border)",
        borderRadius: 10,
        padding: compact ? 14 : 18,
        display: "flex",
        flexDirection: "column",
        gap: compact ? 10 : 14,
        position: "relative",
        transition:
          "background .15s, border-color .15s, transform .15s, opacity .5s, translate .5s",
        minHeight: compact ? 180 : 220,
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 14px",
        transitionDelay: visible ? `${Math.min(index, 9) * 40}ms` : "0ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--card-hover)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--fg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--op-card)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--op-border)";
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--op-muted)",
          letterSpacing: "0.05em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <header>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "var(--chip)",
            display: "grid",
            placeItems: "center",
            color: "var(--op-accent)",
            flexShrink: 0,
          }}
        >
          <Glyph kind={product.glyph} size={26} style={glyphStyle} />
        </div>
      </header>

      <div>
        <h3
          style={{
            margin: 0,
            fontSize: compact ? 16 : 18,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--fg)",
          }}
        >
          {product.name}
          <StatusDot status={product.status} />
        </h3>
        <p
          style={{
            margin: "3px 0 0",
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--text-secondary)",
          }}
        >
          {product.meta}
        </p>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: compact ? 13 : 13.5,
          lineHeight: 1.55,
          color: "var(--text-secondary)",
          flex: 1,
          textWrap: "pretty",
        }}
      >
        {product.tagline}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {showCmd ? (
          <InstallLine label={product.primary.label} copyText={product.primary.copyText || product.primary.label} />
        ) : isExt && !product.gated ? (
          <a
            href={product.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onPrimary}
            style={primaryLinkStyle}
          >
            <span>{product.primary.label}</span>
            <Arrow kind="ext" />
          </a>
        ) : product.gated ? (
          <button onClick={(e) => onPrimary(e as any)} style={{ ...primaryLinkStyle, cursor: "pointer", appearance: "none", width: "100%" }}>
            <span>{product.primary.label}</span>
            <Arrow kind="right" />
          </button>
        ) : (
          <Link href={product.primary.href} style={primaryLinkStyle}>
            <span>{product.primary.label}</span>
            <Arrow kind="right" />
          </Link>
        )}

        {product.secondary && (
          <a
            href={product.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-secondary)",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "0 2px",
            }}
          >
            {product.secondary.label}
            <Arrow kind="ext" />
          </a>
        )}
      </div>
    </article>
  );
}

const primaryLinkStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  fontWeight: 500,
  color: "var(--op-accent)",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 10px",
  border: "1px solid var(--op-border)",
  borderRadius: 6,
  background: "var(--code)",
  justifyContent: "space-between",
  textDecoration: "none",
};
