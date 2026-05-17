// components/hero/Aurora.tsx — cursor-following accent glow
"use client";

import * as React from "react";

export function Aurora() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 50, ty = 50;
    let cx = 50, cy = 50;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--ax", `${cx}%`);
      el.style.setProperty("--ay", `${cy}%`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(420px 320px at var(--ax,50%) var(--ay,30%), color-mix(in oklab, var(--accent) 22%, transparent), transparent 70%)",
        opacity: 0.55,
        transition: "background 0.06s linear",
      }}
    />
  );
}
