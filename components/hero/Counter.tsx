// components/hero/Counter.tsx
"use client";

import * as React from "react";

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  fixed?: number;
  formatK?: boolean;
}

export function Counter({
  value,
  suffix = "",
  prefix = "",
  durationMs = 1400,
  fixed = 0,
  formatK = false,
}: Props) {
  const [n, setN] = React.useState(0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const tick = () => {
              const t = Math.min(1, (performance.now() - t0) / durationMs);
              const eased = 1 - Math.pow(1 - t, 3);
              setN(eased * value);
              if (t < 1) requestAnimationFrame(tick);
              else setN(value);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, durationMs]);

  const fmt = (v: number) => {
    if (formatK && v >= 1000) {
      return (v / 1000).toFixed(v >= 10000 ? 1 : 2).replace(/\.0+$/, "") + "k";
    }
    if (fixed > 0) return v.toFixed(fixed);
    return Math.round(v).toLocaleString("en-US");
  };

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {fmt(n)}
      {suffix}
    </span>
  );
}
