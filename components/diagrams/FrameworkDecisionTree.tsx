export function FrameworkDecisionTree() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 860 560"
        className="w-full min-w-[700px] h-auto"
        role="img"
        aria-label="Decision tree for choosing a Python AI application framework: internal vs public, data-heavy vs model-centric, analytics vs general, leading to Streamlit, Gradio, Dash, Panel, NiceGUI, Reflex, or Next.js plus FastAPI"
      >
        <title>Framework Selection Decision Tree</title>
        <defs>
          <linearGradient id="fdt-grad-q" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="fdt-grad-leaf" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.10)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
          <marker id="fdt-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" />
          </marker>
          <marker id="fdt-arrow-yes" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary) / 0.6)" />
          </marker>
        </defs>

        {/* Root: Internal or public-facing? */}
        <rect x="300" y="16" width="260" height="50" rx="10" fill="url(#fdt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="430" y="38" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Internal or public-facing?</text>
        <text x="430" y="54" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Determines UX and scaling needs</text>

        {/* Branch lines */}
        <line x1="430" y1="66" x2="430" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="180" y1="86" x2="680" y2="86" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="180" y1="86" x2="180" y2="106" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="680" y1="86" x2="680" y2="106" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />

        <text x="230" y="82" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Internal</text>
        <text x="620" y="82" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Public / customer-facing</text>

        {/* Internal branch: Data-heavy or model-centric? */}
        <rect x="60" y="110" width="240" height="50" rx="10" fill="url(#fdt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="180" y="132" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Data-heavy or model-centric?</text>
        <text x="180" y="148" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Broad workflow vs focused AI</text>

        {/* Public branch: Next.js + FastAPI */}
        <rect x="560" y="110" width="240" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="680" y="132" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Next.js + FastAPI</text>
        <text x="680" y="148" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Custom UX, branding, scaling</text>

        {/* Internal branch lines */}
        <line x1="180" y1="160" x2="180" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="280" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="80" y1="180" x2="80" y2="200" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="280" y1="180" x2="280" y2="200" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />

        <text x="110" y="176" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Data-heavy</text>
        <text x="230" y="176" className="fill-muted-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Model-centric</text>

        {/* Data-heavy: Analytics focus? */}
        <rect x="10" y="204" width="160" height="50" rx="10" fill="url(#fdt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="90" y="226" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Analytics focus?</text>
        <text x="90" y="242" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Dashboards, plots</text>

        {/* Model-centric: Gradio */}
        <rect x="220" y="204" width="120" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="280" y="226" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Gradio</text>
        <text x="280" y="242" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>ChatInterface, multimodal</text>

        {/* Analytics branch */}
        <line x1="90" y1="254" x2="90" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="40" y1="274" x2="140" y2="274" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="40" y1="274" x2="40" y2="294" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="140" y1="274" x2="140" y2="294" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />

        <text x="45" y="270" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Yes</text>
        <text x="120" y="270" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>No</text>

        {/* Dash */}
        <rect x="5" y="298" width="90" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="50" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Dash</text>
        <text x="50" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Plotly, callbacks</text>

        {/* Not analytics: Event-driven? */}
        <rect x="100" y="298" width="120" height="50" rx="10" fill="url(#fdt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="160" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Event-driven?</text>
        <text x="160" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>vs script rerun</text>

        {/* Event-driven branch */}
        <line x1="160" y1="348" x2="160" y2="368" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="120" y1="368" x2="200" y2="368" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="120" y1="368" x2="120" y2="388" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="200" y1="368" x2="200" y2="388" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />

        <text x="125" y="364" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Yes</text>
        <text x="175" y="364" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>No</text>

        {/* NiceGUI */}
        <rect x="75" y="392" width="90" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="120" y="414" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>NiceGUI</text>
        <text x="120" y="430" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Event-driven</text>

        {/* Full product? */}
        <rect x="180" y="392" width="120" height="50" rx="10" fill="url(#fdt-grad-q)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="240" y="414" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Full product?</text>
        <text x="240" y="430" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Polished app</text>

        {/* Full product branch */}
        <line x1="240" y1="442" x2="240" y2="462" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="200" y1="462" x2="280" y2="462" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="200" y1="462" x2="200" y2="482" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" markerEnd="url(#fdt-arrow-yes)" />
        <line x1="280" y1="462" x2="280" y2="482" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#fdt-arrow)" />

        <text x="205" y="458" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Yes</text>
        <text x="255" y="458" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>No</text>

        {/* Reflex */}
        <rect x="155" y="486" width="90" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="200" y="508" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Reflex</text>
        <text x="200" y="524" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Full-stack Python</text>

        {/* Streamlit */}
        <rect x="235" y="486" width="90" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="280" y="508" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Streamlit</text>
        <text x="280" y="524" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Forms, chat, data</text>

        {/* Panel — separate leaf from data-heavy not-analytics path */}
        <rect x="340" y="298" width="90" height="50" rx="8" fill="url(#fdt-grad-leaf)" stroke="hsl(var(--accent) / 0.3)" strokeWidth="1.5" />
        <text x="385" y="320" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>Panel</text>
        <text x="385" y="336" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>PyData, notebooks</text>

        {/* Connector to Panel from the "No analytics" path */}
        <line x1="140" y1="274" x2="385" y2="274" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="385" y1="274" x2="385" y2="298" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#fdt-arrow)" />
        <text x="360" y="270" className="fill-muted-foreground" style={{ fontSize: 9 }}>PyData team?</text>

        {/* MCP Server leaf */}
        <rect x="460" y="204" width="160" height="50" rx="8" fill="hsl(var(--primary) / 0.08)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
        <text x="540" y="226" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>MCP Server</text>
        <text x="540" y="242" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Shared tools across apps</text>

        <line x1="430" y1="86" x2="540" y2="86" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="540" y1="86" x2="540" y2="204" stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#fdt-arrow)" />
        <text x="545" y="100" className="fill-muted-foreground" style={{ fontSize: 9 }}>Reuse needed?</text>
      </svg>
    </div>
  )
}
