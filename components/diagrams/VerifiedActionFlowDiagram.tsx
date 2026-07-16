export function VerifiedActionFlowDiagram() {
  return (
    <div className="my-8 w-full overflow-x-auto">
      <svg
        viewBox="0 0 800 640"
        className="w-full min-w-[600px] h-auto"
        role="img"
        aria-label="Verified action flow diagram comparing a weak booking workflow with a controlled booking workflow that checks authoritative tool results"
      >
        <title>Verified Action Flow: Weak vs Controlled</title>
        <defs>
          <linearGradient id="va-weak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 72% 51% / 0.12)" />
            <stop offset="100%" stopColor="hsl(0 72% 51% / 0.03)" />
          </linearGradient>
          <linearGradient id="va-controlled" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary) / 0.12)" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.03)" />
          </linearGradient>
          <marker id="va-c-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary) / 0.6)" />
          </marker>
          <marker id="va-w-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(0 72% 51% / 0.5)" />
          </marker>
        </defs>

        {/* Headers */}
        <text x="200" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700, fill: 'hsl(0 72% 51%)' }}>Weak Workflow</text>
        <text x="600" y="22" textAnchor="middle" className="fill-foreground" style={{ fontSize: 12, fontWeight: 700 }}>Controlled Workflow</text>

        {/* Weak flow background */}
        <rect x="40" y="35" width="320" height="590" rx="12" fill="url(#va-weak)" stroke="hsl(0 72% 51% / 0.2)" strokeWidth="1.5" />

        {/* Controlled flow background */}
        <rect x="440" y="35" width="320" height="590" rx="12" fill="url(#va-controlled)" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1.5" />

        {/* Weak flow steps */}
        {[
          { y: 55, label: 'Hear "Tuesday afternoon"' },
          { y: 115, label: 'Assume 2:00 p.m.' },
          { y: 175, label: 'Attempt calendar call' },
          { y: 235, label: 'Say "confirmed" — even if tool fails' },
        ].map((step, i, arr) => (
          <g key={step.label}>
            <rect x="70" y={step.y} width="260" height="40" rx="6" fill="hsl(var(--background))" stroke="hsl(0 72% 51% / 0.3)" strokeWidth="1" />
            <text x="200" y={step.y + 24} textAnchor="middle" className="fill-foreground" style={{ fontSize: 10 }}>{step.label}</text>
            {i < arr.length - 1 && (
              <line x1="200" y1={step.y + 40} x2="200" y2={step.y + 58} stroke="hsl(0 72% 51% / 0.4)" strokeWidth="1.5" markerEnd="url(#va-w-arrow)" />
            )}
          </g>
        ))}

        {/* Weak result */}
        <rect x="70" y="295" width="260" height="48" rx="6" fill="hsl(0 72% 51% / 0.1)" stroke="hsl(0 72% 51% / 0.4)" strokeWidth="1.5" />
        <text x="200" y="315" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Result: Caller shows up</text>
        <text x="200" y="331" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>at a time that was never booked</text>

        {/* Weak problems */}
        <text x="200" y="370" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 9, fontWeight: 600 }}>Problems</text>
        {[
          'No caller name captured',
          'No phone confirmation',
          'No availability check',
          'No result verification',
          'Claims success without proof',
        ].map((p, i) => (
          <text key={i} x="90" y={390 + i * 18} className="fill-muted-foreground" style={{ fontSize: 9 }}>✗ {p}</text>
        ))}

        {/* Controlled flow steps */}
        {[
          { y: 55, label: '1. Capture caller name' },
          { y: 100, label: '2. Confirm phone number' },
          { y: 145, label: '3. Identify service & location' },
          { y: 190, label: '4. Check actual availability' },
          { y: 235, label: '5. Offer valid options' },
          { y: 280, label: '6. Repeat selected date & time' },
          { y: 325, label: '7. Obtain caller confirmation' },
          { y: 370, label: '8. Execute booking' },
          { y: 415, label: '9. Inspect authoritative result' },
          { y: 460, label: '10. Report success only if confirmed' },
        ].map((step, i, arr) => (
          <g key={step.label}>
            <rect x="470" y={step.y} width="260" height="36" rx="6" fill="hsl(var(--background))" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" />
            <text x="600" y={step.y + 22} textAnchor="middle" className="fill-foreground" style={{ fontSize: 10 }}>{step.label}</text>
            {i < arr.length - 1 && (
              <line x1="600" y1={step.y + 36} x2="600" y2={step.y + 50} stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" markerEnd="url(#va-c-arrow)" />
            )}
          </g>
        ))}

        {/* Controlled result */}
        <rect x="470" y="510" width="260" height="48" rx="6" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" />
        <text x="600" y="530" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>Result: Booking confirmed</text>
        <text x="600" y="546" textAnchor="middle" className="fill-foreground" style={{ fontSize: 10, fontWeight: 600 }}>only when the system says so</text>

        {/* Principle */}
        <rect x="470" y="575" width="260" height="36" rx="6" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--primary) / 0.15)" strokeWidth="1" />
        <text x="600" y="597" textAnchor="middle" className="fill-primary" style={{ fontSize: 9, fontWeight: 600 }}>Success = tool confirms, not AI tries</text>
      </svg>
    </div>
  )
}
