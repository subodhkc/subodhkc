// components/InstallLine.tsx — npm/pip install command with copy-to-clipboard
"use client";

import * as React from "react";

interface Props {
  label: string;
  copyText: string;
}

export function InstallLine({ label, copyText }: Props) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        background: "var(--code)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        color: "var(--fg)",
        overflow: "hidden",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ color: "var(--accent)", flexShrink: 0 }}>$</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {copyText || label}
        </span>
      </span>
      <button
        onClick={onCopy}
        title="Copy"
        style={{
          appearance: "none",
          background: "transparent",
          border: "none",
          color: "var(--text-secondary)",
          cursor: "pointer",
          padding: 2,
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8 L7 12 L13 4" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <rect x="4" y="4" width="9" height="9" rx="1" />
            <path d="M11 4 V3 a1 1 0 0 0 -1 -1 H4 a1 1 0 0 0 -1 1 v7" />
          </svg>
        )}
      </button>
    </div>
  );
}
