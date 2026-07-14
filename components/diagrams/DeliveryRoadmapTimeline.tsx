export function DeliveryRoadmapTimeline() {
  const phases = [
    { num: '0', name: 'Define', desc: 'Business value & decision', x: 40 },
    { num: '1', name: 'Architecture', desc: 'Control design & boundaries', x: 150 },
    { num: '2', name: 'Vertical Slice', desc: 'One complete workflow', x: 260 },
    { num: '3', name: 'Production', desc: 'Remove prototype shortcuts', x: 370 },
    { num: '4', name: 'Expand', desc: 'RAG, tools & MCP selectively', x: 480 },
    { num: '5', name: 'Verify & Pilot', desc: 'Real users, realistic conditions', x: 590 },
    { num: '6', name: 'Launch & Operate', desc: 'Monitor, improve, retire', x: 700 },
  ]

  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 840 280"
        className="w-full min-w-[750px] h-auto"
        role="img"
        aria-label="Delivery roadmap timeline with seven phases from Define through Launch and Operate"
      >
        <title>Delivery Roadmap — Seven Phases</title>
        <defs>
          <linearGradient id="dr-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.15)" />
          </linearGradient>
          <marker id="dr-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" />
          </marker>
        </defs>

        {/* Timeline bar */}
        <rect x="30" y="120" width="780" height="4" rx="2" fill="url(#dr-grad)" />

        {phases.map((phase, i) => (
          <g key={i}>
            {/* Circle */}
            <circle cx={phase.x + 50} cy={122} r={18} fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.4)" strokeWidth="2" />
            <text x={phase.x + 50} y={127} textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>{phase.num}</text>

            {/* Phase name */}
            <text x={phase.x + 50} y={162} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>{phase.name}</text>

            {/* Description */}
            <text x={phase.x + 50} y={178} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>{phase.desc}</text>

            {/* Arrow to next */}
            {i < phases.length - 1 && (
              <line x1={phase.x + 68} y1={122} x2={phase.x + 132} y2={122} stroke="hsl(var(--muted-foreground) / 0.3)" strokeWidth="1" markerEnd="url(#dr-arrow)" />
            )}
          </g>
        ))}

        {/* Exit criteria band */}
        <rect x="30" y="200" width="780" height="60" rx="8" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" strokeDasharray="4 2" />
        <text x="420" y="222" textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 600 }}>Exit Criteria</text>
        <text x="420" y={240} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Each phase has measurable exit criteria — the application is not &quot;done&quot; until it is operating, controlled and improvable</text>
        <text x="420" y={254} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>Business, technical and security owners must accept residual risk before go-live</text>
      </svg>
    </div>
  )
}
