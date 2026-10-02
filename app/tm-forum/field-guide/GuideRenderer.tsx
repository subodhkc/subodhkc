"use client";

import { useEffect, useRef } from "react";

type GuideRendererProps = {
  html: string;
  css: string;
};

export function GuideRenderer({ html, css }: GuideRendererProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    root.innerHTML = `<style>${css}</style><div class="tmf-guide-body">${html}</div>`;

    const onClick = (event: Event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const destination = root.querySelector(href);
      if (!destination) return;
      event.preventDefault();
      destination.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    };

    root.addEventListener("click", onClick);

    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>(".navlinks a"));
    const sections = links
      .map((link) => root.querySelector<HTMLElement>(link.getAttribute("href") || ""))
      .filter((section): section is HTMLElement => Boolean(section));

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window && sections.length) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            links.forEach((link) => link.classList.remove("active"));
            const match = links.find(
              (link) => link.getAttribute("href") === `#${(entry.target as HTMLElement).id}`,
            );
            match?.classList.add("active");
          }
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
      );
      sections.forEach((section) => observer?.observe(section));
    }

    return () => {
      root.removeEventListener("click", onClick);
      observer?.disconnect();
    };
  }, [html, css]);

  return <div ref={hostRef} />;
}
