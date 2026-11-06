/** Sourcing ecosystem diagram. Lines represent potential commercial routes, not existing contractual partnerships. */
export function SourcingNetworkDiagram() {
  return (
    <section className="iv-network" aria-label="Asia manufacturing and supplier opportunity network">
      <div className="iv-network-head">
        <span className="iv-eyebrow">Sourcing ecosystem / Multi-region opportunity</span>
        <span className="iv-network-legend">Manufacturer references · Product opportunity mapping</span>
      </div>
      <svg viewBox="0 0 1120 390" className="iv-network-svg" role="img" aria-labelledby="iv-network-title iv-network-desc">
        <title id="iv-network-title">Regional supplier intelligence network</title>
        <desc id="iv-network-desc">Potential China embedded, Taiwan industrial, Vietnam and Malaysia manufacturing, and South Korea sensors categories feed industrial assembly and B2B distribution across Nepal and India.</desc>
        <defs>
          <linearGradient id="iv-network-path" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c7814a"/><stop offset="1" stopColor="#357657"/></linearGradient>
        </defs>
        <g fill="none" stroke="#abc6b0" opacity=".7">
          <path d="M0 194H1120" strokeDasharray="2 10"/>
          <path d="M0 45H1120" strokeDasharray="2 10"/>
          <path d="M0 342H1120" strokeDasharray="2 10"/>
        </g>
        <g className="iv-network-flow" fill="none" stroke="url(#iv-network-path)" strokeWidth="2.3" strokeDasharray="7 9">
          <path d="M305 84C395 84 405 195 525 195"/>
          <path d="M305 154C405 154 417 195 525 195"/>
          <path d="M305 238C410 238 418 195 525 195"/>
          <path d="M305 309C405 309 410 195 525 195"/>
          <path d="M746 195C810 195 840 195 875 195"/>
        </g>
        <g fontFamily="Arial,sans-serif">
          {[
            {y:52,code:"CN",title:"China",sub:"Embedded · sensors"},
            {y:122,code:"TW",title:"Taiwan",sub:"Power · industrial controls"},
            {y:206,code:"VN",title:"Vietnam + Malaysia",sub:"PCBA · harness · box build"},
            {y:277,code:"KR",title:"South Korea",sub:"Industrial sensing"},
          ].map(item=>(
            <g key={item.code} className="iv-network-node">
              <rect x="22" y={item.y} width="283" height="60" rx="10" fill="#fffefa" stroke="#c7d6c9"/>
              <rect x="35" y={item.y+11} width="42" height="38" rx="7" fill="#e8eee6"/>
              <text x="56" y={item.y+34} textAnchor="middle" fontSize="12" fontWeight="700" fill="#327052">{item.code}</text>
              <text x="92" y={item.y+26} fontSize="17" fontFamily="Georgia,serif" fill="#2a5039">{item.title}</text>
              <text x="92" y={item.y+45} fontSize="12" fill="#647a69">{item.sub}</text>
            </g>
          ))}
          <g className="iv-network-node">
            <rect x="525" y="120" width="221" height="150" rx="14" fill="#285e49"/>
            <text x="545" y="149" fontSize="12" fill="#e2c19f" letterSpacing="1.2">PLATFORM</text>
            <text x="545" y="184" fontSize="24" fill="#fff" fontFamily="Georgia,serif">Source</text>
            <text x="545" y="214" fontSize="24" fill="#fff" fontFamily="Georgia,serif">Engineer</text>
            <text x="545" y="244" fontSize="12" fill="#d2e5d6">Qualify · Configure · Deliver</text>
          </g>
          <g className="iv-network-node">
            <rect x="875" y="128" width="222" height="134" rx="14" fill="#fffefa" stroke="#c7d6c9"/>
            <text x="897" y="156" fontSize="12" fill="#bd6d40" letterSpacing="1.2">B2B MARKETS</text>
            <text x="897" y="191" fontSize="26" fontFamily="Georgia,serif" fill="#29513b">India + Nepal</text>
            <text x="897" y="216" fontSize="13" fill="#617a69">Industrial customers</text>
            <text x="897" y="238" fontSize="13" fill="#617a69">Distribution · Service</text>
          </g>
        </g>
      </svg>
      <div className="iv-network-mobile" aria-hidden="true">
        <div><strong>China</strong><span>Embedded electronics and sensors</span></div>
        <div><strong>Taiwan</strong><span>Power and industrial automation</span></div>
        <div><strong>Vietnam / Malaysia</strong><span>PCBA, harness and assembly</span></div>
        <div><strong>South Korea</strong><span>Industrial sensing</span></div>
        <div className="iv-network-center"><strong>Platform</strong><span>Qualify · Engineer · Distribute to India/Nepal</span></div>
      </div>
      <p className="iv-network-note">A diversified supplier research universe, organized by technical capability. Manufacturer authorization and individual product origin remain subject to qualification.</p>
    </section>
  );
}
