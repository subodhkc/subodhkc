'use client'

import { useState, ReactNode } from 'react'

interface MobileCollapsibleProps {
  /** Label shown on the toggle button (mobile only) */
  label: string
  /** Section number prefix, e.g. "01" */
  num?: string
  children: ReactNode
}

/**
 * Wraps section content so that on mobile (max-width: 720px) it can be
 * collapsed/expanded via a toggle. On desktop the content is always visible.
 */
export function MobileCollapsible({ label, num, children }: MobileCollapsibleProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle - only visible on small screens */}
      <button
        type="button"
        className="mc-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{ display: 'none' }}
      >
        {num && <span className="mc-num">{num}</span>}
        <span className="mc-label">{label}</span>
        <span className="mc-chevron" aria-hidden="true">
          {open ? '\u2212' : '+'}
        </span>
      </button>

      <div className={open ? 'mc-content mc-open' : 'mc-content mc-closed'}>
        {children}
      </div>

      <style>{`
        @media (max-width: 720px) {
          .mc-toggle {
            display: flex !important;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 16px 20px;
            border: 1px solid var(--op-border);
            border-radius: 12px;
            background: var(--op-card);
            color: var(--fg);
            font-family: inherit;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 12px;
            transition: border-color 0.2s;
          }
          .mc-toggle:hover {
            border-color: var(--op-accent);
          }
          .mc-num {
            font-family: var(--font-mono);
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--op-accent);
            flex-shrink: 0;
          }
          .mc-label {
            flex: 1;
            text-align: left;
          }
          .mc-chevron {
            font-size: 22px;
            font-weight: 300;
            color: var(--op-muted);
            flex-shrink: 0;
            line-height: 1;
          }
          .mc-content {
            transition: max-height 0.3s ease, opacity 0.3s ease;
            overflow: hidden;
          }
          .mc-closed {
            max-height: 0;
            opacity: 0;
            pointer-events: none;
          }
          .mc-open {
            max-height: none;
            opacity: 1;
          }
        }
        @media (min-width: 721px) {
          .mc-toggle { display: none !important; }
          .mc-content {
            max-height: none !important;
            opacity: 1 !important;
            overflow: visible !important;
            pointer-events: auto !important;
          }
        }
      `}</style>
    </>
  )
}
