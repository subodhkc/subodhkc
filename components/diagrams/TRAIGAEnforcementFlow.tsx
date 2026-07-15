export function TRAIGAEnforcementFlow() {
  const steps = [
    { label: 'Consumer Complaint', sub: 'Filed with AG', x: 60, y: 40 },
    { label: 'AG Investigation', sub: 'Review and triage', x: 220, y: 40 },
    { label: 'Civil Investigative Demand', sub: 'System documentation requested', x: 400, y: 40 },
    { label: 'Written Notice', sub: 'Alleged violation identified', x: 600, y: 40 },
    { label: '60-Day Cure Period', sub: 'Business may remedy', x: 220, y: 180, highlight: true },
    { label: 'Cure Documentation', sub: 'Written statement + evidence', x: 400, y: 180 },
    { label: 'Closure', sub: 'No enforcement action', x: 580, y: 180, positive: true },
    { label: 'Enforcement Action', sub: 'Penalties, injunction, fees', x: 580, y: 300, negative: true },
  ]

  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 760 380"
        className="w-full min-w-[650px] h-auto"
        role="img"
        aria-label="TRAIGA enforcement process showing the flow from consumer complaint through AG investigation, civil investigative demand, written notice, 60-day cure period, and either closure or enforcement action"
      >
        <title>TRAIGA Enforcement Process</title>
        <defs>
          <linearGradient id="ef-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="ef-grad-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.15)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
          </linearGradient>
          <linearGradient id="ef-grad-positive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(142 70% 40% / 0.12)" />
            <stop offset="100%" stopColor="hsl(142 70% 40% / 0.03)" />
          </linearGradient>
          <linearGradient id="ef-grad-negative" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 70% 50% / 0.12)" />
            <stop offset="100%" stopColor="hsl(0 70% 50% / 0.03)" />
          </linearGradient>
          <marker id="ef-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground) / 0.5)" />
          </marker>
          <marker id="ef-arrow-positive" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(142 70% 40% / 0.6)" />
          </marker>
          <marker id="ef-arrow-negative" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(0 70% 50% / 0.6)" />
          </marker>
        </defs>

        {/* Top row arrows */}
        <line x1="170" y1="70" x2="220" y2="70" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="350" y1="70" x2="400" y2="70" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="550" y1="70" x2="600" y2="70" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />

        {/* Down arrow from Written Notice to Cure Period */}
        <line x1="660" y1="90" x2="660" y2="140" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="660" y1="140" x2="300" y2="140" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" />
        <line x1="300" y1="140" x2="300" y2="180" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />

        {/* Second row arrows */}
        <line x1="350" y1="210" x2="400" y2="210" stroke="hsl(var(--muted-foreground) / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow)" />
        <line x1="530" y1="210" x2="580" y2="210" stroke="hsl(142 70% 40% / 0.5)" strokeWidth="1.5" markerEnd="url(#ef-arrow-positive)" />

        {/* Branch from Cure Documentation to Enforcement Action (cure failed) */}
        <line x1="465" y1="230" x2="465" y2="300" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="465" y1="300" x2="580" y2="300" stroke="hsl(0 70% 50% / 0.4)" strokeWidth="1.5" markerEnd="url(#ef-arrow-negative)" />
        <text x="470" y="270" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Cure failed</text>

        {/* Steps */}
        {steps.map((step, i) => {
          const fill = step.negative
            ? 'url(#ef-grad-negative)'
            : step.positive
              ? 'url(#ef-grad-positive)'
              : step.highlight
                ? 'url(#ef-grad-highlight)'
                : 'url(#ef-grad)'
          const stroke = step.negative
            ? 'hsl(0 70% 50% / 0.3)'
            : step.positive
              ? 'hsl(142 70% 40% / 0.3)'
              : step.highlight
                ? 'hsl(var(--accent) / 0.3)'
                : 'hsl(var(--primary) / 0.2)'
          return (
            <g key={i}>
              <rect x={step.x} y={step.y} width="150" height="60" rx="10" fill={fill} stroke={stroke} strokeWidth="1.5" />
              <text x={step.x + 75} y={step.y + 25} textAnchor="middle" className="fill-foreground" style={{ fontSize: 11, fontWeight: 700 }}>{step.label}</text>
              <text x={step.x + 75} y={step.y + 44} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>{step.sub}</text>
            </g>
          )
        })}

        {/* Legend */}
        <text x="60" y="360" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>
          The AG must generally give written notice and wait 60 days before bringing an enforcement action.
        </text>
      </svg>
    </div>
  )
}
