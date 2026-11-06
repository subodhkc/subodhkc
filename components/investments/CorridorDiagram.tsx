import React from "react";

/** Decorative, accessible supply-chain diagram shared by the investment pages. */
export function CorridorDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <div className="iv-corridor" role="group" aria-label="Electronics corridor from Asian manufacturing through Nepal assembly to India and Nepal business customers">
      <div className="iv-corridor-inner">
        <div className="iv-corridor-top">
          <span>Investment architecture / Regional supply chain</span>
          <span>Source → Integrate → Distribute</span>
        </div>
        <svg className="iv-corridor-svg" viewBox="0 0 1000 315" role="img" aria-labelledby="iv-diagram-title iv-diagram-desc">
          <title id="iv-diagram-title">Three-stage regional electronics platform</title>
          <desc id="iv-diagram-desc">Asian electronics manufacturing connects to Nepal engineering and assembly, which connects to Nepal and India industrial business buyers.</desc>
          <defs>
            <linearGradient id="iv-diagram-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff"/>
              <stop offset="1" stopColor="#e5efe4"/>
            </linearGradient>
            <linearGradient id="iv-diagram-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#b66d3d"/>
              <stop offset=".5" stopColor="#6e9c7e"/>
              <stop offset="1" stopColor="#23664d"/>
            </linearGradient>
          </defs>
          <g opacity=".38" stroke="#a8c6b0" fill="none">
            <circle cx="500" cy="152" r="132" strokeDasharray="3 10"/>
            <circle cx="500" cy="152" r="95" strokeDasharray="3 10"/>
            <path d="M0 154H1000" strokeDasharray="2 14"/>
          </g>
          <path className="iv-flow-line" d="M265 149 C310 149 319 149 370 149" stroke="url(#iv-diagram-line)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path className="iv-flow-line" d="M628 149 C676 149 693 149 740 149" stroke="url(#iv-diagram-line)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <g className="iv-node">
            <rect x="22" y="72" width="242" height="157" rx="14" fill="url(#iv-diagram-fill)" stroke="#b6c8b9" strokeWidth="2"/>
            <rect x="38" y="90" width="56" height="4" rx="2" fill="#b86b3c"/>
            <text x="38" y="121" fontSize="12" letterSpacing="2" fill="#aa663d" fontFamily="Arial,sans-serif">01 / SOURCE</text>
            <text x="38" y="155" fontSize="24" fill="#244d3c" fontFamily="Georgia,serif">Asian supply</text>
            <text x="38" y="181" fontSize="13" fill="#586d60" fontFamily="Arial,sans-serif">China · Taiwan · EMS</text>
            <text x="38" y="204" fontSize="12" fill="#69796b" fontFamily="Arial,sans-serif">Components and systems</text>
          </g>
          <g className="iv-node">
            <rect x="370" y="52" width="258" height="195" rx="15" fill="#285c47" stroke="#285c47" strokeWidth="2"/>
            <rect x="388" y="71" width="60" height="4" rx="2" fill="#e3b483"/>
            <text x="388" y="103" fontSize="12" letterSpacing="2" fill="#e8c09c" fontFamily="Arial,sans-serif">02 / CREATE VALUE</text>
            <text x="388" y="144" fontSize="28" fill="#ffffff" fontFamily="Georgia,serif">Nepal</text>
            <text x="388" y="175" fontSize="24" fill="#ffffff" fontFamily="Georgia,serif">engineering</text>
            <text x="388" y="204" fontSize="13" fill="#d4e7d7" fontFamily="Arial,sans-serif">Assembly · Testing · Integration</text>
            <circle cx="590" cy="92" r="10" fill="#b2d3b9" opacity=".9"/>
          </g>
          <g className="iv-node">
            <rect x="740" y="72" width="238" height="157" rx="14" fill="url(#iv-diagram-fill)" stroke="#b6c8b9" strokeWidth="2"/>
            <rect x="756" y="90" width="56" height="4" rx="2" fill="#398768"/>
            <text x="756" y="121" fontSize="12" letterSpacing="2" fill="#367455" fontFamily="Arial,sans-serif">03 / MARKET</text>
            <text x="756" y="155" fontSize="24" fill="#244d3c" fontFamily="Georgia,serif">India + Nepal</text>
            <text x="756" y="181" fontSize="13" fill="#586d60" fontFamily="Arial,sans-serif">B2B channel distribution</text>
            <text x="756" y="204" fontSize="12" fill="#69796b" fontFamily="Arial,sans-serif">Deployment and service</text>
          </g>
          <g fill="#3d6d54" fontSize="12" fontFamily="Arial,sans-serif" textAnchor="middle">
            <text x="320" y="135">Supply</text>
            <text x="685" y="135">Market</text>
          </g>
          <g fill="#557665" fontSize="12" fontFamily="Arial,sans-serif">
            <text x="23" y="280">Product sourcing</text>
            <text x="370" y="280">Higher-value industrial solutions</text>
            <text x="742" y="280">Recurring B2B demand</text>
          </g>
        </svg>
        {!compact && (
          <div className="iv-corridor-caption">
            <span>Global manufacturing access</span>
            <span>Regional assembly and integration</span>
            <span>Distribution with lifecycle services</span>
          </div>
        )}
      </div>
    </div>
  );
}
