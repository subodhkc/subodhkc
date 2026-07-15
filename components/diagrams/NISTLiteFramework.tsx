export function NISTLiteFramework() {
  const quadrants = [
    {
      title: 'Govern',
      x: 20, y: 20, color: 'primary',
      items: ['Assign an AI owner', 'Approve acceptable uses', 'Define prohibited data and actions', 'Maintain vendor and system records'],
    },
    {
      title: 'Map',
      x: 400, y: 20, color: 'accent',
      items: ['Identify users and affected people', 'Understand the business context', 'Classify data', 'Identify possible harm and legal overlap'],
    },
    {
      title: 'Measure',
      x: 20, y: 220, color: 'accent',
      items: ['Test accuracy', 'Test harmful prompts', 'Review discrimination', 'Test security and access', 'Record known limitations'],
    },
    {
      title: 'Manage',
      x: 400, y: 220, color: 'primary',
      items: ['Add controls', 'Require approval where needed', 'Monitor incidents', 'Correct failures', 'Retire unsafe or obsolete systems'],
    },
  ]

  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 780 460"
        className="w-full min-w-[650px] h-auto"
        role="img"
        aria-label="NIST AI Risk Management Framework lite approach for small businesses: four functions — Govern, Map, Measure, and Manage — each with practical activities"
      >
        <title>NIST-Lite Framework for Small Businesses</title>
        <defs>
          <linearGradient id="nl-grad-primary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <linearGradient id="nl-grad-accent" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.03)" />
          </linearGradient>
        </defs>

        {/* Center label */}
        <text x="390" y="225" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>NIST AI RMF</text>
        <text x="390" y="242" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9 }}>Small-Business Lite</text>

        {/* Cross lines */}
        <line x1="390" y1="20" x2="390" y2="440" stroke="hsl(var(--border) / 0.5)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="20" y1="220" x2="760" y2="220" stroke="hsl(var(--border) / 0.5)" strokeWidth="1" strokeDasharray="4 3" />

        {quadrants.map((q, i) => {
          const fill = q.color === 'primary' ? 'url(#nl-grad-primary)' : 'url(#nl-grad-accent)'
          const stroke = q.color === 'primary' ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--accent) / 0.2)'
          return (
            <g key={i}>
              <rect x={q.x} y={q.y} width="350" height="190" rx="12" fill={fill} stroke={stroke} strokeWidth="1.5" />
              <text x={q.x + 175} y={q.y + 30} textAnchor="middle" className="fill-foreground" style={{ fontSize: 14, fontWeight: 700 }}>{q.title}</text>
              {q.items.map((item, j) => (
                <g key={j}>
                  <circle cx={q.x + 25} cy={q.y + 55 + j * 24} r="3" fill="hsl(var(--primary) / 0.5)" />
                  <text x={q.x + 38} y={q.y + 59 + j * 24} className="fill-muted-foreground" style={{ fontSize: 10 }}>{item}</text>
                </g>
              ))}
            </g>
          )
        })}

        {/* Bottom note */}
        <text x="390" y="445" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10, fontStyle: 'italic' }}>
          A small company does not need to imitate a Fortune 100 governance office — it needs deliberate ownership and reasonable controls.
        </text>
      </svg>
    </div>
  )
}
